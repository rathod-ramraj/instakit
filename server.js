import express from 'express';
import cors from 'cors';
import axios from 'axios';
import puppeteer from 'puppeteer';
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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3001;

// Helper to scrape metadata using Axios with Googlebot crawler User-Agent (extremely fast, resolves in 1.2s!)
async function scrapeWithAxios(url) {
  console.log(`[Axios Crawler] Fetching URL: ${url}`);
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

  // Search the raw static HTML dump for a high-definition 1080x1080 version of the image
  if (image) {
    const filenameMatch = image.match(/\/([a-zA-Z0-9_\.-]+\.jpg)/);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      // Match URLs that contain this filename
      const hdRegex = new RegExp(`https?:[^"']+\\b${filename}[^"']*`, 'gi');
      const matches = html.match(hdRegex) || [];
      const cleanMatches = Array.from(new Set(matches.map(m => m.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').replace(/\\/g, ''))));
      
      // Prioritize 1080x1080 resolution
      const hdCandidate = cleanMatches.find(m => m.includes('1080x1080') || m.includes('p1080x1080'));
      if (hdCandidate) {
        image = hdCandidate;
        console.log('[Axios Crawler] Upgraded image to HD (1080x1080)!');
      } else {
        const subHdCandidate = cleanMatches.find(m => m.includes('750x750') || m.includes('720x720'));
        if (subHdCandidate) {
          image = subHdCandidate;
          console.log('[Axios Crawler] Upgraded image to sub-HD!');
        }
      }
    }
  }

  return { title, type, description, image, video };
}

// Helper to scrape profile avatars using Puppeteer (needed since raw static crawler profile HTML only contains 100x100 thumbnail)
async function scrapeProfileWithPuppeteer(url) {
  console.log(`[Puppeteer Scraper] Launching browser for Profile URL: ${url}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set standard desktop viewport to help ensure standard element dimensions load
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait for client JS to finish layout mounting
    await new Promise(r => setTimeout(r, 2500));

    const metadata = await page.evaluate(() => {
      const getMeta = (prop) => {
        const el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
        return el ? el.getAttribute('content') : null;
      };
      
      let profileImg = null;
      const images = Array.from(document.querySelectorAll('img'));
      // Match all images that are avatars or have profile picture alt labels
      const profilePicUrls = images
        .filter(img => {
          const alt = img.getAttribute('alt') || '';
          return alt.toLowerCase().includes('profile picture') || img.className.includes('avatar');
        })
        .map(img => img.src);
        
      if (profilePicUrls.length > 0) {
        // Sort and prioritize highest resolution: s320x320 > s150x150 > s100x100 > any fallback
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

    return metadata;
  } finally {
    await browser.close();
  }
}

// POST /api/download - extracts post, reel, or profile metadata and download links
app.post('/api/download', async (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Clean URL to strip out any trailing user commentary or labels
  const fullCleanedMatch = url.match(/(https?:\/\/[^\s]+)/);
  if (fullCleanedMatch) {
    url = fullCleanedMatch[1];
  }

  if (!url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Please enter a valid Instagram URL' });
  }

  try {
    const isProfileUrl = !url.includes('/p/') && !url.includes('/reel/') && !url.includes('/tv/') && !url.includes('/reels/');
    let metadata;

    if (isProfileUrl) {
      metadata = await scrapeProfileWithPuppeteer(url);
    } else {
      metadata = await scrapeWithAxios(url);
    }

    if (!metadata.image && !metadata.video) {
      throw new Error('Could not find any media content. Make sure the link is public and valid.');
    }

    let videoUrl = metadata.video;
    const isVideoUrl = url.includes('/reel/') || url.includes('/tv/') || url.includes('/video/');
    const type = (isVideoUrl || !!videoUrl) ? 'reel' : 'photo';
    
    // Fallback: If it is a video/reel URL but video is null, call the SocialKit API using our custom DNS agent
    if (isVideoUrl && !videoUrl) {
      console.log('[Backend Extractor] Video link is null. Invoking SocialKit fallback...');
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
          console.log('[Backend Extractor] SocialKit fallback URL fetched successfully!');
        }
      } catch (err) {
        console.error('[Backend Extractor] SocialKit fallback failed:', err.message);
      }
    }

    // Parse author username
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

    // Parse caption
    let caption = '';
    if (metadata.description) {
      const captionMatch = metadata.description.match(/:\s+"([\s\S]*)"/);
      if (captionMatch) {
        caption = captionMatch[1];
      } else {
        caption = metadata.description;
      }
    }

    // Clean up caption format
    caption = caption.replace(/\\n/g, '\n').trim();

    return res.json({
      success: true,
      type,
      thumbnail: metadata.image,
      video: videoUrl || null,
      caption,
      author
    });

  } catch (error) {
    console.error('[Backend Extractor] Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to extract media' });
  }
});

// GET /api/download-media - streams media file directly from Instagram/S3 CDN to resolve frontend CORS blocks
app.get('/api/download-media', async (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    console.log(`[Proxy Download] Streaming URL: ${url}`);
    
    // Set up request configs (specifically handling S3 or Instagram CDN headers)
    const requestConfig = {
      method: 'get',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000
    };

    if (url.includes('api.socialkit.dev')) {
      requestConfig.httpsAgent = customAgent;
    }

    const response = await axios(requestConfig);

    const cleanFilename = filename || `instakit_download_${Date.now()}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    response.data.pipe(res);
  } catch (error) {
    console.error('[Proxy Download] Error streaming media:', error.message);
    res.status(500).send('Failed to download media file from remote CDN');
  }
});

app.listen(PORT, () => {
  console.log(`Custom hybrid backend running on http://localhost:${PORT}`);
});
