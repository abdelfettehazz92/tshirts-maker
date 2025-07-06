// User related types
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
  role: 'user' | 'admin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Design related types
export interface Design {
  id: number;
  image_path: string;
  product_type: string;
  color: string;
  view_angle: string;
  created_at: string;
  user_id: number;
}

export interface DesignData {
  style: string;
  color: string;
  design?: string;
  text?: string;
  font?: string;
  fontSize?: number;
  textColor?: string;
  opacity?: number;
  size?: number;
  rotation?: number;
  view: string;
}

// Order related types
export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  created_at: string;
  quantity: number;
  design_data?: string;
  final_price?: number;
  left_design?: string;
  right_design?: string;
  source_designs?: string;
  front_design?: string;
  back_design?: string;
  base_price: number;
  design_price: number;
  total_price: number;
  updated_at?: string;
  product_type?: string;
  color?: string;
  view_angle?: string;
  is_hidden: boolean;
  is_cart_order: boolean;
  approval_timestamp?: string;
}

// Payment related types
export interface Payment {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  currency: 'EUR' | 'USD' | 'TND';
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'accepted';
  payment_date: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  event_date?: string;
}

export interface PaymentInfo {
  order_id: string;
  service: string;
  price: number;
  currency: 'EUR' | 'USD' | 'TND';
  card_number: string;
  expiry: string;
  cvv: string;
  card_name: string;
  billing_address: string;
  city: string;
  postal_code: string;
  country: string;
}

// Pricing related types
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: 'EUR' | 'USD' | 'TND';
  features: string[];
  popular?: boolean;
  description: string;
}

// Template related types
export interface Template {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: 'Business' | 'Casual' | 'Sports' | 'Artistic';
  tags: string[];
}

// Contact related types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Chat related types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  type: 'T-Shirt' | 'Hoodie' | 'Tank Top' | 'Long Sleeve';
  colors: ProductColor[];
  views: ProductView[];
  basePrice: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  images: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
}

export interface ProductView {
  name: string;
  icon: string;
  value: string;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
}

// Canvas element types
export interface CanvasElement {
  id: string;
  type: 'image' | 'text';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  data: any;
}

// Design history types
export interface DesignHistory {
  id: string;
  timestamp: Date;
  elements: CanvasElement[];
  thumbnail?: string;
}

// AI Confirmation types
export interface AIOrderConfirmation {
  orderId: string;
  conversation: ChatMessage[];
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: Date;
} 