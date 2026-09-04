import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Customer } from '../types';
import { Users, MapPin, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await api.adminGetCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">{customers.length} registered customers</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">ID</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">User ID</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">City</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">State</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
                            #{customer.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{customer.user_id}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {customer.phone || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {customer.city || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{customer.state || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {customers.length === 0 && (
              <div className="p-8 text-center">
                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No customers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
