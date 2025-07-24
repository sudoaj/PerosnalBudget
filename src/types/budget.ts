export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: 'income' | 'bills' | 'expenses' | 'savings' | 'debt';
  date?: string;
  paid?: boolean; // Only for bills, savings, and debt
  notes?: string;
  
  // Bills-specific fields
  dueDate?: string;
  frequency?: 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time';
  
  // Expenses-specific fields
  expenseFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
}

export interface BudgetTemplate {
  id: string;
  name: string;
  items: BudgetItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  items: BudgetItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalBills: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
  totalOut: number;
  net: number;
  isNegative: boolean;
}

export interface BudgetStore {
  template: BudgetTemplate;
  periods: BudgetPeriod[];
  currentPeriodId: string | null;
  
  // Template actions
  updateTemplate: (template: BudgetTemplate) => void;
  addTemplateItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateTemplateItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteTemplateItem: (id: string) => void;
  
  // Period actions
  createPeriod: (name: string, startDate: string, endDate: string) => string;
  updatePeriod: (id: string, name: string, startDate: string, endDate: string) => void;
  deletePeriod: (id: string) => void;
  setCurrentPeriod: (id: string) => void;
  addPeriodItem: (periodId: string, item: Omit<BudgetItem, 'id'>) => void;
  updatePeriodItem: (periodId: string, itemId: string, updates: Partial<BudgetItem>) => void;
  deletePeriodItem: (periodId: string, itemId: string) => void;
  toggleItemPaid: (periodId: string, itemId: string) => void;
  
  // Utility actions
  calculateSummary: (items: BudgetItem[]) => BudgetSummary;
  getCurrentPeriod: () => BudgetPeriod | null;
  exportData: () => string;
  importData: (data: string) => void;
  clearAll: () => void;
}

export type Category = 'income' | 'bills' | 'expenses' | 'savings' | 'debt';

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'income', label: 'Income', color: 'text-green-600' },
  { value: 'bills', label: 'Bills', color: 'text-red-600' },
  { value: 'expenses', label: 'Expenses', color: 'text-orange-600' },
  { value: 'savings', label: 'Savings', color: 'text-blue-600' },
  { value: 'debt', label: 'Debt Allocation', color: 'text-purple-600' }
];
