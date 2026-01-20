import React, { useState } from 'react';
import { Calendar, Search, UserCheck, UserX, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';

interface Staff {
  id: string;
  full_name: string;
  department: string | null;
}

interface AttendanceRecord {
  id: string;
  staff_id: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
}

const mockStaff: Staff[] = [
  { id: '1', full_name: 'Rajesh Kumar', department: 'Management' },
  { id: '2', full_name: 'Priya Sharma', department: 'Accounts' },
  { id: '3', full_name: 'Amit Patel', department: 'Operations' },
  { id: '4', full_name: 'Sunita Devi', department: 'Field Work' },
  { id: '5', full_name: 'Mohammed Ali', department: 'Healthcare' },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const statuses: AttendanceRecord['status'][] = ['present', 'absent', 'half_day', 'leave'];
  
  mockStaff.forEach(staff => {
    // Generate attendance for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      if (date.getDay() !== 0) { // Skip Sundays
        const status = i === 0 ? 'present' : statuses[Math.floor(Math.random() * 4)];
        records.push({
          id: `${staff.id}-${format(date, 'yyyy-MM-dd')}`,
          staff_id: staff.id,
          date: format(date, 'yyyy-MM-dd'),
          status,
          check_in_time: status === 'present' || status === 'half_day' ? '09:00' : null,
          check_out_time: status === 'present' ? '18:00' : status === 'half_day' ? '13:00' : null,
          notes: null,
        });
      }
    }
  });
  
  return records;
};

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList] = useState<Staff[]>(mockStaff);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateMockAttendance());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const filteredStaff = staffList.filter(staff =>
    staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceForDate = (staffId: string, date: string) => {
    return attendance.find(a => a.staff_id === staffId && a.date === date);
  };

  const markAttendance = (staffId: string, status: AttendanceRecord['status']) => {
    const existingRecord = getAttendanceForDate(staffId, selectedDate);
    
    if (existingRecord) {
      setAttendance(records =>
        records.map(r =>
          r.id === existingRecord.id
            ? { 
                ...r, 
                status, 
                check_in_time: status === 'present' || status === 'half_day' ? format(new Date(), 'HH:mm') : null,
                check_out_time: null 
              }
            : r
        )
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `${staffId}-${selectedDate}`,
        staff_id: staffId,
        date: selectedDate,
        status,
        check_in_time: status === 'present' || status === 'half_day' ? format(new Date(), 'HH:mm') : null,
        check_out_time: null,
        notes: null,
      };
      setAttendance(records => [...records, newRecord]);
    }
    toast.success('Attendance marked');
  };

  const getStatusBadge = (status: AttendanceRecord['status'] | undefined) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'half_day':
        return <Badge className="bg-yellow-100 text-yellow-800">Half Day</Badge>;
      case 'leave':
        return <Badge className="bg-blue-100 text-blue-800">Leave</Badge>;
      default:
        return <Badge variant="outline">Not Marked</Badge>;
    }
  };

  // Calculate monthly stats
  const getMonthlyStats = (staffId: string) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    
    const staffAttendance = attendance.filter(
      a => a.staff_id === staffId && new Date(a.date) >= start && new Date(a.date) <= end
    );
    
    return {
      present: staffAttendance.filter(a => a.status === 'present').length,
      absent: staffAttendance.filter(a => a.status === 'absent').length,
      halfDay: staffAttendance.filter(a => a.status === 'half_day').length,
      leave: staffAttendance.filter(a => a.status === 'leave').length,
    };
  };

  const todaysAttendance = attendance.filter(a => a.date === format(new Date(), 'yyyy-MM-dd'));
  const presentToday = todaysAttendance.filter(a => a.status === 'present' || a.status === 'half_day').length;
  const absentToday = todaysAttendance.filter(a => a.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Attendance Management
          </h1>
          <p className="text-muted-foreground">Mark daily attendance and view reports</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-500" />
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffList.length > 0 ? Math.round((presentToday / staffList.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Marking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mark Attendance - {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
            {isToday(new Date(selectedDate)) && (
              <Badge variant="outline" className="bg-green-50">Today</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Mark Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map(staff => {
                const record = getAttendanceForDate(staff.id, selectedDate);
                return (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.full_name}</TableCell>
                    <TableCell>{staff.department || '-'}</TableCell>
                    <TableCell>{getStatusBadge(record?.status)}</TableCell>
                    <TableCell>{record?.check_in_time || '-'}</TableCell>
                    <TableCell>{record?.check_out_time || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={record?.status === 'present' ? 'default' : 'outline'}
                          className="text-xs"
                          onClick={() => markAttendance(staff.id, 'present')}
                        >
                          P
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === 'absent' ? 'destructive' : 'outline'}
                          className="text-xs"
                          onClick={() => markAttendance(staff.id, 'absent')}
                        >
                          A
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === 'half_day' ? 'secondary' : 'outline'}
                          className="text-xs"
                          onClick={() => markAttendance(staff.id, 'half_day')}
                        >
                          H
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === 'leave' ? 'secondary' : 'outline'}
                          className="text-xs"
                          onClick={() => markAttendance(staff.id, 'leave')}
                        >
                          L
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Attendance Report</span>
            <div className="flex gap-2">
              <Input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-40"
              />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Half Day</TableHead>
                <TableHead className="text-center">Leave</TableHead>
                <TableHead className="text-center">Attendance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map(staff => {
                const stats = getMonthlyStats(staff.id);
                const totalDays = stats.present + stats.absent + stats.halfDay + stats.leave;
                const attendanceRate = totalDays > 0 
                  ? Math.round(((stats.present + stats.halfDay * 0.5) / totalDays) * 100) 
                  : 0;
                
                return (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.full_name}</TableCell>
                    <TableCell>{staff.department || '-'}</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">{stats.present}</TableCell>
                    <TableCell className="text-center text-red-600 font-medium">{stats.absent}</TableCell>
                    <TableCell className="text-center text-yellow-600 font-medium">{stats.halfDay}</TableCell>
                    <TableCell className="text-center text-blue-600 font-medium">{stats.leave}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={attendanceRate >= 80 ? 'default' : attendanceRate >= 60 ? 'secondary' : 'destructive'}>
                        {attendanceRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
