'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Eye, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { BudgetPeriod } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PeriodManagerProps {
  periods: BudgetPeriod[];
  currentPeriodId: string | null;
  onCreatePeriod: (name: string, startDate: string, endDate: string) => void;
  onUpdatePeriod: (id: string, name: string, startDate: string, endDate: string) => void;
  onDeletePeriod: (id: string) => void;
  onSelectPeriod: (id: string) => void;
  calculateSummary: (items: any[]) => any;
}

export function PeriodManager({
  periods,
  currentPeriodId,
  onCreatePeriod,
  onUpdatePeriod,
  onDeletePeriod,
  onSelectPeriod,
  calculateSummary,
}: PeriodManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      return;
    }

    onCreatePeriod(formData.name.trim(), formData.startDate, formData.endDate);
    
    // Reset form
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
    setShowCreateForm(false);
  };

  const handleEditPeriod = (period: BudgetPeriod) => {
    setEditingPeriodId(period.id);
    setEditFormData({
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
    });
  };

  const handleSaveEdit = () => {
    if (!editingPeriodId || !editFormData.name.trim() || !editFormData.startDate || !editFormData.endDate) {
      return;
    }

    onUpdatePeriod(editingPeriodId, editFormData.name.trim(), editFormData.startDate, editFormData.endDate);
    setEditingPeriodId(null);
    setEditFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleCancelEdit = () => {
    setEditingPeriodId(null);
    setEditFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
  };

  // Generate suggested period name based on dates
  const generatePeriodName = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return '';
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-generate name if it's empty or was auto-generated
    if (!formData.name || formData.name === generatePeriodName()) {
      if (newFormData.startDate && newFormData.endDate) {
        const start = new Date(newFormData.startDate);
        const end = new Date(newFormData.endDate);
        newFormData.name = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      }
    }
    
    setFormData(newFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Budget Periods
          </span>
          <Button onClick={() => setShowCreateForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Period
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Period Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-border rounded-lg p-4 bg-muted/50"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="period-name" className="block text-sm font-medium text-foreground mb-1">
                    Period Name
                  </label>
                  <Input
                    id="period-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Jan 1 - Jan 15, 2024"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-foreground mb-1">
                      Start Date
                    </label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-foreground mb-1">
                      End Date
                    </label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      min={formData.startDate}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Period
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Period Selector */}
        {periods.length > 0 && (
          <div>
            <label htmlFor="current-period" className="block text-sm font-medium text-foreground mb-2">
              Current Period
            </label>
            <Select value={currentPeriodId || ''} onValueChange={onSelectPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select a budget period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Periods List */}
        {periods.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">All Periods</h4>
            <AnimatePresence>
              {periods
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((period) => {
                  const summary = calculateSummary(period.items);
                  const isActive = period.id === currentPeriodId;
                  
                  return (
                    <motion.div
                      key={period.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`border rounded-lg p-3 ${
                        isActive 
                          ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950' 
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      {editingPeriodId === period.id ? (
                        // Edit form
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Period Name
                            </label>
                            <Input
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              placeholder="Enter period name"
                              className="text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Start Date
                              </label>
                              <Input
                                type="date"
                                value={editFormData.startDate}
                                onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                End Date
                              </label>
                              <Input
                                type="date"
                                value={editFormData.endDate}
                                onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Normal display
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium text-foreground">{period.name}</h5>
                              {isActive && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatDate(period.startDate)} to {formatDate(period.endDate)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {period.items.length} items • Net: {' '}
                              <span className={summary.isNegative ? 'text-red-600' : 'text-green-600'}>
                                {formatCurrency(summary.net)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!isActive && (
                              <Button
                                onClick={() => onSelectPeriod(period.id)}
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEditPeriod(period)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => onDeletePeriod(period.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p>No budget periods created yet</p>
            <p className="text-sm">Create your first period to start budgeting!</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
