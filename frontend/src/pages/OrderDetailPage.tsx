import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Order } from '../types';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { ArrowLeft, MapPin, FileText } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getOrder(Number(id));
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Order not found</p>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            {order.items && order.items.length > 0 ? (
              <div className="divide-y border rounded-lg">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Product #{item.product_id}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} &middot; {formatPrice(item.unit_price)} each</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Item details not available</p>
            )}

            {/* Total */}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-600">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="p-6 border-t bg-gray-50">
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin size={16} /> Shipping Address
            </h2>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
          </div>

          {/* Invoice Link */}
          {order.status === 'delivered' && (
            <div className="p-6 border-t">
              <Link
                to="/invoices"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <FileText size={16} /> View Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
