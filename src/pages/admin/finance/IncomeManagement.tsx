import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface IncomeRecord {
  id: string;
  amount: number;
  description: string | null;
  source: string | null;
  receipt_number: string | null;
  transaction_date: string;
  created_at: string;
  category: { name: string } | null;
}

const IncomeManagement = () => {
  const { user, isFinance } = useAuth();
  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchData = async () => {
    const [recordsRes, categoriesRes] = await Promise.all([
      supabase
        .from('income_records')
        .select('*, category:income_categories(name)')
        .order('transaction_date', { ascending: false }),
      supabase.from('income_categories').select('*').order('name'),
    ]);

    if (recordsRes.data) {
      setRecords(recordsRes.data as unknown as IncomeRecord[]);
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

    const { error } = await supabase.from('income_records').insert({
      amount: parseFloat(amount),
      category_id: categoryId,
      source: source || null,
      description: description || null,
      receipt_number: receiptNumber || null,
      transaction_date: transactionDate,
      recorded_by: user.id,
    });

    if (error) {
      toast.error('Failed to add income record');
      console.error(error);
    } else {
      toast.success('Income recorded successfully');
      setDialogOpen(false);
      resetForm();
      fetchData();
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setAmount('');
    setCategoryId('');
    setSource('');
    setDescription('');
    setReceiptNumber('');
    setTransactionDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isFinance) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You need Finance or Admin role to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Income Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Record and manage all income entries
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Income</DialogTitle>
              <DialogDescription>
                Add a new income entry to the system
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
                    placeholder="10000"
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
                <Label htmlFor="source">Source / Donor</Label>
                <Input
                  id="source"
                  placeholder="e.g., John Doe, ABC Corporation"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt Number</Label>
                <Input
                  id="receipt"
                  placeholder="e.g., RCP-2025-001"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
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
                    'Save Income'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No income records found. Click "Add Income" to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Receipt #</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.transaction_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{record.category?.name || '-'}</TableCell>
                      <TableCell>{record.source || record.description || '-'}</TableCell>
                      <TableCell>{record.receipt_number || '-'}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(record.amount)}
                      </TableCell>
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

export default IncomeManagement;
