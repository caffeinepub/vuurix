import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useProduct } from '../hooks/queries/useProduct';
import { useCartStore } from '../state/cart';
import ProductImage from '../components/store/ProductImage';
import Price from '../components/design/Price';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch } = useProduct(BigInt(productId));
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
    toast.success('Added to cart');
  };

  if (isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || 'Failed to load product'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!product) {
    return <ErrorState message="Product not found" />;
  }

  return (
    <div className="py-12">
      <div className="vuurix-container">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/shop' })}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-secondary/50">
            <ProductImage
              imageUrl={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-sm uppercase tracking-widest text-muted-foreground">
              {product.category}
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight">{product.name}</h1>
            <Price amount={product.price} className="mb-6 text-2xl font-bold" />

            <div className="mb-8 text-muted-foreground">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block text-sm font-medium">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block text-sm font-medium">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <Label className="mb-2 block text-sm font-medium">Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button size="lg" onClick={handleAddToCart} className="w-full">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

