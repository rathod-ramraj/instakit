import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/#tools' },
    { name: 'Hashtags', path: '/hashtag-generator' },
    { name: 'Features', path: '/features' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="fixed w-full z-50 top-4 px-4 flex justify-center pointer-events-none">
      <nav className="w-full max-w-4xl glassmorphism rounded-full border border-gray-200 shadow-sm transition-all duration-300 pointer-events-auto relative">
        <div className="px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
              <img src="/favicon.svg" alt="InstaKit Logo" className="w-8 h-8" />
              <span className="font-semibold text-lg tracking-tight text-black">InstaKit</span>
            </Link>

            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {links.map((link) => {
                  const isActive = (link.path.startsWith('/#') && location.hash === link.path.replace('/', '')) || 
                                   (location.pathname === link.path && location.hash === '');
                  
                  return link.path.startsWith('/#') ? (
                    <a
                      key={link.name}
                      href={link.path}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div layoutId="nav-indicator" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="hidden md:flex items-center">
              <Link to="/contact" className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95">
                Contact Us
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-black p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 rounded-[24px] shadow-lg overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => 
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50"
                  >
                    {link.name}
                  </Link>
                )
              )}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block mt-4 px-4 py-3 rounded-xl text-center text-base font-medium text-white bg-black">
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  );
};
export default Navbar;
