'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Check, X, DollarSign } from 'lucide-react';
import { BudgetItem, Category, CATEGORIES } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface BudgetItemRowProps {
  item: BudgetItem;
  onUpdate: (updates: Partial<BudgetItem>) => void;
  onDelete: () => void;
  isEditable?: boolean;
}

export function BudgetItemRow({
  item,
  onUpdate,
  onDelete,
  isEditable = true,
}: BudgetItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: item.name,
    amount: item.amount.toString(),
    category: item.category,
    notes: item.notes || '',
    dueDate: item.dueDate || '',
    frequency: item.frequency || '',
    expenseFrequency: item.expenseFrequency || '',
  });

  const handleSave = () => {
    const amount = parseFloat(editValues.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    onUpdate({
      name: editValues.name,
      amount,
      category: editValues.category,
      notes: editValues.notes || undefined,
      dueDate: editValues.dueDate || undefined,
      frequency: (editValues.frequency || undefined) as 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time' | undefined,
      expenseFrequency: (editValues.expenseFrequency || undefined) as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time' | undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      name: item.name,
      amount: item.amount.toString(),
      category: item.category,
      notes: item.notes || '',
      dueDate: item.dueDate || '',
      frequency: item.frequency || '',
      expenseFrequency: item.expenseFrequency || '',
    });
    setIsEditing(false);
  };

  const categoryInfo = CATEGORIES.find(cat => cat.value === item.category);

  if (isEditing && isEditable) {
    return (
      <motion.div
        initial={{ backgroundColor: 'hsl(var(--muted))' }}
        animate={{ backgroundColor: 'hsl(var(--background))' }}
        exit={{ opacity: 0, height: 0 }}
        className="border-b border-border bg-muted/50"
      >
        {/* Edit Form Header */}
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Editing: {item.name}
          </span>
        </div>
        
        {/* Edit Form Fields */}
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Item Name
              </label>
              <Input
                value={editValues.name}
                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                placeholder="Enter item name"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={editValues.amount}
                  onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                  placeholder="0.00"
                  className="h-8 pl-8"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Category
              </label>
              <Select value={editValues.category} onValueChange={(value: Category) => setEditValues({ ...editValues, category: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
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
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Notes (Optional)
              </label>
              <Input
                value={editValues.notes}
                onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                placeholder="Add any additional notes"
                className="h-8"
              />
            </div>
          </div>
          
          {/* Category-specific fields */}
          {editValues.category === 'bills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Due Date (MM/DD)
                </label>
                <Input
                  value={editValues.dueDate}
                  onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
                  placeholder="07/21"
                  className="h-8"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Frequency
                </label>
                <Select value={editValues.frequency} onValueChange={(value) => setEditValues({ ...editValues, frequency: value })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {editValues.category === 'expenses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Expense Frequency
                </label>
                <Select value={editValues.expenseFrequency} onValueChange={(value) => setEditValues({ ...editValues, expenseFrequency: value })}>
                  <SelectTrigger className="h-8">
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
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button onClick={handleCancel} size="sm" variant="outline" className="h-8">
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="h-8">
              <Check className="h-3 w-3 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
      className="border-b border-border"
    >
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-2 p-3 items-center">
        <div className="col-span-12 md:col-span-3">
          <div className="font-medium text-foreground">{item.name}</div>
          {item.notes && (
            <div className="text-sm text-muted-foreground mt-1 italic">
              &ldquo;{item.notes}&rdquo;
            </div>
          )}
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="font-mono text-sm font-semibold">{formatCurrency(item.amount)}</div>
        </div>
        <div className="col-span-6 md:col-span-2">
          {/* Date/Due Date Column */}
          {item.dueDate ? (
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">
              📅 {item.dueDate}
            </span>
          ) : item.date ? (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              📅 {item.date}
            </span>
          ) : (
            <span className="text-muted-foreground/60 text-xs">No date</span>
          )}
        </div>
        <div className="col-span-6 md:col-span-2">
          {/* Frequency Column */}
          {item.frequency ? (
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">
              🔄 {item.frequency}
            </span>
          ) : item.expenseFrequency ? (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              📈 {item.expenseFrequency}
            </span>
          ) : (
            <span className="text-muted-foreground/60 text-xs">No frequency</span>
          )}
        </div>
        <div className="col-span-6 md:col-span-1">
          {/* Status Column */}
          {item.paid !== undefined ? (
            <span className={`px-2 py-1 rounded text-xs ${
              item.paid 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
            }`}>
              {item.paid ? '✅ Paid' : '⏳ Pending'}
            </span>
          ) : (
            <span className="text-muted-foreground/60 text-xs">N/A</span>
          )}
        </div>
        <div className="col-span-12 md:col-span-2 flex gap-1 justify-end">
          {isEditable && (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                onClick={onDelete}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Details Row - Simplified to show only ID */}
      <div className="px-3 pb-3 grid grid-cols-12 gap-2 text-xs text-muted-foreground bg-muted/20">
        <div className="col-span-12 md:col-span-6">
          <span className="font-mono bg-muted px-2 py-1 rounded">
            ID: {item.id.slice(0, 8)}...
          </span>
        </div>
        <div className="col-span-12 md:col-span-6 text-right">
          <span className="text-muted-foreground/60">
            {item.notes && (
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                📝 {item.notes.length > 50 ? `${item.notes.slice(0, 50)}...` : item.notes}
              </span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
