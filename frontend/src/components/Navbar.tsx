import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, Package, Headphones, Users, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VyaparSetu</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">
              Products
            </Link>
            {user && user.role === 'customer' && (
              <>
                <Link to="/orders" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  My Orders
                </Link>
                <Link to="/invoices" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  Invoices
                </Link>
                <Link to="/support" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  Support
                </Link>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/admin/orders" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                  <ClipboardList size={14} /> Orders
                </Link>
                <Link to="/admin/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                  <Package size={14} /> Products
                </Link>
                <Link to="/admin/customers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                  <Users size={14} /> Customers
                </Link>
                <Link to="/admin/support" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                  <Headphones size={14} /> Support
                </Link>
              </>
            )}
            {user && user.role === 'support' && (
              <Link to="/admin/support" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-1">
                <Headphones size={14} /> Support Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {user && user.role === 'customer' && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 capitalize">{user.role}</span>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                  Get Started
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/products" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            {user && user.role === 'customer' && (
              <>
                <Link to="/orders" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/invoices" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Invoices
                </Link>
                <Link to="/support" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Support
                </Link>
                <Link to="/cart" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Cart ({totalItems})
                </Link>
              </>
            )}
            {user && (user.role === 'admin' || user.role === 'support') && (
              <>
                <Link to="/admin" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/orders" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Orders
                    </Link>
                    <Link to="/admin/products" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Products
                    </Link>
                    <Link to="/admin/customers" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Customers
                    </Link>
                  </>
                )}
                <Link to="/admin/support" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Support Tickets
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
