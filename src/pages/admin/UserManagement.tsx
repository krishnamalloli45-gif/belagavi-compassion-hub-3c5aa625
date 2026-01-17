import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type AppRole = 'admin' | 'finance' | 'project_manager' | 'volunteer' | 'auditor';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
}

interface UserWithRoles extends Profile {
  roles: AppRole[];
}

const ROLES: AppRole[] = ['admin', 'finance', 'project_manager', 'volunteer', 'auditor'];

const UserManagement = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
    ]);

    if (profilesRes.data && rolesRes.data) {
      const rolesMap: Record<string, AppRole[]> = {};
      rolesRes.data.forEach((role: UserRole) => {
        if (!rolesMap[role.user_id]) rolesMap[role.user_id] = [];
        rolesMap[role.user_id].push(role.role);
      });

      const usersWithRoles = profilesRes.data.map((profile: Profile) => ({
        ...profile,
        roles: rolesMap[profile.user_id] || [],
      }));

      setUsers(usersWithRoles);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addRole = async (userId: string, role: AppRole) => {
    if (!user) return;

    setUpdating(userId);

    const { error } = await supabase.from('user_roles').insert({
      user_id: userId,
      role,
      assigned_by: user.id,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('User already has this role');
      } else {
        toast.error('Failed to add role');
        console.error(error);
      }
    } else {
      toast.success(`${role} role added`);
      fetchUsers();
    }

    setUpdating(null);
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (userId === user?.id && role === 'admin') {
      toast.error("You can't remove your own admin role");
      return;
    }

    setUpdating(userId);

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      toast.error('Failed to remove role');
      console.error(error);
    } else {
      toast.success(`${role} role removed`);
      fetchUsers();
    }

    setUpdating(null);
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'finance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'project_manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'volunteer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'auditor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return '';
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You need Admin role to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage staff accounts and role assignments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Add Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        {format(new Date(u.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {u.roles.length === 0 ? (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          ) : (
                            u.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className={`${getRoleBadgeColor(role)} cursor-pointer group`}
                                onClick={() => removeRole(u.user_id, role)}
                              >
                                {role.replace('_', ' ')}
                                <Trash2 className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value=""
                          onValueChange={(role) => addRole(u.user_id, role as AppRole)}
                          disabled={updating === u.user_id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Add role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.filter((r) => !u.roles.includes(r)).map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="font-semibold text-red-800">Admin</h4>
              <p className="text-sm text-red-700 mt-1">
                Full system access. Can manage users, roles, and all data.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-800">Finance</h4>
              <p className="text-sm text-green-700 mt-1">
                Manage income, expenses, fund accounts, and approve transactions.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-800">Project Manager</h4>
              <p className="text-sm text-blue-700 mt-1">
                Manage projects, activities, and submit expense requests.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <h4 className="font-semibold text-purple-800">Volunteer</h4>
              <p className="text-sm text-purple-700 mt-1">
                View dashboard, submit expenses, and log activities.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <h4 className="font-semibold text-orange-800">Auditor</h4>
              <p className="text-sm text-orange-700 mt-1">
                Read-only access to financial records and reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
