import { motion } from 'framer-motion';
import { Zap, Shield, Infinity, Sparkles, Smartphone, Copy } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized extraction algorithms.' },
    { icon: Shield, title: 'Private & Secure', desc: 'No login required, ever.' },
    { icon: Infinity, title: 'Unlimited Access', desc: 'Zero quotas or paywalls.' },
    { icon: Sparkles, title: 'AI Integration', desc: 'Smart context awareness.' },
    { icon: Smartphone, title: 'Responsive', desc: 'Perfect on any device.' },
    { icon: Copy, title: 'Frictionless', desc: 'One-click copy & download.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">The InstaKit Standard.</h1>
        <p className="text-gray-500 text-lg">Engineered for speed, privacy, and simplicity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white p-8 rounded-[24px] border border-gray-200 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white text-gray-700 transition-colors">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Features;
