'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { BudgetTemplate, CATEGORIES } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetCategorySection } from './budget-category-section';
import { TemplateUpload } from './template-upload';

interface TemplateManagerProps {
  template: BudgetTemplate;
  onUpdateTemplate: (template: BudgetTemplate) => void;
  onAddTemplateItem: (item: { name: string; amount: number; category: any; notes?: string }) => void;
  onUpdateTemplateItem: (id: string, updates: any) => void;
  onDeleteTemplateItem: (id: string) => void;
  calculateSummary: (items: any[]) => any;
}

export function TemplateManager({
  template,
  onUpdateTemplate,
  onAddTemplateItem,
  onUpdateTemplateItem,
  onDeleteTemplateItem,
  calculateSummary,
}: TemplateManagerProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);

  const handleSaveName = () => {
    if (templateName.trim() && templateName !== template.name) {
      onUpdateTemplate({
        ...template,
        name: templateName.trim(),
      });
    }
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTemplateName(template.name);
    setIsEditingName(false);
  };

  const handleTemplateUpload = (items: Array<{ name: string; amount: number; category: any; notes?: string; [key: string]: any }>) => {
    // Add each item from the template
    items.forEach(item => {
      onAddTemplateItem({
        name: item.name,
        amount: item.amount,
        category: item.category,
        notes: item.notes
      });
    });
  };

  const summary = calculateSummary(template.items);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="h-8 w-64"
                    placeholder="Template name"
                  />
                  <Button onClick={handleSaveName} size="sm" variant="outline">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancelName} size="sm" variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setIsEditingName(true)}
                >
                  {template.name}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Template Total</div>
              <div className={`text-lg font-bold ${summary.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                Net: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.net)}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            This template will be used to create new budget periods. 
            Add your recurring income and expenses here.
          </div>
        </CardContent>
      </Card>

      {/* Template Upload */}
      <div className="space-y-6">
      <TemplateUpload  onTemplateUpload={handleTemplateUpload} />
        </div>

      {/* Category Sections */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => (
          <motion.div
            key={category.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CATEGORIES.indexOf(category) * 0.1 }}
          >
            <BudgetCategorySection
              category={category.value}
              items={template.items}
              onAddItem={onAddTemplateItem}
              onUpdateItem={onUpdateTemplateItem}
              onDeleteItem={onDeleteTemplateItem}
              isEditable={true}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
