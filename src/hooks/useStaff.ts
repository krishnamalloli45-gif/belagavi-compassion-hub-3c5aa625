import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Staff {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  department: string | null;
  join_date: string;
  is_active: boolean;
  created_at: string;
}

export type StaffInsert = Omit<Staff, 'id' | 'created_at'>;

export const useStaff = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Staff[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (staff: StaffInsert) => {
      const { data, error } = await supabase
        .from('staff')
        .insert(staff)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add staff: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...staff }: Partial<Staff> & { id: string }) => {
      const { data, error } = await supabase
        .from('staff')
        .update(staff)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update staff: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member removed');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove staff: ' + error.message);
    },
  });

  return {
    staffList: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addStaff: addMutation.mutateAsync,
    updateStaff: updateMutation.mutateAsync,
    deleteStaff: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
