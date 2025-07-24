'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign } from 'lucide-react';
import { Category, CATEGORIES } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddBudgetItemFormProps {
  onAdd: (item: { name: string; amount: number; category: Category; notes?: string }) => void;
}

export function AddBudgetItemForm({ onAdd }: AddBudgetItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '' as Category,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.amount.trim() || !formData.category) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    onAdd({
      name: formData.name.trim(),
      amount,
      category: formData.category,
      notes: formData.notes.trim() || undefined,
    });

    // Reset form
    setFormData({
      name: '',
      amount: '',
      category: '' as Category,
      notes: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      category: '' as Category,
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-border rounded-lg p-4 hover:border-muted-foreground transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Budget Item
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-border rounded-lg p-4 bg-muted/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-foreground mb-1">
              Item Name
            </label>
            <Input
              id="item-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <label htmlFor="item-amount" className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="item-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="pl-10"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-category" className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value: Category) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className={cat.color}>{cat.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="item-notes" className="block text-sm font-medium text-foreground mb-1">
              Notes (Optional)
            </label>
            <Input
              id="item-notes"
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Item
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
