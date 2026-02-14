import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order } from '../backend';

export function useCompleteOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeOrder(order);
    },
  });
}
