import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, UserCheck, UserX, Loader2 } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { useStaff, Staff } from '@/hooks/useStaff';
import { useAuth } from '@/contexts/AuthContext';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'finance', label: 'Finance' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'auditor', label: 'Auditor' },
];

const departmentOptions = [
  'Management',
  'Accounts',
  'Operations',
  'Field Work',
  'Healthcare',
  'Education',
  'Logistics',
];

const StaffManagement = () => {
  const { isAdmin } = useAuth();
  const { 
    staffList, 
    isLoading, 
    addStaff, 
    updateStaff, 
    deleteStaff,
    isAdding,
    isUpdating,
    isDeleting,
  } = useStaff();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'volunteer',
    department: '',
    join_date: format(new Date(), 'yyyy-MM-dd'),
    is_active: true,
  });

  const filteredStaff = staffList.filter(staff =>
    staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.phone?.includes(searchTerm) ||
    staff.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'finance': return 'bg-blue-100 text-blue-800';
      case 'project_manager': return 'bg-green-100 text-green-800';
      case 'auditor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff({
          id: editingStaff.id,
          ...formData,
          email: formData.email || null,
          phone: formData.phone || null,
          department: formData.department || null,
        });
      } else {
        await addStaff({
          ...formData,
          email: formData.email || null,
          phone: formData.phone || null,
          department: formData.department || null,
        });
      }
      resetForm();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      try {
        await deleteStaff(id);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      full_name: staff.full_name,
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role,
      department: staff.department || '',
      join_date: staff.join_date,
      is_active: staff.is_active,
    });
    setIsAddDialogOpen(true);
  };

  const toggleActiveStatus = async (staff: Staff) => {
    try {
      await updateStaff({
        id: staff.id,
        is_active: !staff.is_active,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'volunteer',
      department: '',
      join_date: format(new Date(), 'yyyy-MM-dd'),
      is_active: true,
    });
    setEditingStaff(null);
    setIsAddDialogOpen(false);
  };

  const activeCount = staffList.filter(s => s.is_active).length;
  const volunteerCount = staffList.filter(s => s.role === 'volunteer').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Staff Management
          </h1>
          <p className="text-muted-foreground">Manage staff members, volunteers and their roles</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingStaff(null); resetForm(); setIsAddDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={value => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={value => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join_date">Join Date</Label>
                  <Input
                    id="join_date"
                    type="date"
                    value={formData.join_date}
                    onChange={e => setFormData({ ...formData, join_date: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active Status</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAdding || isUpdating}>
                    {(isAdding || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingStaff ? 'Update' : 'Add'} Staff
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserX className="h-4 w-4 text-gray-500" />
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{staffList.length - activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.full_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {staff.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {staff.email}
                          </div>
                        )}
                        {staff.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {staff.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(staff.role)}>
                        {roleOptions.find(r => r.value === staff.role)?.label || staff.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.department || '-'}</TableCell>
                    <TableCell>{format(new Date(staff.join_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Switch
                        checked={staff.is_active}
                        onCheckedChange={() => toggleActiveStatus(staff)}
                        disabled={!isAdmin}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(staff)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(staff.id)} disabled={isDeleting}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
