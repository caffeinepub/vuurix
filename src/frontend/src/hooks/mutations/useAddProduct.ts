import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ProductId } from '../../backend';
import { toast } from 'sonner';

interface AddProductParams {
  name: string;
  description: string;
  price: bigint;
  category: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ProductId, Error, AddProductParams>({
    mutationFn: async ({ name, description, price, category, imageUrl, sizes, colors }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(name, description, price, category, imageUrl, sizes, colors);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error) => {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    }
  });
}
