import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/queries/useProducts';
import ProductCard from '../components/store/ProductCard';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { Button } from '@/components/ui/button';

export default function ShopPage() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="py-12">
      <div className="vuurix-container">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Shop</h1>
          <p className="text-muted-foreground">Explore our complete collection</p>
        </div>

        {/* Category Filter */}
        {!isLoading && !error && categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {isLoading && <LoadingState message="Loading products..." />}

        {error && (
          <ErrorState
            message={error.message || 'Failed to load products'}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

