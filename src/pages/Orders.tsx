import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface Order {
  id: number;
  front_design?: string;
  back_design?: string;
  left_design?: string;
  right_design?: string;
  base_price: number;
  design_price: number;
  total_price: number;
  quantity: number;
  status: string;
  created_at: string;
  is_hidden: boolean;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders.php', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch('/api/orders.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          delete_order: true,
          order_id: orderId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const confirmOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/confirm_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ order_id: orderId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }
      
      // Update order status locally
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'confirmed' }
          : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm order');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      confirmed: 'bg-success',
      rejected: 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">My Order History</h1>
          <p className="text-xl opacity-90">View and manage your current and past T-shirt orders</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Orders Yet</h3>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start by adding designs to your cart from the Design Studio!</p>
            <a 
              href="/design" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Designing
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Order #{order.id}
                      {order.is_hidden && (
                        <span className="ml-2 bg-gray-500 text-white px-2 py-1 rounded text-sm">
                          Hidden
                        </span>
                      )}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Design Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {order.front_design && (
                      <div className="relative">
                        <span className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          Front
                        </span>
                        <img 
                          src={order.front_design} 
                          alt="Front Design"
                          className="w-full h-32 object-contain bg-gray-100 rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                    {order.back_design && (
                      <div className="relative">
                        <span className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          Back
                        </span>
                        <img 
                          src={order.back_design} 
                          alt="Back Design"
                          className="w-full h-32 object-contain bg-gray-100 rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                    {order.left_design && (
                      <div className="relative">
                        <span className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          Left
                        </span>
                        <img 
                          src={order.left_design} 
                          alt="Left Design"
                          className="w-full h-32 object-contain bg-gray-100 rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                    {order.right_design && (
                      <div className="relative">
                        <span className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          Right
                        </span>
                        <img 
                          src={order.right_design} 
                          alt="Right Design"
                          className="w-full h-32 object-contain bg-gray-100 rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Quantity</h6>
                      <p className="font-semibold text-lg">{order.quantity}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Base Price</h6>
                      <p className="font-semibold text-lg">${order.base_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Design Price</h6>
                      <p className="font-semibold text-lg">${order.design_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Price</h6>
                      <p className="font-semibold text-lg text-blue-600">${order.total_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Status</h6>
                      <p className="font-semibold text-lg">{order.status}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="text-xs text-gray-600 uppercase tracking-wide mb-1">Date</h6>
                      <p className="font-semibold text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {order.status === 'approved' ? (
                      <a 
                        href={`/payment?order_id=${order.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Proceed to Payment
                      </a>
                    ) : (
                      <button
                        onClick={() => confirmOrder(order.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Confirm Order
                      </button>
                    )}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <a 
        href="/design"
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-all hover:scale-110"
        title="Create New Design"
      >
        +
      </a>
    </div>
  );
};

export default Orders; 