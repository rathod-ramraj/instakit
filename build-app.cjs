const fs = require('fs');
const path = require('path');

const files = {
  'src/App.tsx': `import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const Home = lazy(() => import('./pages/Home'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const HashtagGenerator = lazy(() => import('./pages/HashtagGenerator'));
const Features = lazy(() => import('./pages/Features'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow pt-20">
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools/:id" element={<ToolDetail />} />
                <Route path="/hashtag-generator" element={<HashtagGenerator />} />
                <Route path="/features" element={<Features />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
`,
  'src/components/layout/Navbar.tsx': `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/#tools' },
    { name: 'AI Hashtags', path: '/hashtag-generator' },
    { name: 'Features', path: '/features' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 glassmorphism border-b border-[rgba(255,255,255,0.08)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Instagram className="w-8 h-8 text-[#F58529]" />
            <span className="font-bold text-xl tracking-tight">InstaToolkit <span className="ig-text-gradient">AI</span></span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={\`hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium \${location.pathname === link.path ? 'text-white' : 'text-gray-400'}\`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div layoutId="underline" className="h-0.5 w-full ig-gradient mt-1" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden glassmorphism">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
export default Navbar;
`,
  'src/components/layout/Footer.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#09090b] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Instagram className="w-6 h-6 text-[#F58529]" />
              <span className="font-bold text-lg">InstaToolkit <span className="ig-text-gradient">AI</span></span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              The ultimate all-in-one Instagram toolkit. Download content instantly and generate AI-powered hashtags to boost your reach.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/#tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)] text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} InstaToolkit AI. All rights reserved. Not affiliated with Instagram.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
`,
  'src/pages/Home.tsx': `import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Hash, Image as ImageIcon, Video, Music, UserCircle, PlayCircle, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const tools = [
  { id: 'photo', name: 'Photo Downloader', icon: ImageIcon, desc: 'Download high-quality Instagram photos.' },
  { id: 'reels', name: 'Reels Downloader', icon: Video, desc: 'Save Instagram Reels in MP4 format.' },
  { id: 'story', name: 'Story Downloader', icon: PlayCircle, desc: 'Download Instagram Stories anonymously.' },
  { id: 'video', name: 'Video Downloader', icon: Video, desc: 'Download standard Instagram videos.' },
  { id: 'igtv', name: 'IGTV Downloader', icon: Video, desc: 'Save long-form IGTV videos.' },
  { id: 'highlights', name: 'Highlights Downloader', icon: Star, desc: 'Download story highlights.' },
  { id: 'profile-picture', name: 'Profile Picture Downloader', icon: UserCircle, desc: 'View and download HD profile pictures.' },
  { id: 'audio', name: 'Audio Downloader', icon: Music, desc: 'Extract audio from Reels and videos.' },
];

const Home = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>InstaToolkit AI - Instagram Downloader & Hashtag Generator</title>
        <meta name="description" content="Download Instagram Photos, Reels, Stories, and generate AI hashtags instantly." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F58529] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Download Instagram Content <br />
            <span className="ig-text-gradient">Instantly</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Download Photos, Reels, Stories, Highlights, Audio, Profile Pictures and generate AI hashtags in seconds.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a href="#tools" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" /> Download Now
            </a>
            <Link to="/hashtag-generator" className="px-8 py-4 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Hash className="w-5 h-5" /> Generate Hashtags
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All-in-One <span className="ig-text-gradient">Tools</span></h2>
            <p className="text-gray-400">Everything you need to manage and download Instagram content.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, i) => (
              <motion.div 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111827] border border-[rgba(255,255,255,0.08)] p-6 rounded-2xl hover:border-gray-500 transition-colors group cursor-pointer"
              >
                <Link to={\`/tools/\${tool.id}\`} className="block h-full">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
`,
  'src/pages/ToolDetail.tsx': `import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ToolDetail = () => {
  const { id } = useParams();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const title = id ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Downloader' : 'Downloader';

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('instagram.com')) {
      toast.error('Please enter a valid Instagram URL');
      return;
    }
    setLoading(true);
    setResult(null);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setResult('https://example.com/download-link.mp4');
      toast.success('Download ready!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-gray-400">Paste your Instagram URL below to download instantly.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-10 shadow-xl">
        <form onSubmit={handleDownload} className="flex flex-col md:flex-row gap-4">
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram URL here..." 
            className="flex-1 bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#F58529] transition-colors"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h3 className="text-xl font-semibold">Ready to Save!</h3>
            <a href={result} download className="ig-gradient text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition-opacity">
              Save to Device
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default ToolDetail;
`,
  'src/pages/HashtagGenerator.tsx': `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, RotateCcw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Travel', 'Food', 'Technology', 'Fitness', 'Fashion', 'Gaming', 'Business', 'Education', 'Nature', 'Pets', 'Beauty', 'Lifestyle'];

const HashtagGenerator = () => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      toast.error('Please describe your post');
      return;
    }
    setLoading(true);
    // Mock API
    setTimeout(() => {
      setHashtags(['#instadaily', '#trending', \`#\${category.toLowerCase()}\`, '#explorepage', '#viral']);
      setLoading(false);
      toast.success('Generated 5 hashtags!');
    }, 1500);
  };

  const copy = () => {
    navigator.clipboard.writeText(hashtags.join(' '));
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI <span className="ig-text-gradient">Hashtag</span> Generator</h1>
        <p className="text-gray-400">Boost your reach with perfectly tailored hashtags.</p>
      </div>

      <div className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8">
        <form onSubmit={generate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F58529]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Post Description</label>
            <textarea 
              value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your Instagram post..." 
              rows={4}
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F58529] resize-none"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full ig-gradient text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Hash className="w-5 h-5" />}
            Generate Hashtags
          </button>
        </form>

        {hashtags.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Your Hashtags</h3>
              <div className="flex gap-2">
                <button onClick={copy} className="p-2 bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-gray-800" title="Copy"><Copy className="w-4 h-4" /></button>
                <button onClick={generate} className="p-2 bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-gray-800" title="Regenerate"><RotateCcw className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-full text-sm text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default HashtagGenerator;
`,
  'src/pages/Features.tsx': `import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Smartphone, Infinity, Sparkles, Copy } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: Zap, title: 'Fast Downloads', desc: 'Experience lightning-fast download speeds.' },
    { icon: Shield, title: 'Secure & Private', desc: 'No login required. Your data is perfectly safe.' },
    { icon: Infinity, title: 'Unlimited Use', desc: 'Download as much content as you want for free.' },
    { icon: Sparkles, title: 'AI Powered', desc: 'State-of-the-art AI for perfect hashtags.' },
    { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works seamlessly on any device.' },
    { icon: Copy, title: 'One Click Copy', desc: 'Copy results instantly to your clipboard.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Why Choose <span className="ig-text-gradient">Us</span>?</h1>
        <p className="text-gray-400">The most powerful features packed into one elegant toolkit.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#111827] p-8 rounded-2xl border border-[rgba(255,255,255,0.08)]">
            <f.icon className="w-10 h-10 text-[#F58529] mb-4" />
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Features;
`,
  'src/pages/FAQ.tsx': `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'Is this free?', a: 'Yes, our toolkit is 100% free to use with no hidden charges.' },
  { q: 'Is login required?', a: 'No login is required. You can use all features anonymously.' },
  { q: 'Can I download reels?', a: 'Absolutely! Our Reels downloader supports high-quality MP4 downloads.' },
  { q: 'How accurate are AI hashtags?', a: 'Our AI analyzes your description and category to generate highly relevant and trending hashtags.' },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12 text-center">Frequently Asked <span className="ig-text-gradient">Questions</span></h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div key={i} className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex justify-between items-center focus:outline-none">
              <span className="font-semibold text-left">{faq.q}</span>
              {open === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-gray-400">
                {faq.a}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default FAQ;
`,
  'src/pages/Contact.tsx': `import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4 text-center">Get in <span className="ig-text-gradient">Touch</span></h1>
      <p className="text-center text-gray-400 mb-12">Have a question or feedback? We'd love to hear from you.</p>
      
      <form onSubmit={submit} className="bg-[#111827] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input required type="text" className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F58529]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input required type="email" className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F58529]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
          <textarea required rows={5} className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F58529] resize-none" />
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
          <Send className="w-5 h-5" /> Send Message
        </button>
      </form>
    </div>
  );
};
export default Contact;
`,
  'src/pages/NotFound.tsx': `import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <h1 className="text-9xl font-bold ig-text-gradient mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-8">Page Not Found</h2>
    <Link to="/" className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">
      Return Home
    </Link>
  </div>
);
export default NotFound;
`,
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content);
}
console.log('Project files generated.');
