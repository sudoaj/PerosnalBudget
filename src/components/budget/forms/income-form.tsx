'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign } from 'lucide-react';
import { Category } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IncomeFormProps {
  onAdd: (item: { name: string; amount: number; category: Category; notes?: string }) => void;
}

export function IncomeForm({ onAdd }: IncomeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '', // e.g., "DVA/C", "GI"
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source.trim() || !formData.amount.trim()) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    onAdd({
      name: formData.source.trim(),
      amount,
      category: 'income',
      notes: formData.notes.trim() || undefined,
    });

    // Reset form
    setFormData({
      source: '',
      amount: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      source: '',
      amount: '',
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-green-300 rounded-lg p-4 hover:border-green-400 transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-green-600 hover:text-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Income Source
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-green-300 rounded-lg p-4 bg-green-50 dark:bg-green-950/30"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="income-source" className="block text-sm font-medium text-foreground mb-1">
              Income Source
            </label>
            <Input
              id="income-source"
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g., DVA/C, Salary, Freelance"
              required
            />
          </div>
          <div>
            <label htmlFor="income-amount" className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="income-amount"
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

        <div>
          <label htmlFor="income-notes" className="block text-sm font-medium text-foreground mb-1">
            Notes (Optional)
          </label>
          <Input
            id="income-notes"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional details"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add Income
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
