import { Suspense, lazy } from 'react';
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
        <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white">
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>}>
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
          <Toaster 
            position="bottom-center" 
            toastOptions={{ 
              style: { 
                background: '#111111', 
                color: '#ffffff', 
                borderRadius: '9999px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 500
              } 
            }} 
          />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
