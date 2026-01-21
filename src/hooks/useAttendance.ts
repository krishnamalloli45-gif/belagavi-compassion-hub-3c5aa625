import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface AttendanceRecord {
  id: string;
  staff_id: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
  marked_by: string | null;
  created_at: string;
}

export type AttendanceInsert = Omit<AttendanceRecord, 'id' | 'created_at' | 'marked_by'>;

export const useAttendance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!user,
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async ({ 
      staffId, 
      date, 
      status 
    }: { 
      staffId: string; 
      date: string; 
      status: AttendanceRecord['status'];
    }) => {
      const checkInTime = (status === 'present' || status === 'half_day') 
        ? format(new Date(), 'HH:mm:ss') 
        : null;

      // Try to upsert - insert or update if exists
      const { data, error } = await supabase
        .from('attendance')
        .upsert(
          {
            staff_id: staffId,
            date: date,
            status: status,
            check_in_time: checkInTime,
            check_out_time: null,
            marked_by: user?.id,
          },
          { 
            onConflict: 'staff_id,date',
            ignoreDuplicates: false 
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked');
    },
    onError: (error: Error) => {
      toast.error('Failed to mark attendance: ' + error.message);
    },
  });

  const getAttendanceForDate = (staffId: string, date: string) => {
    return query.data?.find(a => a.staff_id === staffId && a.date === date);
  };

  const getMonthlyStats = (staffId: string, year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const staffAttendance = query.data?.filter(a => {
      const recordDate = new Date(a.date);
      return a.staff_id === staffId && 
             recordDate >= startDate && 
             recordDate <= endDate;
    }) ?? [];

    return {
      present: staffAttendance.filter(a => a.status === 'present').length,
      absent: staffAttendance.filter(a => a.status === 'absent').length,
      halfDay: staffAttendance.filter(a => a.status === 'half_day').length,
      leave: staffAttendance.filter(a => a.status === 'leave').length,
    };
  };

  return {
    attendance: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    markAttendance: markAttendanceMutation.mutateAsync,
    isMarking: markAttendanceMutation.isPending,
    getAttendanceForDate,
    getMonthlyStats,
  };
};
