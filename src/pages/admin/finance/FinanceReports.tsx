import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface CategorySummary {
  category: string;
  total: number;
}

interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  approvedExpenses: number;
  pendingExpenses: number;
  incomeByCategory: CategorySummary[];
  expensesByCategory: CategorySummary[];
}

const FinanceReports = () => {
  const { isStaff } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  // Filter state
  const [period, setPeriod] = useState('this-month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    const now = new Date();
    
    switch (value) {
      case 'this-month':
        setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
        break;
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        setStartDate(format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
        break;
      case 'last-3-months':
        setStartDate(format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
        break;
      case 'this-year':
        setStartDate(format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd'));
        setEndDate(format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd'));
        break;
    }
  };

  const generateReport = async () => {
    setLoading(true);

    try {
      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from('income_records')
          .select('amount, category:income_categories(name)')
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate),
        supabase
          .from('expense_records')
          .select('amount, status, category:expense_categories(name)')
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate),
      ]);

      const incomeData = incomeRes.data || [];
      const expenseData = expenseRes.data || [];

      // Calculate totals
      const totalIncome = incomeData.reduce((sum, r) => sum + Number(r.amount), 0);
      const totalExpenses = expenseData.reduce((sum, r) => sum + Number(r.amount), 0);
      const approvedExpenses = expenseData
        .filter((r) => r.status === 'approved')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      const pendingExpenses = expenseData
        .filter((r) => r.status === 'pending')
        .reduce((sum, r) => sum + Number(r.amount), 0);

      // Group by category
      const incomeByCategory: Record<string, number> = {};
      incomeData.forEach((r) => {
        const catName = (r.category as any)?.name || 'Uncategorized';
        incomeByCategory[catName] = (incomeByCategory[catName] || 0) + Number(r.amount);
      });

      const expensesByCategory: Record<string, number> = {};
      expenseData.forEach((r) => {
        const catName = (r.category as any)?.name || 'Uncategorized';
        expensesByCategory[catName] = (expensesByCategory[catName] || 0) + Number(r.amount);
      });

      setReportData({
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        approvedExpenses,
        pendingExpenses,
        incomeByCategory: Object.entries(incomeByCategory)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total),
        expensesByCategory: Object.entries(expensesByCategory)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total),
      });
    } catch (error) {
      console.error('Error generating report:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isStaff) {
      generateReport();
    }
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
        <p className="text-muted-foreground">
          You need a staff role to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Financial Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and view financial summaries
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
          <CardDescription>Select the date range for your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>Quick Select</Label>
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPeriod('custom');
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPeriod('custom');
                }}
              />
            </div>

            <Button onClick={generateReport} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Total Income
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(reportData.totalIncome)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Total Expenses
                </div>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(reportData.totalExpenses)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Net Balance</div>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    reportData.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(reportData.netBalance)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Pending Approval</div>
                <p className="text-2xl font-bold text-accent mt-1">
                  {formatCurrency(reportData.pendingExpenses)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Income by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.incomeByCategory.length === 0 ? (
                  <p className="text-muted-foreground">No income in this period</p>
                ) : (
                  <div className="space-y-3">
                    {reportData.incomeByCategory.map((item) => (
                      <div key={item.category} className="flex justify-between items-center">
                        <span className="text-sm">{item.category}</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.expensesByCategory.length === 0 ? (
                  <p className="text-muted-foreground">No expenses in this period</p>
                ) : (
                  <div className="space-y-3">
                    {reportData.expensesByCategory.map((item) => (
                      <div key={item.category} className="flex justify-between items-center">
                        <span className="text-sm">{item.category}</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceReports;
