import { useNavigate } from '@tanstack/react-router';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/blak/ProductCard';
import ParallaxSection from '../components/blak/ParallaxSection';
import FadeInOnView from '../components/blak/FadeInOnView';
import { usePageMeta } from '../hooks/usePageMeta';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  usePageMeta('BLAK — Wear the Statement', 'Bold, confident monochrome streetwear. Premium black and white fashion.');
  
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="bg-white">
      {/* Hero Section with Parallax */}
      <ParallaxSection
        imageUrl="/assets/generated/blak-hero.dim_2400x1400.jpg"
        className="h-screen"
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              BLAK — Wear the Statement.
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light tracking-wide">
              Bold. Confident. Monochrome.
            </p>
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="bg-white text-black px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </ParallaxSection>

      {/* Parallax Section 1 */}
      <ParallaxSection
        imageUrl="/assets/generated/blak-parallax-1.dim_2400x1400.jpg"
        className="min-h-screen"
      >
        <div className="min-h-screen flex items-center justify-center">
          <FadeInOnView>
            <div className="text-center text-white px-6 max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Minimalist Luxury
              </h2>
              <p className="text-lg md:text-xl font-light tracking-wide">
                Where streetwear meets high fashion. Every piece tells a story of bold simplicity.
              </p>
            </div>
          </FadeInOnView>
        </div>
      </ParallaxSection>

      {/* Parallax Section 2 */}
      <ParallaxSection
        imageUrl="/assets/generated/blak-parallax-2.dim_2400x1400.jpg"
        className="min-h-screen"
      >
        <div className="min-h-screen flex items-center justify-center">
          <FadeInOnView>
            <div className="text-center text-white px-6 max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Urban Edge
              </h2>
              <p className="text-lg md:text-xl font-light tracking-wide">
                Designed for those who dare to stand out by keeping it simple.
              </p>
            </div>
          </FadeInOnView>
        </div>
      </ParallaxSection>

      {/* Featured Collection */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeInOnView>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                Featured Collection
              </h2>
              <p className="text-lg text-gray-600">
                Curated pieces for the modern minimalist
              </p>
            </div>
          </FadeInOnView>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <FadeInOnView key={product.id}>
                    <ProductCard product={product} />
                  </FadeInOnView>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate({ to: '/shop' })}
                  className="bg-black text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                >
                  View All
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About / Brand Statement */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeInOnView>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
                The BLAK Philosophy
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
                <p>
                  <strong>Bold.</strong> We believe in making statements without saying a word. 
                  Our designs speak through their simplicity and confidence.
                </p>
                <p>
                  <strong>Confident.</strong> Fashion is about owning who you are. 
                  BLAK is for those who embrace their identity with unwavering certainty.
                </p>
                <p>
                  <strong>Monochrome Identity.</strong> In a world of noise, we choose clarity. 
                  Black and white. Simple. Powerful. Timeless.
                </p>
              </div>
            </div>
          </FadeInOnView>
        </div>
      </section>
    </div>
  );
}
