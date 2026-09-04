import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Package, FileText, Headphones, Settings } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                  <Mail size={14} /> {user.email}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                    <Shield size={12} /> {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/orders"
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Package size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-500">View and track your orders</p>
                </div>
              </div>
            </Link>

            <Link
              to="/invoices"
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Invoices</h3>
                  <p className="text-sm text-gray-500">Manage your invoices</p>
                </div>
              </div>
            </Link>

            <Link
              to="/support"
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Headphones size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Support</h3>
                  <p className="text-sm text-gray-500">Get help with your account</p>
                </div>
              </div>
            </Link>

            <Link
              to="/products"
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-saffron-50 text-saffron-600 rounded-lg flex items-center justify-center group-hover:bg-saffron-100 transition-colors">
                  <Settings size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Marketplace</h3>
                  <p className="text-sm text-gray-500">Browse products</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
