import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Contact Us</h1>
        <p className="text-gray-500">How can we help you today?</p>
      </div>
      
      <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="bg-white border border-gray-200 p-8 md:p-10 rounded-[28px] space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Name</label>
            <input required type="text" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email</label>
            <input required type="email" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Message</label>
          <textarea required rows={5} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-black text-white font-medium py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md disabled:opacity-50">
          <Send className="w-4 h-4" /> Send Message
        </button>
      </motion.form>
    </div>
  );
};
export default Contact;
