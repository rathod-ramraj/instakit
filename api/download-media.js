import axios from 'axios';
import https from 'https';
import dns from 'dns';

const customLookup = (hostname, options, callback) => {
  if (hostname === 'api.socialkit.dev') {
    return callback(null, [{ address: '69.46.46.22', family: 4 }]);
  }
  return dns.lookup(hostname, options, callback);
};

const customAgent = new https.Agent({
  lookup: customLookup
});

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, filename } = req.query || {};

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    console.log(`[Vercel Media Proxy] Streaming URL: ${url}`);
    
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
    console.error('[Vercel Media Proxy] Error streaming media:', error.message);
    res.status(500).send('Failed to download media file from remote CDN');
  }
}
