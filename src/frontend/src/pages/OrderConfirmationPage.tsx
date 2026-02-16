import { useParams, useNavigate } from '@tanstack/react-router';
import { useOrder } from '../hooks/queries/useOrder';
import Price from '../components/design/Price';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(BigInt(orderId));

  if (isLoading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Order Not Found"
        message={error.message || 'Failed to load order details'}
      />
    );
  }

  if (!order) {
    return <ErrorState message="Order not found" />;
  }

  return (
    <div className="py-12">
      <div className="vuurix-container max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="text-sm text-muted-foreground">Order Number</div>
              <div className="text-lg font-bold">#{order.id.toString()}</div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <div>Product ID: {item.productId.toString()}</div>
                      <div className="text-muted-foreground">
                        Quantity: {item.quantity.toString()}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <Price amount={order.total} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: '/shop' })}
              >
                Continue Shopping
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate({ to: '/' })}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

