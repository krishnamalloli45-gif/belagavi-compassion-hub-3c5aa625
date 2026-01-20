import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  FileText,
  Users,
  Settings,
  LogOut,
  Heart,
  ChevronDown,
  Package,
  Pill,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const AdminSidebar = () => {
  const { profile, roles, signOut, isAdmin, isFinance } = useAuth();
  const location = useLocation();
  const [financeOpen, setFinanceOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [staffOpen, setStaffOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      show: true,
    },
  ];

  const financeItems = [
    { title: 'Overview', icon: DollarSign, path: '/admin/finance', show: true },
    { title: 'Income', icon: TrendingUp, path: '/admin/finance/income', show: isFinance },
    { title: 'Expenses', icon: TrendingDown, path: '/admin/finance/expenses', show: true },
    { title: 'Fund Accounts', icon: PiggyBank, path: '/admin/finance/funds', show: isFinance },
    { title: 'Reports', icon: FileText, path: '/admin/finance/reports', show: true },
  ];

  const inventoryItems = [
    { title: 'Food Inventory', icon: Package, path: '/admin/inventory/food', show: true },
    { title: 'Medicine Inventory', icon: Pill, path: '/admin/inventory/medicine', show: true },
  ];

  const staffItems = [
    { title: 'Staff Management', icon: UserCheck, path: '/admin/staff', show: true },
    { title: 'Attendance', icon: Calendar, path: '/admin/staff/attendance', show: true },
  ];

  const adminItems = [
    { title: 'User Management', icon: Users, path: '/admin/users', show: isAdmin },
    { title: 'Settings', icon: Settings, path: '/admin/settings', show: isAdmin },
  ];
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg">STW Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}

        {/* Finance Section */}
        <Collapsible open={financeOpen} onOpenChange={setFinanceOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5" />
              <span>Finance</span>
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', financeOpen && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {financeItems.filter((item) => item.show).map((item) => (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.title}</span>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Inventory Section */}
        <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', inventoryOpen && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {inventoryItems.filter((item) => item.show).map((item) => (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.title}</span>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Staff Section */}
        <Collapsible open={staffOpen} onOpenChange={setStaffOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5" />
              <span>Staff</span>
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', staffOpen && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {staffItems.filter((item) => item.show).map((item) => (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.title}</span>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Administration
            </p>
            {adminItems
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
          </div>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="font-medium text-sm truncate">{profile?.full_name || 'User'}</p>
          <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {roles.map((role) => (
              <span
                key={role}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize"
              >
                {role.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
