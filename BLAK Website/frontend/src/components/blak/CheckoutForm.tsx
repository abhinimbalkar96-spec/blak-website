import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

interface CheckoutFormProps {
  formData: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  paymentMethod: 'credit-card' | 'apple-pay' | 'paypal';
  setPaymentMethod: (method: 'credit-card' | 'apple-pay' | 'paypal') => void;
}

export default function CheckoutForm({
  formData,
  setFormData,
  errors,
  paymentMethod,
  setPaymentMethod,
}: CheckoutFormProps) {
  return (
    <div className="space-y-8">
      {/* Shipping Information */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={errors.country ? 'border-red-500' : ''}
            />
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('credit-card')}
            className={`p-6 border-2 transition-colors flex flex-col items-center gap-3 ${
              paymentMethod === 'credit-card'
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard className="w-8 h-8" />
            <span className="font-bold">Credit Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('apple-pay')}
            className={`p-6 border-2 transition-colors flex flex-col items-center gap-3 ${
              paymentMethod === 'apple-pay'
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Smartphone className="w-8 h-8" />
            <span className="font-bold">Apple Pay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-6 border-2 transition-colors flex flex-col items-center gap-3 ${
              paymentMethod === 'paypal'
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Wallet className="w-8 h-8" />
            <span className="font-bold">PayPal</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Payment processing is simulated. No actual charges will be made.
        </p>
      </div>
    </div>
  );
}
