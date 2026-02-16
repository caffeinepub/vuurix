import { useNavigate } from '@tanstack/react-router';
import type { Product } from '../../backend';
import ProductImage from './ProductImage';
import Price from '../design/Price';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden border-border transition-shadow hover:shadow-elegant cursor-pointer">
      <div onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}>
        <div className="aspect-square overflow-hidden bg-secondary/50">
          <ProductImage
            imageUrl={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
            {product.category}
          </div>
          <h3 className="mb-2 font-medium">{product.name}</h3>
          <Price amount={product.price} className="text-sm font-semibold" />
        </CardContent>
      </div>
    </Card>
  );
}

