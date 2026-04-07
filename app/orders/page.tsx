'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string | null;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusClass = statusColors[order.status] ?? 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Order header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Order ID</p>
            <p className="text-sm font-mono font-bold text-gray-700 truncate">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
            <p className="text-sm font-semibold text-gray-800">{date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Total</p>
            <p className="text-sm font-bold text-[#11430F]">Kes {order.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Payment</p>
            <p className="text-sm font-semibold text-gray-800 capitalize">{order.paymentMethod}</p>
          </div>
          <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${statusClass}`}>
            {order.status}
          </span>
        </div>
        <div className="ml-4 text-gray-400 shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100 pt-5 space-y-6">
              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f8f9f5] border border-gray-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      {item.category && (
                        <p className="text-xs text-gray-400 font-medium">{item.category}</p>
                      )}
                      <p className="text-sm text-gray-600 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#11430F] shrink-0">{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Address + totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Address</p>
                  <p className="text-sm font-semibold text-gray-800">{order.firstName} {order.lastName}</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                  <p className="text-sm text-gray-600">{order.city}, {order.postalCode}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Kes {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Kes {order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                      <span>Total</span>
                      <span>Kes {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/orders');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders.');
        return res.json() as Promise<Order[]>;
      })
      .then(setOrders)
      .catch((err: unknown) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <main className="min-h-screen bg-[#fcfdfa] pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#11430F]/20 border-t-[#11430F] rounded-full animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fcfdfa] pt-32 pb-24 flex items-center justify-center">
        <p className="text-red-600 font-medium">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa] pt-24 md:pt-32 pb-24">
      <div className="w-full max-w-3xl mx-auto px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Package className="text-[#11430F]" size={28} />
          <div>
            <h1 className="text-3xl font-serif italic text-gray-900">My Orders</h1>
            {session?.user?.name && (
              <p className="text-sm text-gray-500 font-medium">{session.user.name}</p>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-serif italic text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm mb-6">Your order history will appear here once you make a purchase.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#11430F] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
