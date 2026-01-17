import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PiggyBank, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FundAccount {
  id: string;
  name: string;
  description: string | null;
  balance: number;
  created_at: string;
  updated_at: string;
}

const FundAccounts = () => {
  const { isFinance } = useAuth();
  const [accounts, setAccounts] = useState<FundAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setBalance] = useState('0');

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('fund_accounts')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Failed to load fund accounts');
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a fund name');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('fund_accounts').insert({
      name: name.trim(),
      description: description.trim() || null,
      balance: parseFloat(balance) || 0,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('A fund with this name already exists');
      } else {
        toast.error('Failed to create fund account');
      }
    } else {
      toast.success('Fund account created');
      setDialogOpen(false);
      resetForm();
      fetchAccounts();
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setBalance('0');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

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
            <PiggyBank className="h-8 w-8 text-primary" />
            Fund Accounts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage organizational fund accounts
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Fund
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Fund Account</DialogTitle>
              <DialogDescription>
                Add a new fund account for tracking
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fund Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Education Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Purpose of this fund..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Opening Balance (₹)</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
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
                      Creating...
                    </>
                  ) : (
                    'Create Fund'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-primary-foreground/80 text-sm">Total Fund Balance</p>
            <p className="text-4xl font-bold mt-1">
              {loading ? '...' : formatCurrency(totalBalance)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fund Cards */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No fund accounts found. Click "New Fund" to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(account.balance))}
                </p>
                {account.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {account.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundAccounts;
