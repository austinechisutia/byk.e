'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Package, Users, ShoppingBag, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboardClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) return;
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const uniqueClients = new Set(orders.map((o) => o.user.id)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#11430F]/20 border-t-[#11430F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e8] pt-28 pb-20 px-6 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,243,134,0.55),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(17,67,15,0.14),_transparent_32%),linear-gradient(135deg,_#f8f5ef_0%,_#efe6d6_100%)]" />
      <div className="absolute inset-x-0 top-16 mx-auto h-72 w-72 rounded-full bg-white/30 blur-3xl" />
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#11430F]/70 mb-2">
            Admin
          </p>
          <h1 className="font-serif text-5xl text-[#11430F]">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: orders.length, icon: Package },
            { label: 'Total Clients', value: uniqueClients, icon: Users },
            { label: 'Items Sold', value: orders.reduce((s, o) => s + o.items.reduce((q, i) => q + i.quantity, 0), 0), icon: ShoppingBag },
            { label: 'Revenue (Kes)', value: `${totalRevenue.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-4 h-4 text-[#11430F]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#11430F]/60">{label}</span>
              </div>
              <p className="text-3xl font-serif text-[#11430F]">{value}</p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-serif text-2xl text-[#11430F]">Orders</h2>
          </div>

          {orders.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500 italic">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id}>
                  {/* Row */}
                  <button
                    className="w-full text-left px-6 py-5 hover:bg-white/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{order.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                          Kes {order.total.toLocaleString()}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expandedOrder === order.id && (
                    <div className="px-6 pb-6 bg-white/40 grid md:grid-cols-2 gap-6">
                      {/* Client info */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#11430F]/60 mb-3">Client</p>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-medium">Name:</span> {order.firstName} {order.lastName}</p>
                          <p><span className="font-medium">Email:</span> {order.email}</p>
                          <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.postalCode}</p>
                          <p><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                          <p><span className="font-medium">Account since:</span> {new Date(order.user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#11430F]/60 mb-3">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className="text-gray-500">x{item.quantity} · {item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200 text-sm space-y-1">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span><span>Kes {order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span><span>Kes {order.shipping.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span><span>Kes {order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status update */}
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#11430F]/60 mb-3">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              disabled={updatingId === order.id || order.status === s}
                              onClick={() => void updateStatus(order.id, s)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-50 ${order.status === s ? (STATUS_COLORS[s] ?? 'bg-gray-200') : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
