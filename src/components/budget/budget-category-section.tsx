'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BudgetItem, Category, CATEGORIES } from '@/types/budget';
import { TemplateItem } from '@/lib/template-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BudgetItemRow } from './budget-item-row';
import { TemplateItemPicker } from './template-item-picker';
import { formatCurrency } from '@/lib/utils';

interface BudgetCategorySectionProps {
  category: Category;
  items: BudgetItem[];
  templateItems?: TemplateItem[]; // Template items for selection
  onAddItem: (item: { name: string; amount: number; category: Category; notes?: string }) => void;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteItem: (id: string) => void;
  isEditable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function BudgetCategorySection({
  category,
  items,
  templateItems = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isEditable = true,
  isExpanded = true,
  onToggle,
}: BudgetCategorySectionProps) {
  const categoryInfo = CATEGORIES.find(cat => cat.value === category);
  const categoryItems = useMemo(() => 
    items.filter(item => item.category === category),
    [items, category]
  );

  const categoryTotal = useMemo(() =>
    categoryItems.reduce((sum, item) => sum + item.amount, 0),
    [categoryItems]
  );

  if (!categoryInfo) return null;

  return (
    <Card className="animate-fade-in shadow-sm border-2 hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-border bg-gradient-to-r from-background to-muted/20">
        <CardTitle className="flex items-center justify-between">
          <span className={`flex items-center gap-2 ${categoryInfo.color}`}>
            {categoryInfo.label}
            <span className="text-sm font-normal text-muted-foreground">
              ({categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''})
            </span>
          </span>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold">
                {formatCurrency(categoryTotal)}
              </span>
            </div>
            {onToggle && (
              <Button
                onClick={onToggle}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardTitle>
        
        {/* Category Statistics */}
        {categoryItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Average</div>
              <div className="font-semibold text-sm">
                {formatCurrency(categoryTotal / categoryItems.length)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Highest</div>
              <div className="font-semibold text-sm">
                {formatCurrency(Math.max(...categoryItems.map(item => item.amount)))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Lowest</div>
              <div className="font-semibold text-sm">
                {formatCurrency(Math.min(...categoryItems.map(item => item.amount)))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Count</div>
              <div className="font-semibold text-sm text-blue-600">
                {categoryItems.length}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <CardContent className="space-y-0">
        {/* Header Row */}
        <div className="bg-muted border-b border-border">
          <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium text-muted-foreground">
            <div className="col-span-12 md:col-span-3">Name & Notes</div>
            <div className="col-span-6 md:col-span-2">Amount</div>
            <div className="col-span-6 md:col-span-2">Date/Due Date</div>
            <div className="col-span-6 md:col-span-2">Frequency</div>
            <div className="col-span-6 md:col-span-1">Status</div>
            <div className="col-span-12 md:col-span-2 text-right">Actions</div>
          </div>
          <div className="px-3 pb-2 text-xs text-muted-foreground/70">
            {category === 'income' && '� Income sources • No payment tracking'}
            {category === 'bills' && '📄 Bills • 📅 Due dates • � Frequency • ✅ Payment status'}
            {category === 'expenses' && '🛒 Expenses • 📈 Frequency tracking • �📅 Dates'}
            {category === 'savings' && '🏦 Savings goals • ✅ Completion status'}
            {category === 'debt' && '� Debt payments • ✅ Payment status'}
          </div>
        </div>

        {/* Items */}
        <AnimatePresence>
          {categoryItems.map((item) => (
            <BudgetItemRow
              key={item.id}
              item={item}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
              isEditable={isEditable}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {categoryItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20"
          >
            <div className="text-4xl mb-3">
              {category === 'income' ? '💰' : 
               category === 'bills' ? '📄' :
               category === 'expenses' ? '🛒' :
               category === 'savings' ? '🏦' :
               category === 'debt' ? '💳' : '📋'}
            </div>
            <p className="text-muted-foreground font-medium">
              No {categoryInfo.label.toLowerCase()} items yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add your first {category === 'income' ? 'income source' :
                            category === 'bills' ? 'bill' :
                            category === 'expenses' ? 'expense' :
                            category === 'savings' ? 'savings goal' :
                            category === 'debt' ? 'debt payment' : 'item'} to get started
            </p>
          </motion.div>
        )}

        {/* Add Item From Template */}
        {isEditable && (
          <div className="pt-4">
            <TemplateItemPicker
              category={category}
              templateItems={templateItems}
              onSelectItem={(item) => onAddItem(item)}
              onAddCustomItem={onAddItem}
            />
          </div>
        )}
      </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
