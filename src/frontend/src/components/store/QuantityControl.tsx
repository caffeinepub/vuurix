import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="h-8 w-8"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="h-8 w-8"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

