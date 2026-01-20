import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
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

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  category: string | null;
  minimum_stock: number;
  created_at: string;
}

// Mock data for demo
const mockFoodItems: FoodItem[] = [
  { id: '1', name: 'Rice', quantity: 100, unit: 'kg', expiry_date: '2025-06-15', category: 'Grains', minimum_stock: 20, created_at: new Date().toISOString() },
  { id: '2', name: 'Wheat Flour', quantity: 50, unit: 'kg', expiry_date: '2025-03-20', category: 'Grains', minimum_stock: 15, created_at: new Date().toISOString() },
  { id: '3', name: 'Cooking Oil', quantity: 5, unit: 'liters', expiry_date: '2025-08-10', category: 'Oils', minimum_stock: 10, created_at: new Date().toISOString() },
  { id: '4', name: 'Sugar', quantity: 30, unit: 'kg', expiry_date: '2025-12-01', category: 'Essentials', minimum_stock: 10, created_at: new Date().toISOString() },
  { id: '5', name: 'Lentils', quantity: 25, unit: 'kg', expiry_date: '2025-04-05', category: 'Pulses', minimum_stock: 15, created_at: new Date().toISOString() },
];

const FoodInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    expiry_date: '',
    category: '',
    minimum_stock: 10,
  });

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: 'Expired', variant: 'destructive' as const };
    if (days <= 7) return { label: 'Expiring Soon', variant: 'destructive' as const };
    if (days <= 30) return { label: 'Expiring', variant: 'secondary' as const };
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
      setFoodItems(items =>
        items.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      toast.success('Food item updated successfully');
    } else {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setFoodItems(items => [...items, newItem]);
      toast.success('Food item added successfully');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setFoodItems(items => items.filter(item => item.id !== id));
      toast.success('Food item deleted');
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expiry_date: item.expiry_date || '',
      category: item.category || '',
      minimum_stock: item.minimum_stock,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 0,
      unit: 'kg',
      expiry_date: '',
      category: '',
      minimum_stock: 10,
    });
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const lowStockCount = foodItems.filter(item => item.quantity <= item.minimum_stock).length;
  const expiringCount = foodItems.filter(item => {
    if (!item.expiry_date) return false;
    const days = differenceInDays(new Date(item.expiry_date), new Date());
    return days <= 30 && days >= 0;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Food Inventory</h1>
          <p className="text-muted-foreground">Manage food stock and track expiry dates</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Food Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
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
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foodItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foodItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </CardContent>
        </Card>
        <Card className={lowStockCount > 0 ? 'border-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {lowStockCount > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card className={expiringCount > 0 ? 'border-red-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {expiringCount > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{expiringCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category..."
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
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No food items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => {
                  const expiryStatus = getExpiryStatus(item.expiry_date);
                  const stockStatus = getStockStatus(item.quantity, item.minimum_stock);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.expiry_date ? format(new Date(item.expiry_date), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
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

export default FoodInventory;
