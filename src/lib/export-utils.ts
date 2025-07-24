import { BudgetItem, BudgetPeriod, BudgetTemplate } from '@/types/budget';
import { formatCurrency } from './utils';

interface ExportData {
  template: BudgetTemplate;
  periods: BudgetPeriod[];
}

// Export to organized CSV format
export function exportToOrganizedCSV(data: ExportData): void {
  const date = new Date().toISOString().split('T')[0];
  const filename = `budget-export-${date}.csv`;
  
  let csvContent = '';
  
  // Add header
  csvContent += `Budget Export - ${new Date().toLocaleDateString()}\n`;
  csvContent += `Generated from Budget App\n\n`;
  
  // Template Section
  csvContent += `TEMPLATE: ${data.template.name}\n`;
  csvContent += `Category,Name,Amount,Notes,Due Date,Frequency,Expense Frequency\n`;
  
  const templateByCategory = groupByCategory(data.template.items);
  
  Object.entries(templateByCategory).forEach(([category, items]) => {
    csvContent += `\n--- ${category.toUpperCase()} ---\n`;
    items.forEach(item => {
      csvContent += `${category},${escapeCSV(item.name)},${item.amount},${escapeCSV(item.notes || '')},${item.dueDate || ''},${item.frequency || ''},${item.expenseFrequency || ''}\n`;
    });
  });
  
  // Periods Section
  data.periods.forEach(period => {
    csvContent += `\n\nPERIOD: ${period.name} (${period.startDate} to ${period.endDate})\n`;
    csvContent += `Category,Name,Amount,Notes,Due Date,Frequency,Expense Frequency\n`;
    
    const periodByCategory = groupByCategory(period.items);
    
    Object.entries(periodByCategory).forEach(([category, items]) => {
      csvContent += `\n--- ${category.toUpperCase()} ---\n`;
      items.forEach(item => {
        csvContent += `${category},${escapeCSV(item.name)},${item.amount},${escapeCSV(item.notes || '')},${item.dueDate || ''},${item.frequency || ''},${item.expenseFrequency || ''}\n`;
      });
    });
    
    // Period Summary
    const summary = calculatePeriodSummary(period.items);
    csvContent += `\n--- PERIOD SUMMARY ---\n`;
    csvContent += `Total Income,${summary.totalIncome}\n`;
    csvContent += `Total Bills,${summary.totalBills}\n`;
    csvContent += `Total Expenses,${summary.totalExpenses}\n`;
    csvContent += `Total Savings,${summary.totalSavings}\n`;
    csvContent += `Total Debt,${summary.totalDebt}\n`;
    csvContent += `Net Balance,${summary.net}\n`;
  });
  
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

// Export to Markdown format
export function exportToMarkdown(data: ExportData): void {
  const date = new Date().toISOString().split('T')[0];
  const filename = `budget-export-${date}.md`;
  
  let markdown = '';
  
  // Header
  markdown += `# Budget Export\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleDateString()}\n`;
  markdown += `**Export Date:** ${date}\n\n`;
  
  // Template Section
  markdown += `## 📋 Template: ${data.template.name}\n\n`;
  markdown += `*This template is used to create new budget periods*\n\n`;
  
  const templateByCategory = groupByCategory(data.template.items);
  
  Object.entries(templateByCategory).forEach(([category, items]) => {
    const categoryEmoji = getCategoryEmoji(category);
    markdown += `### ${categoryEmoji} ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    
    markdown += `| Name | Amount | Notes | Due Date | Frequency |\n`;
    markdown += `|------|--------|-------|----------|----------|\n`;
    
    items.forEach(item => {
      const notes = item.notes || '-';
      const dueDate = item.dueDate || '-';
      const frequency = item.frequency || item.expenseFrequency || '-';
      markdown += `| ${item.name} | ${formatCurrency(item.amount)} | ${notes} | ${dueDate} | ${frequency} |\n`;
    });
    
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    markdown += `\n**${category.charAt(0).toUpperCase() + category.slice(1)} Total:** ${formatCurrency(total)}\n\n`;
  });
  
  // Periods Section
  markdown += `## 📅 Budget Periods\n\n`;
  
  if (data.periods.length === 0) {
    markdown += `*No budget periods created yet*\n\n`;
  } else {
    data.periods.forEach((period, index) => {
      markdown += `### ${index + 1}. ${period.name}\n\n`;
      markdown += `**Period:** ${period.startDate} to ${period.endDate}\n\n`;
      
      const periodByCategory = groupByCategory(period.items);
      
      Object.entries(periodByCategory).forEach(([category, items]) => {
        const categoryEmoji = getCategoryEmoji(category);
        markdown += `#### ${categoryEmoji} ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        
        markdown += `| Name | Amount | Notes | Details |\n`;
        markdown += `|------|--------|-------|----------|\n`;
        
        items.forEach(item => {
          const notes = item.notes || '-';
          let details = '-';
          if (item.dueDate) details = `Due: ${item.dueDate}`;
          else if (item.frequency) details = `Frequency: ${item.frequency}`;
          else if (item.expenseFrequency) details = `Frequency: ${item.expenseFrequency}`;
          
          markdown += `| ${item.name} | ${formatCurrency(item.amount)} | ${notes} | ${details} |\n`;
        });
        
        const total = items.reduce((sum, item) => sum + item.amount, 0);
        markdown += `\n**${category.charAt(0).toUpperCase() + category.slice(1)} Total:** ${formatCurrency(total)}\n\n`;
      });
      
      // Period Summary
      const summary = calculatePeriodSummary(period.items);
      markdown += `#### 📊 Period Summary\n\n`;
      markdown += `| Category | Amount |\n`;
      markdown += `|----------|--------|\n`;
      markdown += `| 💰 Income | ${formatCurrency(summary.totalIncome)} |\n`;
      markdown += `| 📄 Bills | ${formatCurrency(summary.totalBills)} |\n`;
      markdown += `| 🛒 Expenses | ${formatCurrency(summary.totalExpenses)} |\n`;
      markdown += `| 🏦 Savings | ${formatCurrency(summary.totalSavings)} |\n`;
      markdown += `| 💳 Debt | ${formatCurrency(summary.totalDebt)} |\n`;
      markdown += `| **Net Balance** | **${formatCurrency(summary.net)}** |\n\n`;
      
      const balanceEmoji = summary.net >= 0 ? '✅' : '⚠️';
      markdown += `${balanceEmoji} **Status:** ${summary.net >= 0 ? 'Positive' : 'Negative'} Balance\n\n`;
      markdown += `---\n\n`;
    });
  }
  
  // Footer
  markdown += `## ℹ️ About This Export\n\n`;
  markdown += `This export contains:\n`;
  markdown += `- 📋 **Template:** ${data.template.items.length} items\n`;
  markdown += `- 📅 **Periods:** ${data.periods.length} periods\n`;
  markdown += `- 💾 **Format:** Markdown (.md)\n\n`;
  markdown += `Generated by Budget App on ${new Date().toLocaleString()}\n`;
  
  downloadFile(markdown, filename, 'text/markdown;charset=utf-8;');
}

// Helper functions
function groupByCategory(items: BudgetItem[]): Record<string, BudgetItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetItem[]>);
}

function calculatePeriodSummary(items: BudgetItem[]) {
  const summary = {
    totalIncome: 0,
    totalBills: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalDebt: 0,
    net: 0,
  };
  
  items.forEach(item => {
    switch (item.category) {
      case 'income':
        summary.totalIncome += item.amount;
        break;
      case 'bills':
        summary.totalBills += item.amount;
        break;
      case 'expenses':
        summary.totalExpenses += item.amount;
        break;
      case 'savings':
        summary.totalSavings += item.amount;
        break;
      case 'debt':
        summary.totalDebt += item.amount;
        break;
    }
  });
  
  summary.net = summary.totalIncome - (summary.totalBills + summary.totalExpenses + summary.totalSavings + summary.totalDebt);
  
  return summary;
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    income: '💰',
    bills: '📄',
    expenses: '🛒',
    savings: '🏦',
    debt: '💳',
  };
  return emojis[category] || '📋';
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
