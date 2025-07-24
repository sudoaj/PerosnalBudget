import { BudgetTemplate, BudgetPeriod } from '@/types/budget';

export interface StorageAdapter {
  getTemplate(): BudgetTemplate | null;
  saveTemplate(template: BudgetTemplate): void;
  getPeriods(): BudgetPeriod[];
  savePeriods(periods: BudgetPeriod[]): void;
  getCurrentPeriodId(): string | null;
  saveCurrentPeriodId(id: string | null): void;
  clearAll(): void;
  exportData(): string;
  importData(data: string): { template: BudgetTemplate; periods: BudgetPeriod[]; currentPeriodId: string | null };
}

const STORAGE_KEYS = {
  TEMPLATE: 'budget-template',
  PERIODS: 'budget-periods',
  CURRENT_PERIOD_ID: 'budget-current-period-id',
} as const;

export class LocalStorageAdapter implements StorageAdapter {
  getTemplate(): BudgetTemplate | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
    return stored ? JSON.parse(stored) : null;
  }

  saveTemplate(template: BudgetTemplate): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, JSON.stringify(template));
  }

  getPeriods(): BudgetPeriod[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.PERIODS);
    return stored ? JSON.parse(stored) : [];
  }

  savePeriods(periods: BudgetPeriod[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(periods));
  }

  getCurrentPeriodId(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PERIOD_ID);
  }

  saveCurrentPeriodId(id: string | null): void {
    if (typeof window === 'undefined') return;
    
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PERIOD_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PERIOD_ID);
    }
  }

  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  exportData(): string {
    const template = this.getTemplate();
    const periods = this.getPeriods();
    const currentPeriodId = this.getCurrentPeriodId();

    return JSON.stringify({
      template,
      periods,
      currentPeriodId,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2);
  }

  importData(data: string): { template: BudgetTemplate; periods: BudgetPeriod[]; currentPeriodId: string | null } {
    try {
      const parsed = JSON.parse(data);
      
      if (!parsed.template || !Array.isArray(parsed.periods)) {
        throw new Error('Invalid data format');
      }

      return {
        template: parsed.template,
        periods: parsed.periods,
        currentPeriodId: parsed.currentPeriodId || null,
      };
    } catch (error) {
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const storageAdapter = new LocalStorageAdapter();
