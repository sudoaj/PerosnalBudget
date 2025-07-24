'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign } from 'lucide-react';
import { Category } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseFormProps {
  onAdd: (item: { name: string; amount: number; category: Category; notes?: string; expenseFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time' }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // e.g., "Pocket Money", "Afterpay/oven+3", "Groceries", "Dining"
    amount: '',
    notes: '',
    expenseFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.amount.trim()) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    onAdd({
      name: formData.name.trim(),
      amount,
      category: 'expenses',
      notes: formData.notes.trim() || undefined,
      expenseFrequency: formData.expenseFrequency,
    });

    // Reset form
    setFormData({
      name: '',
      amount: '',
      notes: '',
      expenseFrequency: 'monthly',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      notes: '',
      expenseFrequency: 'monthly',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-orange-300 rounded-lg p-4 hover:border-orange-400 transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-orange-600 hover:text-orange-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-orange-300 rounded-lg p-4 bg-orange-50 dark:bg-orange-950/30"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="expense-name" className="block text-sm font-medium text-foreground mb-1">
              Expense Name
            </label>
            <Input
              id="expense-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Groceries, Dining Out, Gas"
              required
            />
          </div>
          <div>
            <label htmlFor="expense-amount" className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="expense-amount"
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
          <div>
            <label htmlFor="expense-frequency" className="block text-sm font-medium text-foreground mb-1">
              Frequency
            </label>
            <Select value={formData.expenseFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time') => setFormData({ ...formData, expenseFrequency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="expense-notes" className="block text-sm font-medium text-foreground mb-1">
            Notes (Optional)
          </label>
          <Input
            id="expense-notes"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Store, category, payment method, etc."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
            Add Expense
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
