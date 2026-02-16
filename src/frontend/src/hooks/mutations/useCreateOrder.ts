import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { OrderItem, OrderId } from '../../backend';

interface CreateOrderParams {
  items: OrderItem[];
  total: bigint;
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<OrderId, Error, CreateOrderParams>({
    mutationFn: async ({ items, total }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(items, total);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

