import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
              <span className="text-xl font-bold text-white">VyaparSetu</span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering Indian MSMEs with a unified digital commerce platform. 
              Buy, sell, and grow your business with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sell on VyaparSetu</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Textiles & Apparel</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Handicrafts</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Agriculture</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Terms of Service</span></li>
              <li><span className="text-gray-400">Privacy Policy</span></li>
              <li><span className="text-gray-400">Refund Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 VyaparSetu. Made with care for Indian businesses.</p>
        </div>
      </div>
    </footer>
  );
}
