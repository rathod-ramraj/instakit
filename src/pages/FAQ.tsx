import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Is InstaKit completely free?', a: 'Yes, all tools are completely free to use without any hidden limits.' },
  { q: 'Do I need an account?', a: 'No. We value your privacy and do not require any login.' },
  { q: 'What is the quality of downloaded media?', a: 'We extract the highest quality source file available on the platform.' },
  { q: 'How does the AI Hashtag generator work?', a: 'It uses NLP to analyze your description and match it with trending tags in our database.' },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-16 text-center tracking-tight">FAQ</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-5 flex justify-between items-center focus:outline-none">
              <span className="font-medium text-black text-left">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FAQ;
