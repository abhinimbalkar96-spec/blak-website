import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function OrderConfirmationPage() {
  usePageMeta('Order Confirmed — BLAK', 'Your order has been placed successfully.');

  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-black text-white rounded-full mb-8">
            <CheckCircle className="w-12 h-12" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Order Confirmed
          </h1>

          <p className="text-xl text-gray-600 mb-4">
            Thank you for your order! Your order has been successfully placed.
          </p>

          <div className="bg-gray-50 p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-lg font-bold font-mono">{orderId}</p>
          </div>

          <p className="text-gray-600 mb-8">
            You will receive an email confirmation shortly with your order details.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="bg-black text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="border border-black text-black px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
