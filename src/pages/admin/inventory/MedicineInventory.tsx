import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Pill } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface MedicineItem {
  id: string;
  name: string;
  batch_number: string | null;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  manufacturer: string | null;
  minimum_stock: number;
  created_at: string;
}

const mockMedicineItems: MedicineItem[] = [
  { id: '1', name: 'Paracetamol 500mg', batch_number: 'BT2024001', quantity: 500, unit: 'tablets', expiry_date: '2025-12-15', manufacturer: 'Sun Pharma', minimum_stock: 100, created_at: new Date().toISOString() },
  { id: '2', name: 'Amoxicillin 250mg', batch_number: 'BT2024002', quantity: 200, unit: 'capsules', expiry_date: '2025-06-20', manufacturer: 'Cipla', minimum_stock: 50, created_at: new Date().toISOString() },
  { id: '3', name: 'ORS Packets', batch_number: 'BT2024003', quantity: 80, unit: 'packets', expiry_date: '2025-03-10', manufacturer: 'Electral', minimum_stock: 100, created_at: new Date().toISOString() },
  { id: '4', name: 'Bandages', batch_number: 'BT2024004', quantity: 150, unit: 'rolls', expiry_date: '2026-01-01', manufacturer: 'Johnson & Johnson', minimum_stock: 30, created_at: new Date().toISOString() },
  { id: '5', name: 'Antiseptic Liquid', batch_number: 'BT2024005', quantity: 20, unit: 'bottles', expiry_date: '2025-08-05', manufacturer: 'Dettol', minimum_stock: 25, created_at: new Date().toISOString() },
];

const MedicineInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicineItem | null>(null);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>(mockMedicineItems);
  
  const [formData, setFormData] = useState({
    name: '',
    batch_number: '',
    quantity: 0,
    unit: 'tablets',
    expiry_date: '',
    manufacturer: '',
    minimum_stock: 50,
  });

  const filteredItems = medicineItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: 'Expired', variant: 'destructive' as const };
    if (days <= 30) return { label: 'Expiring Soon', variant: 'destructive' as const };
    if (days <= 90) return { label: 'Expiring', variant: 'secondary' as const };
    return null;
  };

  const getStockStatus = (quantity: number, minimum: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= minimum) return { label: 'Low Stock', variant: 'secondary' as const };
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setMedicineItems(items =>
        items.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      toast.success('Medicine updated successfully');
    } else {
      const newItem: MedicineItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setMedicineItems(items => [...items, newItem]);
      toast.success('Medicine added successfully');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicineItems(items => items.filter(item => item.id !== id));
      toast.success('Medicine deleted');
    }
  };

  const handleEdit = (item: MedicineItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      batch_number: item.batch_number || '',
      quantity: item.quantity,
      unit: item.unit,
      expiry_date: item.expiry_date || '',
      manufacturer: item.manufacturer || '',
      minimum_stock: item.minimum_stock,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      batch_number: '',
      quantity: 0,
      unit: 'tablets',
      expiry_date: '',
      manufacturer: '',
      minimum_stock: 50,
    });
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const lowStockCount = medicineItems.filter(item => item.quantity <= item.minimum_stock).length;
  const expiringCount = medicineItems.filter(item => {
    if (!item.expiry_date) return false;
    const days = differenceInDays(new Date(item.expiry_date), new Date());
    return days <= 90 && days >= 0;
  }).length;
  const expiredCount = medicineItems.filter(item => {
    if (!item.expiry_date) return false;
    return differenceInDays(new Date(item.expiry_date), new Date()) < 0;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Pill className="h-8 w-8" />
            Medicine Inventory
          </h1>
          <p className="text-muted-foreground">Manage medicines, track batches and expiry dates</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    value={formData.batch_number}
                    onChange={e => setFormData({ ...formData, batch_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stock">Min Stock Alert</Label>
                  <Input
                    id="minimum_stock"
                    type="number"
                    value={formData.minimum_stock}
                    onChange={e => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Add'} Medicine
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicineItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicineItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </CardContent>
        </Card>
        <Card className={lowStockCount > 0 ? 'border-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {lowStockCount > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card className={expiringCount > 0 ? 'border-yellow-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {expiringCount > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              Expiring (90 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
          </CardContent>
        </Card>
        <Card className={expiredCount > 0 ? 'border-red-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {expiredCount > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, batch or manufacturer..."
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
                <TableHead>Medicine Name</TableHead>
                <TableHead>Batch No.</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No medicines found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => {
                  const expiryStatus = getExpiryStatus(item.expiry_date);
                  const stockStatus = getStockStatus(item.quantity, item.minimum_stock);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.batch_number || '-'}</TableCell>
                      <TableCell>{item.manufacturer || '-'}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.expiry_date ? format(new Date(item.expiry_date), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {stockStatus && (
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          )}
                          {expiryStatus && (
                            <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineInventory;
