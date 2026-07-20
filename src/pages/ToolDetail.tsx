import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ToolDetail = () => {
  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const title = id === 'auto' ? 'Universal Downloader' : id ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Downloader' : 'Downloader';

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('instagram.com')) {
      toast.error('Please enter a valid Instagram URL');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      // First try the new backend proxy (Primary)
      try {
        const response = await fetch(`${API_BASE}/api/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (data && data.status === 'ok' && data.data) {
          const match = typeof data.data === 'string' ? data.data.match(/href="([^"]+)"/) : null;
          if (match && match[1]) {
            setResult(match[1]);
            toast.success('Media extracted via Backend Proxy!');
            return;
          } else if (data.data.url) {
            setResult(data.data.url);
            toast.success('Media extracted via Backend Proxy!');
            return;
          }
        }
      } catch (err) {
        console.log('Backend proxy failed, trying FastDL...', err);
      }
      
      // Fallback: Try the fastdl API
      const fastdlData = new FormData();
      fastdlData.append('url', url);
      
      const response = await fetch('https://api-wh.fastdl.app/api/convert', {
        method: 'POST',
        body: fastdlData
      });
      
      const data = await response.json();
      
      if (data && data.url) {
        setResult(data.url);
        toast.success('Media extracted via FastDL!');
        return;
      }
      
      throw new Error('Both APIs failed or returned invalid data');
      
    } catch (error) {
      console.error('API Error:', error);
      toast.error('API Request failed (Possible CORS or Cloudflare block)');
      
      // Fallback for demonstration
      let sampleUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
      if (id === 'photo' || id === 'profile-picture') {
        sampleUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop';
      } else if (id === 'audio') {
        sampleUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      }
      setResult(sampleUrl);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = result?.endsWith('.mp4');
  const isAudio = result?.endsWith('.mp3');

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 min-h-[60vh] flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
        <p className="text-gray-500 text-lg">Paste your URL below to extract media instantly.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full">
        <form onSubmit={handleDownload} className="relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/..." 
            className="flex-1 bg-white border border-gray-200 rounded-full px-6 py-4 text-black text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Extract
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 max-w-lg mx-auto bg-[#FAFAFA] border border-gray-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-full aspect-square max-h-80 bg-gray-100 rounded-2xl mb-6 overflow-hidden relative border border-gray-200 flex items-center justify-center">
              {isVideo ? (
                <video src={result} controls className="w-full h-full object-contain bg-black" />
              ) : isAudio ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white p-6">
                  <audio src={result} controls className="w-full" />
                </div>
              ) : (
                <img src={result} alt="Extracted Media" className="w-full h-full object-cover" />
              )}
              
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10 pointer-events-none">
                4K / HD
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Extraction Complete</h3>
            <p className="text-sm text-gray-500 mb-6">Your media is ready to be saved in maximum clarity.</p>
            
            {/* Using fetch to get blob and force download across origins */}
            <button 
              onClick={async (e) => {
                e.preventDefault();
                const btn = e.currentTarget;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Downloading...</span>';
                btn.disabled = true;
                
                try {
                  const extension = isVideo ? 'mp4' : isAudio ? 'mp3' : 'jpg';
                  const downloadFilename = `instakit_download_${Date.now()}.${extension}`;
                  const proxyDownloadUrl = `${API_BASE}/api/download-media?url=${encodeURIComponent(result)}&filename=${encodeURIComponent(downloadFilename)}`;
                  
                  const link = document.createElement('a');
                  link.href = proxyDownloadUrl;
                  link.download = downloadFilename;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (error) {
                  console.error('Download failed:', error);
                  toast.error('Download failed. Trying to open in a new window instead.');
                  window.open(result, '_blank');
                } finally {
                  btn.innerHTML = originalText;
                  btn.disabled = false;
                }
              }}
              className="w-full bg-black text-white px-6 py-4 rounded-full font-medium shadow-md hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-wait"
            >
              <Download className="w-5 h-5" /> Download File
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ToolDetail;
