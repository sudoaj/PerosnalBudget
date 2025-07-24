'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Settings, Calendar, BarChart3, Menu, X, PiggyBank } from 'lucide-react';
import { useBudgetStore } from '@/store/budget';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dashboard } from '@/components/budget/dashboard';
import { BudgetSummaryCard } from '@/components/budget/budget-summary';
import { BudgetCategorySection } from '@/components/budget/budget-category-section';
import { PeriodManager } from '@/components/budget/period-manager';
import { TemplateManager } from '@/components/budget/template-manager';
import { DataManagement } from '@/components/budget/data-management';
import { CATEGORIES } from '@/types/budget';
import { exportToCSV } from '@/lib/utils';
import { EXAMPLE_TEMPLATE } from '@/lib/template-data';

type View = 'dashboard' | 'budget' | 'template' | 'periods' | 'data';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    income: true,
    bills: true,
    expenses: true,
    savings: true,
    debt: true,
  });
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const {
    template,
    periods,
    currentPeriodId,
    updateTemplate,
    addTemplateItem,
    updateTemplateItem,
    deleteTemplateItem,
    createPeriod,
    updatePeriod,
    deletePeriod,
    setCurrentPeriod,
    addPeriodItem,
    updatePeriodItem,
    deletePeriodItem,
    toggleItemPaid,
    calculateSummary,
    getCurrentPeriod,
    exportData,
    importData,
    clearAll,
  } = useBudgetStore();

  const currentPeriod = getCurrentPeriod();
  const summary = currentPeriod 
    ? calculateSummary(currentPeriod.items) 
    : calculateSummary([]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'template', label: 'Template', icon: Settings },
    { id: 'periods', label: 'Periods', icon: Calendar },
    { id: 'data', label: 'Data', icon: Calculator },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-foreground">Budget App</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-t border-border"
            >
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <Dashboard 
              periods={periods}
              calculateSummary={calculateSummary}
            />
          )}

          {currentView === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Budget Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Budget Manager</h2>
                  <p className="text-muted-foreground">
                    {currentPeriod 
                      ? `Managing: ${currentPeriod.name}` 
                      : 'No active period selected'}
                  </p>
                </div>
                {periods.length === 0 && (
                  <Button onClick={() => setCurrentView('periods')}>
                    Create First Period
                  </Button>
                )}
              </div>

              {currentPeriod ? (
                <>
                  {/* Summary Card */}
                  <BudgetSummaryCard summary={summary} period={currentPeriod} />

                  {/* Category Sections */}
                  <div className="grid gap-6">
                    {CATEGORIES.map((category) => (
                      <motion.div
                        key={category.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: CATEGORIES.indexOf(category) * 0.1 }}
                      >
                        <BudgetCategorySection
                          category={category.value}
                          items={currentPeriod.items}
                          templateItems={EXAMPLE_TEMPLATE.items}
                          onAddItem={(item) => addPeriodItem(currentPeriod.id, item)}
                          onUpdateItem={(id, updates) => updatePeriodItem(currentPeriod.id, id, updates)}
                          onDeleteItem={(id) => deletePeriodItem(currentPeriod.id, id)}
                          isEditable={true}
                          isExpanded={expandedCategories[category.value]}
                          onToggle={() => toggleCategory(category.value)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Budget Period Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Create or select a budget period to start tracking your finances.
                  </p>
                  <Button onClick={() => setCurrentView('periods')}>
                    Manage Periods
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {currentView === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Budget Template</h2>
                <p className="text-muted-foreground">
                  Set up your default budget items that will be used when creating new periods.
                </p>
              </div>
              
              <TemplateManager
                template={template}
                onUpdateTemplate={updateTemplate}
                onAddTemplateItem={addTemplateItem}
                onUpdateTemplateItem={updateTemplateItem}
                onDeleteTemplateItem={deleteTemplateItem}
                calculateSummary={calculateSummary}
              />
            </motion.div>
          )}

          {currentView === 'periods' && (
            <motion.div
              key="periods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Budget Periods</h2>
                <p className="text-muted-foreground">
                  Create and manage your budget periods based on your pay schedule.
                </p>
              </div>
              
              <PeriodManager
                periods={periods}
                currentPeriodId={currentPeriodId}
                onCreatePeriod={createPeriod}
                onUpdatePeriod={updatePeriod}
                onDeletePeriod={deletePeriod}
                onSelectPeriod={setCurrentPeriod}
                calculateSummary={calculateSummary}
              />
            </motion.div>
          )}

          {currentView === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Data Management</h2>
                <p className="text-muted-foreground">
                  Export, import, and manage your budget data.
                </p>
              </div>
              
              <DataManagement />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
