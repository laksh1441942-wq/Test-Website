import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Order } from '../types';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { ClipboardList } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.adminGetOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b p-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Order ID</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Items</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Total</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">Customer #{order.customer_id}</td>
                      <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_amount)}</td>
                      <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="p-8 text-center">
                <ClipboardList size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
