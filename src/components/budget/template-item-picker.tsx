'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { BudgetItem, Category } from '@/types/budget';
import { TemplateItem } from '@/lib/template-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface TemplateItemPickerProps {
  category: Category;
  templateItems: TemplateItem[];
  onSelectItem: (item: { name: string; amount: number; category: Category; notes?: string; dueDate?: string; frequency?: string; expenseFrequency?: string }) => void;
  onAddCustomItem: (item: { name: string; amount: number; category: Category; notes?: string }) => void;
}

export function TemplateItemPicker({ 
  category, 
  templateItems, 
  onSelectItem, 
  onAddCustomItem 
}: TemplateItemPickerProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customItem, setCustomItem] = useState({
    name: '',
    amount: '',
    notes: '',
  });

  const categoryTemplateItems = templateItems.filter(item => item.category === category);

  const handleSelectTemplate = (templateItem: TemplateItem) => {
    onSelectItem({
      name: templateItem.name,
      amount: templateItem.amount,
      category: templateItem.category,
      notes: templateItem.notes,
      dueDate: templateItem.dueDate,
      frequency: templateItem.frequency,
      expenseFrequency: templateItem.expenseFrequency,
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customItem.name.trim() || !customItem.amount.trim()) {
      return;
    }

    const amount = parseFloat(customItem.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    onAddCustomItem({
      name: customItem.name.trim(),
      amount,
      category,
      notes: customItem.notes.trim() || undefined,
    });

    // Reset form
    setCustomItem({ name: '', amount: '', notes: '' });
    setShowCustomForm(false);
  };

  const handleCancelCustom = () => {
    setCustomItem({ name: '', amount: '', notes: '' });
    setShowCustomForm(false);
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Add {category} Item
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Template Items */}
        {categoryTemplateItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              From Template
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {categoryTemplateItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelectTemplate(item)}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    {item.notes && (
                      <div className="text-xs text-muted-foreground mt-1">{item.notes}</div>
                    )}
                    {item.dueDate && (
                      <div className="text-xs text-blue-600">Due: {item.dueDate}</div>
                    )}
                    {item.frequency && (
                      <div className="text-xs text-green-600">Frequency: {item.frequency}</div>
                    )}
                    {item.expenseFrequency && (
                      <div className="text-xs text-orange-600">Frequency: {item.expenseFrequency}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{formatCurrency(item.amount)}</span>
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Item Form */}
        {showCustomForm ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCustomSubmit}
            className="space-y-3 p-3 bg-muted/20 rounded-lg border"
          >
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Custom Item
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Item name"
                value={customItem.name}
                onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={customItem.amount}
                onChange={(e) => setCustomItem({ ...customItem, amount: e.target.value })}
                className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={customItem.notes}
              onChange={(e) => setCustomItem({ ...customItem, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1">
                <Check className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button type="button" onClick={handleCancelCustom} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>
        ) : (
          <Button
            onClick={() => setShowCustomForm(true)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom {category.slice(0, -1)} Item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
