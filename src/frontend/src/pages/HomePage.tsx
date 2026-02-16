import { useNavigate } from '@tanstack/react-router';
import { useProducts } from '../hooks/queries/useProducts';
import ProductCard from '../components/store/ProductCard';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading, error, refetch } = useProducts();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-secondary">
        <img
          src="/assets/generated/vuurix-hero.dim_1600x600.png"
          alt="VUURIX Fashion"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="vuurix-container text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
              VUURIX
            </h1>
            <p className="mb-8 text-lg tracking-wide text-muted-foreground md:text-xl">
              Contemporary Fashion, Timeless Style
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/shop' })}
              className="group"
            >
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="vuurix-container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Featured Collection</h2>
            <p className="text-muted-foreground">Curated pieces for the season</p>
          </div>

          {isLoading && <LoadingState message="Loading featured products..." />}
          
          {error && (
            <ErrorState
              message={error.message || 'Failed to load products'}
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !error && featuredProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: '/shop' })}
                >
                  View All Products
                </Button>
              </div>
            </>
          )}

          {!isLoading && !error && featuredProducts.length === 0 && (
            <div className="text-center text-muted-foreground">
              <p>No products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

