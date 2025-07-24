'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Target } from 'lucide-react';
import { Category } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SavingsFormProps {
  onAdd: (item: { 
    name: string; 
    amount: number; 
    category: Category; 
    notes?: string;
    target?: number;
  }) => void;
}

export function SavingsForm({ onAdd }: SavingsFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // e.g., "payroll account", "stocks karma", "stocks savings"
    amount: '',
    target: '',
    notes: '',
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

    const target = formData.target ? parseFloat(formData.target) : undefined;
    if (target !== undefined && (isNaN(target) || target < 0)) {
      return;
    }

    onAdd({
      name: formData.name.trim(),
      amount,
      category: 'savings',
      notes: formData.notes.trim() || undefined,
    });

    // Reset form
    setFormData({
      name: '',
      amount: '',
      target: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      target: '',
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-blue-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Savings Goal
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-blue-300 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="savings-name" className="block text-sm font-medium text-foreground mb-1">
              Savings Account
            </label>
            <Input
              id="savings-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund, Vacation Fund"
              required
            />
          </div>
          <div>
            <label htmlFor="savings-amount" className="block text-sm font-medium text-foreground mb-1">
              Amount to Save
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="savings-amount"
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
            <label htmlFor="savings-target" className="block text-sm font-medium text-foreground mb-1">
              Target Amount (Optional)
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="savings-target"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="0.00"
                className="pl-10"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="savings-notes" className="block text-sm font-medium text-foreground mb-1">
              Notes (Optional)
            </label>
            <Input
              id="savings-notes"
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Purpose, timeline, etc."
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Add Savings
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
