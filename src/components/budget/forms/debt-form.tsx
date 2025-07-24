'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, CreditCard, TrendingDown } from 'lucide-react';
import { Category } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DebtFormProps {
  onAdd: (item: { 
    name: string; 
    amount: number; 
    category: Category; 
    notes?: string;
    balance?: number;
    paid?: number;
    remaining?: number;
  }) => void;
}

export function DebtForm({ onAdd }: DebtFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // e.g., "PayPal Out", "Algos Card", "Elec day", "Sky UK Tax"
    balance: '', // Total balance
    paid: '', // Amount paid this period
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.balance.trim()) {
      return;
    }

    const balance = parseFloat(formData.balance);
    const paid = formData.paid ? parseFloat(formData.paid) : 0;
    
    if (isNaN(balance) || balance < 0) {
      return;
    }
    
    if (isNaN(paid) || paid < 0) {
      return;
    }

    const remaining = balance - paid;

    onAdd({
      name: formData.name.trim(),
      amount: paid, // The payment amount for this period
      category: 'debt',
      notes: formData.notes.trim() || undefined,
    });

    // Reset form
    setFormData({
      name: '',
      balance: '',
      paid: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      balance: '',
      paid: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const balance = parseFloat(formData.balance) || 0;
  const paid = parseFloat(formData.paid) || 0;
  const remaining = balance - paid;

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-purple-300 rounded-lg p-4 hover:border-purple-400 transition-colors"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-auto p-4 text-purple-600 hover:text-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Debt Payment
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border border-purple-300 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/30"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="debt-name" className="block text-sm font-medium text-foreground mb-1">
              Debt Name
            </label>
            <Input
              id="debt-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Credit Card, Loan, PayPal"
              required
            />
          </div>
          <div>
            <label htmlFor="debt-balance" className="block text-sm font-medium text-foreground mb-1">
              Total Balance
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="debt-balance"
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
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
            <label htmlFor="debt-paid" className="block text-sm font-medium text-foreground mb-1">
              Payment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="debt-paid"
                type="number"
                value={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: e.target.value })}
                placeholder="0.00"
                className="pl-10"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Remaining Balance
            </label>
            <div className="relative">
              <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div className="pl-10 py-2 text-sm text-muted-foreground">
                ${remaining.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="debt-notes" className="block text-sm font-medium text-foreground mb-1">
            Notes (Optional)
          </label>
          <Input
            id="debt-notes"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Account details, interest rate, etc."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Add Debt Payment
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
