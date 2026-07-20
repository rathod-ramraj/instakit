import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Hash, Image as ImageIcon, Video, Music, UserCircle, PlayCircle, Star, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const tools = [
  { id: 'photo', name: 'Photo Downloader', icon: ImageIcon, desc: 'High-quality photo extraction.' },
  { id: 'reels', name: 'Reels Downloader', icon: Video, desc: 'Save MP4 reels instantly.' },
  { id: 'story', name: 'Story Downloader', icon: PlayCircle, desc: 'Anonymous story viewing & saving.' },
  { id: 'video', name: 'Video Downloader', icon: Video, desc: 'Standard video extraction.' },
  { id: 'igtv', name: 'IGTV Downloader', icon: Video, desc: 'Long-form video support.' },
  { id: 'highlights', name: 'Highlights Downloader', icon: Star, desc: 'Batch download highlights.' },
  { id: 'profile-picture', name: 'Profile Downloader', icon: UserCircle, desc: 'HD profile picture access.' },
  { id: 'audio', name: 'Audio Downloader', icon: Music, desc: 'Extract clean audio tracks.' },
];

const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [caption, setCaption] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [mediaType, setMediaType] = useState('');

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = url.trim();
    const urlMatch = targetUrl.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      targetUrl = urlMatch[1];
    }

    if (!targetUrl.includes('instagram.com')) {
      toast.error('Please enter a valid Instagram URL');
      return;
    }
    setLoading(true);
    setResult(null);
    setAuthor('');
    setCaption('');
    setThumbnail('');
    setMediaType('');
    
    try {
      const response = await fetch(`${API_BASE}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl })
      });
      
      const data = await response.json();
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      if (data && data.success) {
        setResult(data.video || data.thumbnail);
        setAuthor(data.author || 'instagram_user');
        setCaption(data.caption || '');
        setThumbnail(data.thumbnail || '');
        setMediaType(data.type || 'photo');
        toast.success('Media extracted successfully!');
        return;
      }
      
      throw new Error('Failed to extract media data');
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error instanceof Error ? error.message : 'API Request failed');
      
      // Fallback for demonstration
      let sampleUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
      let isVideoSample = true;
      if (url.includes('photo') || url.includes('p/')) {
        sampleUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop';
        isVideoSample = false;
      }
      setResult(sampleUrl);
      setAuthor('demo_user');
      setCaption('This is a demo post for preview purposes since the direct fetch failed.');
      setThumbnail(sampleUrl);
      setMediaType(isVideoSample ? 'reel' : 'photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>InstaKit - Premium Instagram Tools</title>
        <meta name="description" content="Minimalist, fast, and secure tools for Instagram." />
      </Helmet>

      <section id="downloader-top" className="relative pt-24 pb-24 md:pt-36 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[70vh] black-grid-background">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-semibold mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> All systems operational
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="main-title tracking-tight mb-6"
          >
            The premium toolkit <br className="hidden md:block" />
            for <span className="keyword-highlight">Instagram</span> content.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Download high-quality media instantly and generate intelligent hashtags. Clean, fast, and incredibly simple.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto mt-8"
          >
            <form onSubmit={handleDownload} className="relative flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-[24px] border border-gray-200 shadow-sm hover:shadow-md focus-within:border-gray-400 transition-all">
              <input 
                name="url"
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Instagram URL here..." 
                className="flex-1 bg-transparent px-4 py-3 text-black focus:outline-none w-full placeholder-gray-400 font-medium text-base"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white px-8 py-3.5 rounded-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors sm:w-auto w-full disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Extract
              </button>
            </form>

            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 bg-white border border-gray-200 rounded-[24px] p-6 flex flex-col items-center text-center shadow-sm max-w-lg mx-auto">
                {/* Author Info */}
                <div className="flex items-center gap-3 w-full mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-black uppercase">
                    {author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black text-sm">@{author}</p>
                    <p className="text-xs text-gray-400 capitalize">{mediaType}</p>
                  </div>
                </div>

                {/* Media Preview Box */}
                <div className="w-full aspect-square max-h-80 bg-gray-50 rounded-[16px] mb-4 overflow-hidden relative border border-gray-200 flex items-center justify-center">
                  {mediaType === 'reel' || mediaType === 'video' ? (
                    <video src={result} controls className="w-full h-full object-contain bg-black" />
                  ) : (
                    <img src={thumbnail || result} alt="Extracted Media" className="w-full h-full object-cover" />
                  )}
                  
                  <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-[8px] uppercase tracking-wider z-10 pointer-events-none">
                    4K / HD
                  </div>
                </div>

                {/* Caption preview if exists */}
                {caption && (
                  <div className="w-full text-left bg-gray-50 border border-gray-200 p-4 rounded-[12px] mb-6 max-h-24 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Caption</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{caption}</p>
                  </div>
                )}
                
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!result) return;
                    
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Downloading...</span>';
                    btn.disabled = true;
                    
                    try {
                      const extension = (mediaType === 'reel' || mediaType === 'video') ? 'mp4' : 'jpg';
                      const downloadFilename = `instakit_download_${Date.now()}.${extension}`;
                      const proxyDownloadUrl = `${API_BASE}/api/download-media?url=${encodeURIComponent(result)}&filename=${encodeURIComponent(downloadFilename)}`;
                      
                      // Trigger direct download via proxy
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
                      // Simulating short loading feel
                      setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                      }, 1500);
                    }
                  }}
                  className="w-full bg-black text-white px-6 py-4 rounded-full font-semibold shadow-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  <Download className="w-5 h-5" /> Download File
                </button>
                
                <button 
                  onClick={() => {
                    setResult(null);
                    setAuthor('');
                    setCaption('');
                    setThumbnail('');
                    setMediaType('');
                    setUrl('');
                  }}
                  className="w-full mt-3 bg-gray-100 text-black px-6 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  Download Another
                </button>
              </motion.div>
            )}
            <div className="mt-8 flex justify-center items-center gap-6 text-sm text-gray-500 font-semibold">
              <a href="#tools" className="hover:text-black transition-colors flex items-center gap-1.5"><ArrowRight className="w-4 h-4" /> Explore tools</a>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <Link to="/hashtag-generator" className="hover:text-black transition-colors flex items-center gap-1.5"><Hash className="w-4 h-4" /> AI Hashtags</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Everything you need.</h2>
            <p className="text-gray-500">A complete suite of tools designed with simplicity in mind.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <motion.div 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <a href="#downloader-top" onClick={() => document.getElementById('downloader-top')?.scrollIntoView({ behavior: 'smooth' })} className="block h-full group">
                  <div className="bg-white border border-gray-200 p-7 rounded-[16px] hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-white transition-colors duration-300 text-gray-700">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold mb-2 text-black">{tool.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-auto">{tool.desc}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO & Info Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-[#4B5563] text-lg leading-relaxed">
            <h2 className="text-3xl font-bold text-[#111111] mb-6 tracking-tight">InstaKit - Best Instagram Downloader</h2>
            <p className="mb-6">
              InstaKit is an online Instagram Downloader. Support downloading Videos, Photos, Stories, Reels, and IGTV from Instagram in a few simple steps.
            </p>
            <p className="mb-6">
              InstaKit is a website that allows you to download high-quality content on Instagram (download Instagram videos in mp4, download Reels, download IGTV, download images, download Stories). Simply paste the public Instagram link into the input box on the InstaKit website to save the content to your device.
            </p>
            <p className="mb-12">
              Instagram Video Downloader works on any web browser, supports downloading Instagram videos on all devices (PC, Mac, Android, iOS) without installing supporting software.
            </p>

            <h3 className="text-2xl font-bold text-[#111111] mb-5">Why should you use InstaKit?</h3>
            <p className="mb-6">
              <strong className="text-[#111111]">What is Instagram?</strong> Instagram (often abbreviated as IG or Insta) is a social network that allows users to share popular photos and videos. Users can download the free Instagram app on iOS and Android platforms to enjoy a variety of experiences by photo, story, reels, and video editing modes.
            </p>
            <p className="mb-6">
              InstaKit is intended to help users save their own Instagram content or public content they are authorized to use, where permitted by applicable law and platform terms.
            </p>
            <p className="mb-12">
              InstaKit is an Instagram video downloader. Download Videos, Reels, Photos, Stories, and IGTV from Instagram for all devices (PC, Mac, Android, iOS).
            </p>

            <h3 className="text-2xl font-bold text-[#111111] mb-6">Features of InstaKit:</h3>
            <ul className="space-y-6 mb-16 list-none p-0">
              <li className="flex gap-4"><span className="text-[#111111] font-bold mt-0.5">•</span> <span><strong className="text-[#111111]">Download Instagram Video:</strong> InstaKit allows downloading videos from Instagram (IG, Insta) with HD video quality (without changing the quality of the original video).</span></li>
              <li className="flex gap-4"><span className="text-[#111111] font-bold mt-0.5">•</span> <span><strong className="text-[#111111]">Download Instagram Photos:</strong> The Instagram Photo Downloader on InstaKit makes it easy for you to download and save images from Instagram effortlessly right on your web browser.</span></li>
              <li className="flex gap-4"><span className="text-[#111111] font-bold mt-0.5">•</span> <span><strong className="text-[#111111]">Download Instagram Reels Video:</strong> InstaKit allows you to download Instagram Reels videos in mp4 format on all devices (PC, Mac, Android, iOS).</span></li>
              <li className="flex gap-4"><span className="text-[#111111] font-bold mt-0.5">•</span> <span><strong className="text-[#111111]">Download IGTV Video:</strong> IGTV is a long video on Instagram, InstaKit supports downloading IGTV videos to your device for storage or playback when there is no 3G or wifi connection.</span></li>
              <li className="flex gap-4"><span className="text-[#111111] font-bold mt-0.5">•</span> <span><strong className="text-[#111111]">Download Instagram Story:</strong> Users may save their own public Stories or public Stories they are authorized to use. InstaKit does not support private, restricted, or login-protected content.</span></li>
            </ul>

            <h2 className="text-3xl font-bold text-[#111111] mb-10 tracking-tight border-b border-[#E5E7EB] pb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">What is Instagram Downloader?</h4>
                <p>Instagram Downloader is a tool that allows you to download Videos, Photos, Stories, Reels, and IGTV from Instagram. It supports downloading public photos and videos from Instagram (Insta) on all devices (PC, Mac, Android, iPhone, iPad).</p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">How to download videos and photos on Instagram?</h4>
                <p className="mb-2"><strong className="text-[#111111]">Step 1:</strong> Paste the Instagram url into the input box and press the Download button.</p>
                <p className="mb-2"><strong className="text-[#111111]">Step 2:</strong> Photo and Video you want to download will appear, click Download Photo or Download Video button inside under a photo or video, then the file will be saved to your device.</p>
                <p className="text-sm italic mt-4 text-[#6B7280]">(InstaKit works well on all devices (PC, Mac, Android, iOS).)</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">How to download Instagram videos and photos on iPhone, iPad?</h4>
                <p>For iPhone, you need to use the Safari browser on iOS 13 or get Documents by Readdle app and go to InstaKit → Paste Instagram video link → Download.</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">How to download Instagram photos and videos on Android phone?</h4>
                <p>Copy the Instagram link → Go to InstaKit → Paste the copied Instagram link into the input box → Download.</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">Can I download Instagram Story?</h4>
                <p>Yes, you can download public Instagram Stories. Tap the (...) icon above the Story post, then select Copy Link → Paste the copied link into InstaKit → Download.</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">Can I download videos and photos directly on Instagram?</h4>
                <p>No, you need to use third-party tools like InstaKit to save content from your own account or public content.</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">Do I have to pay to download Instagram videos and photos?</h4>
                <p>InstaKit is a completely free Instagram downloader. You can download public content on Instagram (Videos, Photos, Reels, Stories, IGTV) without any feature limitations.</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111111] mb-3">Where are Instagram videos and photos saved after downloading?</h4>
                <p>Please check the "Downloads" folder in your phone or the "download history" section of your browser.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
