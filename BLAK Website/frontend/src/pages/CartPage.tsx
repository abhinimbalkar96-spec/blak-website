import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../state/CartProvider';
import { useProducts } from '../hooks/useProducts';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useMemo } from 'react';

export default function CartPage() {
  usePageMeta('Shopping Cart — BLAK', 'Review your cart and proceed to checkout.');

  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCart();
  const { data: products } = useProducts();

  const cartWithDetails = useMemo(() => {
    if (!products) return [];
    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...item, product };
    });
  }, [items, products]);

  const subtotal = useMemo(() => {
    return cartWithDetails.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, [cartWithDetails]);

  const shipping = 15.0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Your Cart
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your cart is empty. Start shopping to add items.
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

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-center">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartWithDetails.map((item) => {
              if (!item.product) return null;

              const imageUrl = item.product.image
                ? item.product.image.getDirectURL()
                : `/assets/generated/product-${item.product.category.toLowerCase()}.dim_1200x1200.jpg`;

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-6 border-b border-gray-200 pb-6"
                >
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.product.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                    )}
                    <p className="text-lg font-bold mb-4">${item.product.price.toFixed(2)}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-gray-600 hover:text-black transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate({ to: '/shop' })}
                className="w-full mt-4 border border-black text-black py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
