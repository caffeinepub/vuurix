import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cart';
import ProductImage from '../components/store/ProductImage';
import Price from '../components/design/Price';
import QuantityControl from '../components/store/QuantityControl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="vuurix-container">
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some items to get started</p>
            <Button onClick={() => navigate({ to: '/shop' })} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="vuurix-container">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={`${item.product.id}-${item.size}-${item.color}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-secondary/50">
                        <ProductImage
                          imageUrl={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> • </span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <Price amount={item.product.price} className="mt-2 font-semibold" />
                        </div>

                        <div className="flex items-center justify-between">
                          <QuantityControl
                            quantity={item.quantity}
                            onIncrease={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.size,
                                item.color
                              )
                            }
                            onDecrease={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.size,
                                item.color
                              )
                            }
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <Price amount={BigInt(total)} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <Price amount={BigInt(total)} />
                </div>
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => navigate({ to: '/checkout' })}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

