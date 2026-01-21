import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MedicineItem {
  id: string;
  name: string;
  batch_number: string | null;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  manufacturer: string | null;
  minimum_stock: number;
  created_at: string;
  created_by: string | null;
}

export type MedicineItemInsert = Omit<MedicineItem, 'id' | 'created_at' | 'created_by'>;

export const useMedicineInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['medicine-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicine_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MedicineItem[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (item: MedicineItemInsert) => {
      const { data, error } = await supabase
        .from('medicine_inventory')
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
      queryClient.invalidateQueries({ queryKey: ['medicine-inventory'] });
      toast.success('Medicine added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add medicine: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...item }: Partial<MedicineItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('medicine_inventory')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-inventory'] });
      toast.success('Medicine updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update medicine: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medicine_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-inventory'] });
      toast.success('Medicine deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete medicine: ' + error.message);
    },
  });

  return {
    medicineItems: query.data ?? [],
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
