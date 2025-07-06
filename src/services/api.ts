import { 
  User, 
  Order, 
  Payment, 
  Design, 
  Template, 
  ContactForm, 
  PaymentInfo,
  ApiResponse,
  PricingPlan,
  Notification
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/web/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/signup.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/logout.php', { method: 'POST' });
  }

  async checkAuth(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/check-auth.php');
  }

  // User Management
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/profile.php');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/update-profile.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Design Management
  async saveDesign(designData: {
    image: string;
    product: string;
    color: string;
    view: string;
  }): Promise<ApiResponse<Design>> {
    return this.request('/save-design.php', {
      method: 'POST',
      body: JSON.stringify(designData),
    });
  }

  async getDesigns(): Promise<ApiResponse<Design[]>> {
    return this.request('/designs.php');
  }

  async deleteDesign(designId: number): Promise<ApiResponse> {
    return this.request(`/delete-design.php`, {
      method: 'POST',
      body: JSON.stringify({ design_id: designId }),
    });
  }

  // Order Management
  async createOrder(orderData: {
    design_data: string;
    product_type: string;
    color: string;
    view_angle: string;
    quantity: number;
    base_price: number;
    design_price: number;
    total_price: number;
  }): Promise<ApiResponse<Order>> {
    return this.request('/create-order.php', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/orders.php');
  }

  async updateOrder(orderId: number, status: string): Promise<ApiResponse<Order>> {
    return this.request('/update-order.php', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, status }),
    });
  }

  async deleteOrder(orderId: number): Promise<ApiResponse> {
    return this.request('/delete-order.php', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  // Payment Management
  async processPayment(paymentData: PaymentInfo): Promise<ApiResponse<Payment>> {
    return this.request('/process-payment.php', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request('/payments.php');
  }

  async updatePaymentStatus(paymentId: number, status: string): Promise<ApiResponse<Payment>> {
    return this.request('/update-payment-status.php', {
      method: 'POST',
      body: JSON.stringify({ payment_id: paymentId, status }),
    });
  }

  // Templates
  async getTemplates(): Promise<ApiResponse<Template[]>> {
    return this.request('/templates.php');
  }

  async getTemplate(templateId: number): Promise<ApiResponse<Template>> {
    return this.request(`/template.php?id=${templateId}`);
  }

  // Contact
  async sendContactMessage(contactData: ContactForm): Promise<ApiResponse> {
    return this.request('/contact.php', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Gallery
  async getGallery(): Promise<ApiResponse<Design[]>> {
    return this.request('/gallery.php');
  }

  // Pricing
  async getPricingPlans(): Promise<ApiResponse<PricingPlan[]>> {
    return this.request('/pricing.php');
  }

  // Admin
  async getAdminStats(): Promise<ApiResponse<{
    total_users: number;
    total_orders: number;
    total_revenue: number;
    recent_orders: Order[];
    recent_payments: Payment[];
  }>> {
    return this.request('/admin/stats.php');
  }

  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/admin/users.php');
  }

  async getAdminOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/admin/orders.php');
  }

  async getAdminPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request('/admin/payments.php');
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request('/notifications.php');
  }

  async markNotificationRead(notificationId: number): Promise<ApiResponse> {
    return this.request('/mark-notification-read.php', {
      method: 'POST',
      body: JSON.stringify({ notification_id: notificationId }),
    });
  }

  // Chat
  async sendChatMessage(message: string): Promise<ApiResponse<{ response: string }>> {
    return this.request('/chatbot.php', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // File Upload
  async uploadFile(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload.php', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // AI Order Confirmation
  async confirmOrderWithAI(orderId: string, conversation: any[]): Promise<ApiResponse<{ confirmed: boolean }>> {
    return this.request('/confirm-order-ai.php', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, conversation }),
    });
  }
}

export const apiService = new ApiService();
export default apiService; 