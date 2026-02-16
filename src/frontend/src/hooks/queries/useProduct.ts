import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product, ProductId } from '../../backend';

export function useProduct(productId: ProductId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

