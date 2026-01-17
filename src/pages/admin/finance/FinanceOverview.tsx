import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface IncomeRecord {
  id: string;
  amount: number;
  description: string | null;
  source: string | null;
  transaction_date: string;
  category: { name: string } | null;
}

interface ExpenseRecord {
  id: string;
  amount: number;
  description: string | null;
  vendor: string | null;
  status: string;
  transaction_date: string;
  category: { name: string } | null;
}

const FinanceOverview = () => {
  const { isStaff } = useAuth();
  const [recentIncome, setRecentIncome] = useState<IncomeRecord[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isStaff) return;

      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from('income_records')
          .select('id, amount, description, source, transaction_date, category:income_categories(name)')
          .order('transaction_date', { ascending: false })
          .limit(5),
        supabase
          .from('expense_records')
          .select('id, amount, description, vendor, status, transaction_date, category:expense_categories(name)')
          .order('transaction_date', { ascending: false })
          .limit(5),
      ]);

      if (incomeRes.data) {
        setRecentIncome(incomeRes.data as unknown as IncomeRecord[]);
      }
      if (expenseRes.data) {
        setRecentExpenses(expenseRes.data as unknown as ExpenseRecord[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [isStaff]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isStaff) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You need a role assignment to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Finance Overview</h1>
        <p className="text-muted-foreground mt-1">
          Recent financial activity and quick access to finance modules
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Recent Income
              </CardTitle>
              <CardDescription>Latest income entries</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/finance/income">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : recentIncome.length === 0 ? (
              <p className="text-muted-foreground">No income records yet.</p>
            ) : (
              <div className="space-y-3">
                {recentIncome.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {record.source || record.description || 'Income'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.category?.name} • {format(new Date(record.transaction_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(record.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Recent Expenses
              </CardTitle>
              <CardDescription>Latest expense entries</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/finance/expenses">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : recentExpenses.length === 0 ? (
              <p className="text-muted-foreground">No expense records yet.</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {record.vendor || record.description || 'Expense'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.category?.name} • {format(new Date(record.transaction_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(record.amount)}
                      </span>
                      <span
                        className={`block text-xs capitalize ${
                          record.status === 'approved'
                            ? 'text-green-600'
                            : record.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-accent'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceOverview;
