import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-[#FAFAFA] mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2.5 mb-6 hover:opacity-80 transition-opacity w-fit">
              <img src="/favicon.svg" alt="InstaKit Logo" className="w-8 h-8" />
              <span className="font-semibold text-lg tracking-tight text-black">InstaKit</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-sm leading-relaxed">
              A premium, minimalist toolkit to download content and generate AI hashtags with zero friction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-black transition-all hover:-translate-y-1"><FaTwitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-black transition-all hover:-translate-y-1"><FaGithub className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-black mb-5">Product</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/#tools" className="hover:text-black transition-colors">Tools</Link></li>
              <li><Link to="/features" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link to="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-black mb-5">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} InstaKit. All rights reserved.</p>
          <p>Not affiliated with Instagram.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
