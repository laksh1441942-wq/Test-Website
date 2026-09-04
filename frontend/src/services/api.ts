import type { User, Product, Order, Invoice, SupportTicket, Customer, CartItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  login(email: string, password: string) {
    return request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(name: string, email: string, password: string) {
    return request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe() {
    return request<User>('/auth/me');
  },

  getProducts(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Product[]>(`/products${params}`);
  },

  getProduct(id: number) {
    return request<Product>(`/products/${id}`);
  },

  getOrders() {
    return request<Order[]>('/orders');
  },

  getOrder(id: number) {
    return request<Order>(`/orders/${id}`);
  },

  createOrder(items: { product_id: number; quantity: number }[], shippingAddress: string) {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shipping_address: shippingAddress }),
    });
  },

  getInvoices() {
    return request<Invoice[]>('/invoices');
  },

  getInvoice(id: number) {
    return request<Invoice>(`/invoices/${id}`);
  },

  getCustomer(id: number) {
    return request<Customer>(`/customers/${id}`);
  },

  createSupportTicket(subject: string, message: string) {
    return request<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    });
  },

  getSupportTickets() {
    return request<SupportTicket[]>('/support/tickets');
  },

  getSupportTicket(id: number) {
    return request<SupportTicket>(`/support/tickets/${id}`);
  },

  replyToTicket(ticketId: number, message: string) {
    return request<SupportTicket>(`/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  adminGetCustomers() {
    return request<Customer[]>('/admin/customers');
  },

  adminGetOrders() {
    return request<Order[]>('/admin/orders');
  },

  adminGetProducts() {
    return request<Product[]>('/admin/products');
  },

  adminCreateProduct(data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image_url?: string;
  }) {
    return request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  adminUpdateProduct(id: number, data: Partial<Product>) {
    return request<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  adminDeleteProduct(id: number) {
    return request<void>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  adminGetSupportTickets() {
    return request<SupportTicket[]>('/admin/support/tickets');
  },
};
