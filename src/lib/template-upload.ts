import { BudgetTemplate } from './template-data';
import { BudgetItem } from '@/types/budget';

export interface TemplateUploadResult {
  success: boolean;
  message: string;
  items?: Array<Omit<BudgetItem, 'id'>>;
}

export function validateTemplate(template: any): template is BudgetTemplate {
  if (!template || typeof template !== 'object') {
    return false;
  }

  if (!template.name || !template.description || !Array.isArray(template.items)) {
    return false;
  }

  for (const item of template.items) {
    if (!item.name || typeof item.amount !== 'number' || !item.category) {
      return false;
    }

    const validCategories = ['income', 'bills', 'expenses', 'savings', 'debt'];
    if (!validCategories.includes(item.category)) {
      return false;
    }
  }

  return true;
}

export function convertTemplateToItems(template: BudgetTemplate): Array<Omit<BudgetItem, 'id'>> {
  return template.items.map(item => ({
    name: item.name,
    amount: item.amount,
    category: item.category as any,
    notes: item.notes,
    dueDate: item.dueDate,
    frequency: item.frequency,
    expenseFrequency: item.expenseFrequency,
    paid: item.paid || false,
    balance: item.balance,
    paymentAmount: item.paymentAmount,
  }));
}

export function processTemplateUpload(file: File): Promise<TemplateUploadResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const template = JSON.parse(content);
        
        if (!validateTemplate(template)) {
          resolve({
            success: false,
            message: 'Invalid template format. Please check the template structure.',
          });
          return;
        }

        const items = convertTemplateToItems(template);
        
        resolve({
          success: true,
          message: `Template "${template.name}" loaded successfully with ${items.length} items.`,
          items,
        });
      } catch (error) {
        resolve({
          success: false,
          message: 'Failed to parse template file. Please ensure it\'s valid JSON.',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read template file.',
      });
    };

    reader.readAsText(file);
  });
}
