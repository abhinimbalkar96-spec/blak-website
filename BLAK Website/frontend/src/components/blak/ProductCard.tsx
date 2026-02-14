import { useState } from 'react';
import { useCart } from '../../state/CartProvider';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.image
    ? product.image.getDirectURL()
    : `/assets/generated/product-${product.category.toLowerCase()}.dim_1200x1200.jpg`;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem(product.id, selectedSize || undefined);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover overlay with Add to Cart */}
        <div
          className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto`}
        >
          {product.sizes.length > 0 && (
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1 text-sm font-bold transition-colors ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white border border-white hover:bg-white hover:text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="bg-white text-black px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Mobile: Always visible controls */}
      <div className="md:hidden mb-4">
        {product.sizes.length > 0 && (
          <div className="flex gap-2 mb-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-sm font-bold border transition-colors ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
