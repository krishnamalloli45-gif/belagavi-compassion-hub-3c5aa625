import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, TrendingDown, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface ExpenseRecord {
  id: string;
  amount: number;
  description: string | null;
  vendor: string | null;
  invoice_number: string | null;
  status: string;
  transaction_date: string;
  created_at: string;
  category: { name: string } | null;
}

const ExpenseManagement = () => {
  const { user, isStaff, isFinance } = useAuth();
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchData = async () => {
    const [recordsRes, categoriesRes] = await Promise.all([
      supabase
        .from('expense_records')
        .select('*, category:expense_categories(name)')
        .order('transaction_date', { ascending: false }),
      supabase.from('expense_categories').select('*').order('name'),
    ]);

    if (recordsRes.data) {
      setRecords(recordsRes.data as unknown as ExpenseRecord[]);
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!amount || !categoryId) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('expense_records').insert({
      amount: parseFloat(amount),
      category_id: categoryId,
      vendor: vendor || null,
      description: description || null,
      invoice_number: invoiceNumber || null,
      transaction_date: transactionDate,
      recorded_by: user.id,
      status: 'pending',
    });

    if (error) {
      toast.error('Failed to add expense record');
      console.error(error);
    } else {
      toast.success('Expense recorded successfully');
      setDialogOpen(false);
      resetForm();
      fetchData();
    }

    setSubmitting(false);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    if (!user) return;

    const { error } = await supabase
      .from('expense_records')
      .update({ status, approved_by: user.id })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Expense ${status}`);
      fetchData();
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategoryId('');
    setVendor('');
    setDescription('');
    setInvoiceNumber('');
    setTransactionDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-red-600" />
            Expense Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Record and manage all expense entries
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Expense</DialogTitle>
              <DialogDescription>
                Add a new expense entry for approval
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor / Payee</Label>
                <Input
                  id="vendor"
                  placeholder="e.g., Office Supplies Ltd."
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice">Invoice Number</Label>
                <Input
                  id="invoice"
                  placeholder="e.g., INV-2025-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Submit Expense'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No expense records found. Click "Add Expense" to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {isFinance && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.transaction_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{record.category?.name || '-'}</TableCell>
                      <TableCell>{record.vendor || record.description || '-'}</TableCell>
                      <TableCell>{record.invoice_number || '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {formatCurrency(record.amount)}
                      </TableCell>
                      {isFinance && (
                        <TableCell>
                          {record.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleStatusChange(record.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusChange(record.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseManagement;
