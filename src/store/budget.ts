import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BudgetStore, BudgetTemplate, BudgetPeriod, BudgetItem, BudgetSummary } from '@/types/budget';
import { storageAdapter } from '@/lib/storage';
import { EXAMPLE_TEMPLATE } from '@/lib/template-data';

const createEmptyTemplate = (): BudgetTemplate => ({
  id: uuidv4(),
  name: 'Default Template',
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const calculateSummary = (items: BudgetItem[]): BudgetSummary => {
  const totals = items.reduce(
    (acc, item) => {
      switch (item.category) {
        case 'income':
          acc.totalIncome += item.amount;
          break;
        case 'bills':
          acc.totalBills += item.amount;
          break;
        case 'expenses':
          acc.totalExpenses += item.amount;
          break;
        case 'savings':
          acc.totalSavings += item.amount;
          break;
        case 'debt':
          acc.totalDebt += item.amount;
          break;
      }
      return acc;
    },
    {
      totalIncome: 0,
      totalBills: 0,
      totalExpenses: 0,
      totalSavings: 0,
      totalDebt: 0,
    }
  );

  const totalOut = totals.totalBills + totals.totalExpenses + totals.totalSavings + totals.totalDebt;
  const net = totals.totalIncome - totalOut;

  return {
    ...totals,
    totalOut,
    net,
    isNegative: net < 0,
  };
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  template: createEmptyTemplate(),
  periods: [],
  currentPeriodId: null,

  // Template actions
  updateTemplate: (template) => {
    const updatedTemplate = { ...template, updatedAt: new Date().toISOString() };
    set({ template: updatedTemplate });
    storageAdapter.saveTemplate(updatedTemplate);
  },

  addTemplateItem: (item) => {
    const newItem: BudgetItem = { ...item, id: uuidv4() };
    const template = get().template;
    const updatedTemplate = {
      ...template,
      items: [...template.items, newItem],
      updatedAt: new Date().toISOString(),
    };
    set({ template: updatedTemplate });
    storageAdapter.saveTemplate(updatedTemplate);
  },

  updateTemplateItem: (id, updates) => {
    const template = get().template;
    const updatedTemplate = {
      ...template,
      items: template.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
      updatedAt: new Date().toISOString(),
    };
    set({ template: updatedTemplate });
    storageAdapter.saveTemplate(updatedTemplate);
  },

  deleteTemplateItem: (id) => {
    const template = get().template;
    const updatedTemplate = {
      ...template,
      items: template.items.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    };
    set({ template: updatedTemplate });
    storageAdapter.saveTemplate(updatedTemplate);
  },

  // Period actions
  createPeriod: (name, startDate, endDate) => {
    const template = get().template;
    const newPeriod: BudgetPeriod = {
      id: uuidv4(),
      name,
      startDate,
      endDate,
      items: template.items.map((item) => ({ ...item, id: uuidv4(), paid: false })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const periods = [...get().periods, newPeriod];
    set({ periods, currentPeriodId: newPeriod.id });
    storageAdapter.savePeriods(periods);
    storageAdapter.saveCurrentPeriodId(newPeriod.id);
    
    return newPeriod.id;
  },

  deletePeriod: (id) => {
    const periods = get().periods.filter((period) => period.id !== id);
    const currentPeriodId = get().currentPeriodId === id ? null : get().currentPeriodId;
    
    set({ periods, currentPeriodId });
    storageAdapter.savePeriods(periods);
    storageAdapter.saveCurrentPeriodId(currentPeriodId);
  },

  updatePeriod: (id, name, startDate, endDate) => {
    const periods = get().periods.map((period) =>
      period.id === id
        ? { 
            ...period, 
            name, 
            startDate, 
            endDate, 
            updatedAt: new Date().toISOString() 
          }
        : period
    );
    
    set({ periods });
    storageAdapter.savePeriods(periods);
  },

  setCurrentPeriod: (id) => {
    set({ currentPeriodId: id });
    storageAdapter.saveCurrentPeriodId(id);
  },

  addPeriodItem: (periodId, item) => {
    const newItem: BudgetItem = { ...item, id: uuidv4() };
    const periods = get().periods.map((period) =>
      period.id === periodId
        ? {
            ...period,
            items: [...period.items, newItem],
            updatedAt: new Date().toISOString(),
          }
        : period
    );
    set({ periods });
    storageAdapter.savePeriods(periods);
  },

  updatePeriodItem: (periodId, itemId, updates) => {
    const periods = get().periods.map((period) =>
      period.id === periodId
        ? {
            ...period,
            items: period.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : period
    );
    set({ periods });
    storageAdapter.savePeriods(periods);
  },

  deletePeriodItem: (periodId, itemId) => {
    const periods = get().periods.map((period) =>
      period.id === periodId
        ? {
            ...period,
            items: period.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        : period
    );
    set({ periods });
    storageAdapter.savePeriods(periods);
  },

  toggleItemPaid: (periodId, itemId) => {
    const periods = get().periods.map((period) =>
      period.id === periodId
        ? {
            ...period,
            items: period.items.map((item) =>
              item.id === itemId ? { ...item, paid: !item.paid } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : period
    );
    set({ periods });
    storageAdapter.savePeriods(periods);
  },

  // Utility actions
  calculateSummary,

  getCurrentPeriod: () => {
    const { periods, currentPeriodId } = get();
    return periods.find((period) => period.id === currentPeriodId) || null;
  },

  exportData: () => {
    return storageAdapter.exportData();
  },

  importData: (data) => {
    try {
      const { template, periods, currentPeriodId } = storageAdapter.importData(data);
      set({ template, periods, currentPeriodId });
      storageAdapter.saveTemplate(template);
      storageAdapter.savePeriods(periods);
      storageAdapter.saveCurrentPeriodId(currentPeriodId);
    } catch (error) {
      throw error;
    }
  },

  clearAll: () => {
    const emptyTemplate = createEmptyTemplate();
    set({
      template: emptyTemplate,
      periods: [],
      currentPeriodId: null,
    });
    storageAdapter.clearAll();
  },
}));

// Initialize store with persisted data
if (typeof window !== 'undefined') {
  const template = storageAdapter.getTemplate();
  const periods = storageAdapter.getPeriods();
  const currentPeriodId = storageAdapter.getCurrentPeriodId();

  if (template || periods.length > 0) {
    useBudgetStore.setState({
      template: template || createEmptyTemplate(),
      periods,
      currentPeriodId,
    });
  }
}
