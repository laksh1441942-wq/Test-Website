export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'support';
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  status: string;
  total_amount: number;
  shipping_address: string;
  items?: OrderItem[];
  created_at?: string;
}

export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  customer_id: number;
  amount: number;
  invoice_url?: string;
  created_at?: string;
}

export interface SupportTicket {
  id: number;
  customer_id: number;
  subject: string;
  message: string;
  status: string;
  created_at?: string;
}

export interface SupportTicketResponse {
  id: number;
  ticket_id: number;
  message: string;
  created_at?: string;
}

export interface Customer {
  id: number;
  user_id: number;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
