import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const HashtagGenerator = () => {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string | null>(null);
  const [submittedDesc, setSubmittedDesc] = useState('');

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      toast.error('Please enter keywords');
      return;
    }
    setLoading(true);
    setSubmittedDesc(desc);
    
    try {
      const response = await fetch('https://www.veed.io/script-generator-ap/api/generate-non-streaming-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'instagram-hashtag-generator',
          number: 5,
          topic: desc
        }),
      });
      
      const data = await response.json();
      
      if (data && data.text) {
        const matches = data.text.match(/#[a-zA-Z0-9_]+/g);
        if (matches && matches.length > 0) {
          setHashtags(matches.join(' '));
        } else {
          throw new Error('No hashtags found in API response');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('API Error (Likely CORS):', error);
      
      // Fallback: Dynamically generate hashtags based on the user's input
      const words = desc
        .split(/[\s,]+/)
        .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(w => w.length > 2);
        
      if (words.length > 0) {
        const suffixes = ['Life', 'Vibes', 'Style', 'Love', 'Photography', 'Daily', 'Goals', 'Inspiration', 'Mood', 'Magic'];
        const generatedTags = new Set<string>();
        
        // Add exact words as hashtags
        words.forEach(w => generatedTags.add(`#${w.charAt(0).toUpperCase() + w.slice(1)}`));
        
        // Mix words together if multiple
        if (words.length > 1) {
          generatedTags.add(`#${words[0].charAt(0).toUpperCase() + words[0].slice(1)}${words[1].charAt(0).toUpperCase() + words[1].slice(1)}`);
        }
        
        // Add random suffixes
        while (generatedTags.size < 12) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          generatedTags.add(`#${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)}${randomSuffix}`);
        }
        
        setHashtags(Array.from(generatedTags).join(' '));
      } else {
        // Absolute fallback if input was weird
        setHashtags('#InstaGood #Trending #Viral #ExplorePage #FYP #Photography #LifeStyle #ContentCreator #Inspiration');
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (hashtags) {
      navigator.clipboard.writeText(hashtags);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh]">
      {!hashtags ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="text-[11px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-4 inline-block">AI HASHTAG GENERATOR</span>
          <h1 className="main-title tracking-tight mb-6">
            Start <span className="keyword-highlight">trending</span> online.
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Generate the best hashtags to increase your content's visibility. Use InstaKit's instant hashtag generator.
          </p>
          
          <form onSubmit={generate} className="max-w-2xl mx-auto text-left bg-white border border-gray-200 rounded-[24px] p-8 shadow-sm">
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">What is your post about?</label>
              <input 
                type="text"
                value={desc} 
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. European Beaches, Travel Vlog, Baking Cake..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-5 py-4 text-black text-lg focus:outline-none focus:border-black focus:bg-white transition-all"
                required
              />
            </div>
            
            <div className="flex justify-start">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Hashtags'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mt-12">
          <span className="text-[11px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-4 inline-block">RESULTS GENERATED</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#111111] mb-8">
            Hashtag ideas for <span className="keyword-highlight">"{submittedDesc}"</span>
          </h2>
          
          <div className="relative bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 text-left shadow-sm max-w-2xl mx-auto">
            <button 
              onClick={copy} 
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
            <p className="text-[18px] leading-[1.8] text-black pr-12 font-medium break-words">
              {hashtags}
            </p>
          </div>
          
          <button 
            onClick={() => setHashtags(null)} 
            className="mt-10 bg-white border border-gray-200 text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            ← Generate more hashtags
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HashtagGenerator;
