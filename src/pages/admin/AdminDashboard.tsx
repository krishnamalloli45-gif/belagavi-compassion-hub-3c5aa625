import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  pendingExpenses: number;
  fundBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
}

const AdminDashboard = () => {
  const { profile, isStaff, isFinance, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    pendingExpenses: 0,
    fundBalance: 0,
    incomeThisMonth: 0,
    expensesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isStaff) {
        setLoading(false);
        return;
      }

      try {
        // Fetch income records
        const { data: incomeData } = await supabase
          .from('income_records')
          .select('amount, transaction_date');

        // Fetch expense records
        const { data: expenseData } = await supabase
          .from('expense_records')
          .select('amount, status, transaction_date');

        // Fetch fund accounts
        const { data: fundData } = await supabase
          .from('fund_accounts')
          .select('balance');

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalIncome = incomeData?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const totalExpenses = expenseData?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const pendingExpenses = expenseData?.filter(r => r.status === 'pending').reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const fundBalance = fundData?.reduce((sum, f) => sum + Number(f.balance), 0) || 0;

        const incomeThisMonth = incomeData?.filter(r => new Date(r.transaction_date) >= firstDayOfMonth).reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const expensesThisMonth = expenseData?.filter(r => new Date(r.transaction_date) >= firstDayOfMonth).reduce((sum, r) => sum + Number(r.amount), 0) || 0;

        setStats({
          totalIncome,
          totalExpenses,
          pendingExpenses,
          fundBalance,
          incomeThisMonth,
          expensesThisMonth,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }

      setLoading(false);
    };

    fetchStats();
  }, [isStaff]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const quickLinks = [
    { title: 'Record Income', href: '/admin/finance/income', icon: TrendingUp, show: isFinance },
    { title: 'Add Expense', href: '/admin/finance/expenses', icon: TrendingDown, show: isStaff },
    { title: 'View Reports', href: '/admin/finance/reports', icon: FileText, show: isStaff },
    { title: 'Manage Users', href: '/admin/users', icon: Users, show: isAdmin },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">
          Welcome, {profile?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your organization's finances
        </p>
      </div>

      {isStaff && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Income
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? '...' : formatCurrency(stats.totalIncome)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(stats.incomeThisMonth)} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {loading ? '...' : formatCurrency(stats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(stats.expensesThisMonth)} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : formatCurrency(stats.totalIncome - stats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Income minus expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Approval
                </CardTitle>
                <PiggyBank className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {loading ? '...' : formatCurrency(stats.pendingExpenses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expenses awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks
                  .filter((link) => link.show)
                  .map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <link.icon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{link.title}</span>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
