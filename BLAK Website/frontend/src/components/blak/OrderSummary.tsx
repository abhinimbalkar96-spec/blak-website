import { useMemo } from 'react';
import { useCart } from '../../state/CartProvider';
import { useProducts } from '../../hooks/useProducts';

export default function OrderSummary() {
  const { items } = useCart();
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

  return (
    <div className="bg-gray-50 p-8 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cartWithDetails.map((item) => {
          if (!item.product) return null;
          return (
            <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
              <div>
                <p className="font-bold">{item.product.name}</p>
                <p className="text-gray-600">
                  {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                </p>
              </div>
              <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-300 pt-4 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-bold">${shipping.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 flex justify-between text-xl">
        <span className="font-bold">Total</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
