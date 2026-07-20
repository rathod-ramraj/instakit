import axios from 'axios';
import https from 'https';
import dns from 'dns';

// Custom DNS lookup to override broken OS resolver for api.socialkit.dev
const customLookup = (hostname, options, callback) => {
  if (hostname === 'api.socialkit.dev') {
    return callback(null, [{ address: '69.46.46.22', family: 4 }]);
  }
  return dns.lookup(hostname, options, callback);
};

const customAgent = new https.Agent({
  lookup: customLookup
});

// Helper to scrape metadata using Axios with Googlebot crawler User-Agent (fast and works 100% on Vercel)
async function scrapeWithAxios(url) {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    },
    timeout: 8000
  });

  const html = res.data;
  const getMeta = (prop) => {
    const regex = new RegExp(`<meta[^>]*?(?:property|name)=["']${prop}["'][^>]*?content=["']([^"']+)["']`, 'i');
    const match = html.match(regex);
    return match ? match[1].replace(/&amp;/g, '&').replace(/\\u0026/g, '&') : null;
  };

  const title = getMeta('og:title');
  const type = getMeta('og:type');
  const description = getMeta('description');
  let image = getMeta('og:image');
  let video = getMeta('og:video') || getMeta('og:video:secure_url');

  if (image) {
    const filenameMatch = image.match(/\/([a-zA-Z0-9_\.-]+\.jpg)/);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      const hdRegex = new RegExp(`https?:[^"']+\\b${filename}[^"']*`, 'gi');
      const matches = html.match(hdRegex) || [];
      const cleanMatches = Array.from(new Set(matches.map(m => m.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').replace(/\\/g, ''))));
      
      const hdCandidate = cleanMatches.find(m => m.includes('1080x1080') || m.includes('p1080x1080'));
      if (hdCandidate) {
        image = hdCandidate;
      } else {
        const subHdCandidate = cleanMatches.find(m => m.includes('750x750') || m.includes('720x720'));
        if (subHdCandidate) {
          image = subHdCandidate;
        }
      }
    }
  }

  return { title, type, description, image, video };
}

// Helper to scrape profile avatars using Puppeteer (only active if puppeteer launches successfully)
async function scrapeProfileWithPuppeteer(url) {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (e) {
    console.log('[Vercel API] Puppeteer not imported, using Axios fallback');
    return null;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2500));

    const metadata = await page.evaluate(() => {
      const getMeta = (prop) => {
        const el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
        return el ? el.getAttribute('content') : null;
      };
      
      let profileImg = null;
      const images = Array.from(document.querySelectorAll('img'));
      const profilePicUrls = images
        .filter(img => {
          const alt = img.getAttribute('alt') || '';
          return alt.toLowerCase().includes('profile picture') || img.className.includes('avatar');
        })
        .map(img => img.src);
        
      if (profilePicUrls.length > 0) {
        profilePicUrls.sort((a, b) => {
          const score = (url) => {
            if (url.includes('s640x640')) return 4;
            if (url.includes('s320x320')) return 3;
            if (url.includes('s150x150')) return 2;
            if (url.includes('s100x100')) return 1;
            return 0;
          };
          return score(b) - score(a);
        });
        profileImg = profilePicUrls[0];
      }
      
      return {
        title: getMeta('og:title'),
        type: getMeta('og:type'),
        image: profileImg || getMeta('og:image'),
        video: null,
        description: getMeta('description')
      };
    });

    await browser.close();
    return metadata;
  } catch (err) {
    console.error('[Vercel API] Puppeteer failed on serverless:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let { url } = req.body || {};
  if (!url && req.query) {
    url = req.query.url;
  }

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const fullCleanedMatch = url.match(/(https?:\/\/[^\s]+)/);
  if (fullCleanedMatch) {
    url = fullCleanedMatch[1];
  }

  if (!url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Please enter a valid Instagram URL' });
  }

  try {
    const isProfileUrl = !url.includes('/p/') && !url.includes('/reel/') && !url.includes('/tv/') && !url.includes('/reels/');
    let metadata = null;

    if (isProfileUrl) {
      // Try Puppeteer (works on localhost), fallback to Axios on serverless Vercel
      metadata = await scrapeProfileWithPuppeteer(url);
      if (!metadata) {
        console.log('[Vercel API] Running Axios crawl fallback for profile...');
        metadata = await scrapeWithAxios(url);
      }
    } else {
      metadata = await scrapeWithAxios(url);
    }

    if (!metadata || (!metadata.image && !metadata.video)) {
      throw new Error('Could not find any media content. Make sure the link is public and valid.');
    }

    let videoUrl = metadata.video;
    const isVideoUrl = url.includes('/reel/') || url.includes('/tv/') || url.includes('/video/');
    const type = (isVideoUrl || !!videoUrl) ? 'reel' : 'photo';
    
    if (isVideoUrl && !videoUrl) {
      try {
        const fallbackRes = await axios.get('https://api.socialkit.dev/instagram/download', {
          httpsAgent: customAgent,
          params: {
            access_key: 'tOdX91RFER1JlZ',
            url: url
          },
          timeout: 15000
        });
        if (fallbackRes.data && fallbackRes.data.success && fallbackRes.data.data.downloadUrl) {
          videoUrl = fallbackRes.data.data.downloadUrl;
        }
      } catch (err) {
        console.error('[Vercel API] SocialKit fallback failed:', err.message);
      }
    }

    let author = 'instagram_user';
    if (metadata.title) {
      const parenMatch = metadata.title.match(/\(([^)]+)\)/);
      if (parenMatch && parenMatch[1].startsWith('@')) {
        author = parenMatch[1].replace('@', '');
      } else {
        const titleMatch = metadata.title.match(/@([a-zA-Z0-9_\.]+)/);
        if (titleMatch) author = titleMatch[1];
      }
    }
    
    if (author === 'instagram_user' && metadata.description) {
      const descMatch = metadata.description.match(/-\s+([a-zA-Z0-9_\.]+)\s+on/);
      if (descMatch) author = descMatch[1];
    }

    let caption = '';
    if (metadata.description) {
      const captionMatch = metadata.description.match(/:\s+"([\s\S]*)"/);
      if (captionMatch) {
        caption = captionMatch[1];
      } else {
        caption = metadata.description;
      }
    }

    caption = caption.replace(/\\n/g, '\n').trim();

    return res.status(200).json({
      success: true,
      type,
      thumbnail: metadata.image,
      video: videoUrl || null,
      caption,
      author
    });

  } catch (error) {
    console.error('[Vercel API] Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to extract media' });
  }
}
