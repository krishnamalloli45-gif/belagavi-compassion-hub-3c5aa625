import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  category: string | null;
  minimum_stock: number;
  created_at: string;
  created_by: string | null;
}

export type FoodItemInsert = Omit<FoodItem, 'id' | 'created_at' | 'created_by'>;

export const useFoodInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['food-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (item: FoodItemInsert) => {
      const { data, error } = await supabase
        .from('food_inventory')
        .insert({
          ...item,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-inventory'] });
      toast.success('Food item added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add food item: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...item }: Partial<FoodItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('food_inventory')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-inventory'] });
      toast.success('Food item updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update food item: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('food_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-inventory'] });
      toast.success('Food item deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete food item: ' + error.message);
    },
  });

  return {
    foodItems: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
