import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/blak/ProductCard';
import ShopControls from '../components/blak/ShopControls';
import FadeInOnView from '../components/blak/FadeInOnView';
import { usePageMeta } from '../hooks/usePageMeta';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  usePageMeta('Shop — BLAK', 'Browse our collection of premium monochrome streetwear.');

  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by size
    if (selectedSize !== 'All') {
      filtered = filtered.filter((p) => p.sizes.includes(selectedSize));
    }

    // Sort
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Assuming products are already sorted by newest from backend
      // If not, we'd need a createdAt field
    }

    return filtered;
  }, [products, selectedCategory, selectedSize, sortBy]);

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        <FadeInOnView>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              Shop
            </h1>
            <p className="text-lg text-gray-600">
              Explore our full collection
            </p>
          </div>
        </FadeInOnView>

        <ShopControls
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-600">No products found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
              <FadeInOnView key={product.id}>
                <ProductCard product={product} />
              </FadeInOnView>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
