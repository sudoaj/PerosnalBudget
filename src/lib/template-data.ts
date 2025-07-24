export interface TemplateItem {
  name: string;
  amount: number;
  category: 'income' | 'bills' | 'expenses' | 'savings' | 'debt';
  notes?: string;
  dueDate?: string;
  frequency?: 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly' | 'one-time';
  expenseFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
  paid?: boolean;
  balance?: number;
  paymentAmount?: number;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: TemplateItem[];
}

export const EXAMPLE_TEMPLATE: BudgetTemplate = {
  id: "example-template-2025",
  name: "Personal Budget Template",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-07-24T00:00:00.000Z",
  items: [
    // Income sources
    {
      name: "DVA2",
      amount: 1300.00,
      category: "income",
    },
    {
      name: "Lyft",
      amount: 100.00,
      category: "income",
    },
    {
      name: "Uber",
      amount: 100.00,
      category: "income",
    },
    
    // Bills with due dates
    {
      name: "Car Note",
      amount: 390.00,
      category: "bills",
      dueDate: "08/16",
      frequency: "monthly"
    },
    {
      name: "Geico",
      amount: 335.00,
      category: "bills",
      dueDate: "08/11",
      frequency: "monthly"
    },
    {
      name: "OpenSky payment",
      amount: 40.00,
      category: "bills",
      dueDate: "07/21",
      frequency: "monthly"
    },
    {
      name: "Capital one",
      amount: 100.00,
      category: "bills",
      dueDate: "08/15",
      frequency: "monthly"
    },
    {
      name: "Visible Phone bill",
      amount: 41.00,
      category: "bills",
      dueDate: "07/28",
      frequency: "monthly"
    },
    {
      name: "YMCA gym",
      amount: 28.00,
      category: "bills",
      dueDate: "08/01",
      frequency: "monthly"
    },
    {
      name: "Apple",
      amount: 37.00,
      category: "bills",
      dueDate: "08/16",
      frequency: "monthly"
    },
    {
      name: "Google",
      amount: 20.00,
      category: "bills",
      dueDate: "07/27",
      frequency: "monthly"
    },
    {
      name: "Affirm",
      amount: 330.00,
      category: "bills",
      dueDate: "08/12",
      frequency: "monthly"
    },
    
    // Expenses with frequency (set to 1st of month)
    {
      name: "Pocket money",
      amount: 190.00,
      category: "expenses",
      expenseFrequency: "monthly"
    },
    {
      name: "Groceries",
      amount: 270.00,
      category: "expenses",
      expenseFrequency: "weekly"
    },
    {
      name: "Outing",
      amount: 200.00,
      category: "expenses",
      expenseFrequency: "monthly"
    },
    
    // Savings
    {
      name: "PayPal account",
      amount: 25.00,
      category: "savings"
    },
    {
      name: "Credit Karma",
      amount: 25.00,
      category: "savings"
    },
    {
      name: "Apple savings",
      amount: 25.00,
      category: "savings"
    },
    {
      name: "Uber card",
      amount: 25.00,
      category: "savings"
    },
    {
      name: "Lyft card",
      amount: 0.00,
      category: "savings"
    },
    
    // Debt with balance and payment tracking
    {
      name: "Capital One",
      amount: 100.00, // Payment amount
      category: "debt",
      balance: 3100.00,
      paymentAmount: 100.00
    },
    {
      name: "Apple Card",
      amount: 50.00, // Payment amount
      category: "debt",
      balance: 500.00,
      paymentAmount: 50.00
    },
    {
      name: "Open Sky",
      amount: 30.00, // Payment amount
      category: "debt",
      balance: 400.00,
      paymentAmount: 30.00
    },
    {
      name: "Tax",
      amount: 0.00, // Payment amount
      category: "debt",
      balance: 200.00,
      paymentAmount: 0.00,
      paid: false
    },
    {
      name: "Car VA Tax",
      amount: 0.00, // Payment amount
      category: "debt",
      balance: 500.00,
      paymentAmount: 0.00,
      paid: false
    }
  ]
};
