import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ProductId } from '../../backend';
import { toast } from 'sonner';

interface UpdateProductParams {
  id: ProductId;
  name: string;
  description: string;
  price: bigint;
  category: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateProductParams>({
    mutationFn: async ({ id, name, description, price, category, imageUrl, sizes, colors }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, name, description, price, category, imageUrl, sizes, colors);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    }
  });
}
