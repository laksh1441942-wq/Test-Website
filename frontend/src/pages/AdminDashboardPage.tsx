import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [orders, customers, products] = await Promise.all([
        api.adminGetOrders(),
        api.adminGetCustomers(),
        api.adminGetProducts(),
      ]);
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customers.length,
        totalProducts: products.length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your business metrics</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart size={22} />}
              change="All time"
              changeType="neutral"
            />
            <StatsCard
              title="Total Revenue"
              value={formatPrice(stats.totalRevenue)}
              icon={<IndianRupee size={22} />}
              change="All time"
              changeType="neutral"
            />
            <StatsCard
              title="Customers"
              value={stats.totalCustomers}
              icon={<Users size={22} />}
              change="Registered users"
              changeType="neutral"
            />
            <StatsCard
              title="Products"
              value={stats.totalProducts}
              icon={<Package size={22} />}
              change="Listed products"
              changeType="neutral"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/orders"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <ShoppingCart size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-500">View and update order status</p>
              </div>
            </div>
          </a>
          <a
            href="/admin/products"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Package size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove products</p>
              </div>
            </div>
          </a>
          <a
            href="/admin/customers"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Customers</h3>
                <p className="text-sm text-gray-500">View customer information</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
