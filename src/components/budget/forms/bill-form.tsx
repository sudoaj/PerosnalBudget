'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Calendar, CheckSquare } from 'lucide-react';
import { Category } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillFormProps {
  onAdd: (item: { 
    name: string; 
    amount: number; 
    category: Category; 
    notes?: string;
    dueDate?: string;
    frequency?: 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time';
  }) => void;
}

export function BillForm({ onAdd }: BillFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly' as 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time',
    notes: ''
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
      category: 'bills',
      notes: formData.notes.trim() || undefined,
      dueDate: formData.dueDate || undefined,
      frequency: formData.frequency,
    });

    // Reset form
    setFormData({
      name: '',
      amount: '',
      dueDate: '',
      frequency: 'monthly' as const,
      notes: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      dueDate: '',
      frequency: 'monthly' as const,
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-red-300 rounded-lg p-4 hover:border-red-400 transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-red-600 hover:text-red-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Bill
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-red-300 rounded-lg p-4 bg-red-50 dark:bg-red-950/30"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bill-name" className="block text-sm font-medium text-foreground mb-1">
              Bill Name
            </label>
            <Input
              id="bill-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Electric, Credit Card, Mortgage"
              required
            />
          </div>
          <div>
            <label htmlFor="bill-amount" className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bill-amount"
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
            <label htmlFor="bill-due-date" className="block text-sm font-medium text-foreground mb-1">
              Due Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bill-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="bill-frequency" className="block text-sm font-medium text-foreground mb-1">
              Frequency
            </label>
            <Select value={formData.frequency} onValueChange={(value: 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time') => setFormData({ ...formData, frequency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="bill-notes" className="block text-sm font-medium text-foreground mb-1">
            Notes (Optional)
          </label>
          <Input
            id="bill-notes"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Account number, due day, etc."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            Add Bill
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
