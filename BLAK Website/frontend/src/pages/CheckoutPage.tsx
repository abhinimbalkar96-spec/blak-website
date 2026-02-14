import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../state/CartProvider';
import { useProducts } from '../hooks/useProducts';
import { useCompleteOrder } from '../hooks/useCompleteOrder';
import CheckoutForm from '../components/blak/CheckoutForm';
import OrderSummary from '../components/blak/OrderSummary';
import { usePageMeta } from '../hooks/usePageMeta';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  usePageMeta('Checkout — BLAK', 'Complete your order securely.');

  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { data: products } = useProducts();
  const { mutate: completeOrder, isPending } = useCompleteOrder();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'apple-pay' | 'paypal'>(
    'credit-card'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Checkout
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your cart is empty. Add items before checking out.
            </p>
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="bg-black text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const subtotal = items.reduce((sum, item) => {
      const product = products?.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const shipping = 15.0;
    const total = subtotal + shipping;

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    completeOrder(
      {
        id: orderId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: BigInt(item.quantity),
          size: item.size || undefined,
        })),
        total,
        checkoutForm: formData,
      },
      {
        onSuccess: (returnedOrderId) => {
          clearCart();
          navigate({ to: `/order-confirmation/${returnedOrderId}` });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-center">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
