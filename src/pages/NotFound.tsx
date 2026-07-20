import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-32 min-h-[60vh] text-center px-6">
    <h1 className="text-8xl font-bold text-black mb-6 tracking-tighter">404</h1>
    <h2 className="text-xl font-medium text-gray-700 mb-8">This page could not be found.</h2>
    <Link to="/" className="px-8 py-3.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-md hover:-translate-y-0.5">
      Return Home
    </Link>
  </div>
);
export default NotFound;
