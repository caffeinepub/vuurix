import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cart';
import { useCreateOrder } from '../hooks/mutations/useCreateOrder';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import Price from '../components/design/Price';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { OrderItem } from '../backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { identity, login, loginStatus } = useInternetIdentity();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const total = getTotal();
  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert cart items to order items
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      quantity: BigInt(item.quantity),
      size: item.size,
      color: item.color
    }));

    createOrder(
      { items: orderItems, total: BigInt(total) },
      {
        onSuccess: (orderId) => {
          clearCart();
          toast.success('Order placed successfully!');
          navigate({ to: '/order/$orderId', params: { orderId: orderId.toString() } });
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to place order');
        }
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="vuurix-container">
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some items before checking out</p>
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
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

        {!isAuthenticated && (
          <Card className="mb-8 border-accent">
            <CardContent className="p-6">
              <p className="mb-4 text-sm">You need to log in to place an order.</p>
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!isAuthenticated}
                      />
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isAuthenticated}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <Price amount={BigInt(Number(item.product.price) * item.quantity)} />
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <Price amount={BigInt(total)} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
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
                  onClick={handleSubmit}
                  disabled={!isAuthenticated || isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

