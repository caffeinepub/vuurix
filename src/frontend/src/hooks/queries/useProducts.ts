import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product } from '../../backend';

export function useProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProducts();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

