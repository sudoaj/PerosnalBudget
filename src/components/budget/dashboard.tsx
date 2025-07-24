'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Users,
  Target
} from 'lucide-react';
import { BudgetPeriod, BudgetSummary, BudgetItem } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardProps {
  periods: BudgetPeriod[];
  calculateSummary: (items: BudgetItem[]) => BudgetSummary;
}

type ViewMode = 'current' | 'all' | 'specific';

export function Dashboard({ periods, calculateSummary }: DashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('current');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  // Get the most recent period as current
  const currentPeriod = useMemo(() => {
    return periods.length > 0 
      ? periods.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;
  }, [periods]);

  // Calculate data based on view mode
  const dashboardData = useMemo(() => {
    let items: BudgetItem[] = [];
    let periodName = '';
    let dateRange = '';

    const calculateTrends = () => {
      if (periods.length < 2) return null;
      
      const sortedPeriods = periods.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const previous = calculateSummary(sortedPeriods[sortedPeriods.length - 2].items);
      const current = calculateSummary(sortedPeriods[sortedPeriods.length - 1].items);
      
      return {
        income: ((current.totalIncome - previous.totalIncome) / previous.totalIncome) * 100,
        expenses: ((current.totalOut - previous.totalOut) / previous.totalOut) * 100,
        net: ((current.net - previous.net) / Math.abs(previous.net || 1)) * 100,
      };
    };

    switch (viewMode) {
      case 'current':
        if (currentPeriod) {
          items = currentPeriod.items;
          periodName = currentPeriod.name;
          dateRange = `${formatDate(currentPeriod.startDate)} to ${formatDate(currentPeriod.endDate)}`;
        }
        break;
      case 'all':
        items = periods.flatMap(period => period.items);
        periodName = 'All Periods Combined';
        if (periods.length > 0) {
          const earliestDate = periods.reduce((earliest, period) => 
            new Date(period.startDate) < new Date(earliest) ? period.startDate : earliest, 
            periods[0].startDate
          );
          const latestDate = periods.reduce((latest, period) => 
            new Date(period.endDate) > new Date(latest) ? period.endDate : latest, 
            periods[0].endDate
          );
          dateRange = `${formatDate(earliestDate)} to ${formatDate(latestDate)}`;
        }
        break;
      case 'specific':
        const selectedPeriod = periods.find(p => p.id === selectedPeriodId);
        if (selectedPeriod) {
          items = selectedPeriod.items;
          periodName = selectedPeriod.name;
          dateRange = `${formatDate(selectedPeriod.startDate)} to ${formatDate(selectedPeriod.endDate)}`;
        }
        break;
    }

    const summary = calculateSummary(items);
    
    // Calculate category breakdowns
    const categoryBreakdown = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, count: 0, items: [] };
      }
      acc[item.category].total += item.amount;
      acc[item.category].count += 1;
      acc[item.category].items.push(item);
      return acc;
    }, {} as Record<string, { total: number; count: number; items: BudgetItem[] }>);

    // Calculate trends (if multiple periods)
    const trends = periods.length > 1 ? calculateTrends() : null;

    return {
      summary,
      categoryBreakdown,
      trends,
      periodName,
      dateRange,
      totalItems: items.length,
    };
  }, [viewMode, selectedPeriodId, periods, currentPeriod, calculateSummary]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'income': return 'text-green-600';
      case 'bills': return 'text-red-600';
      case 'expenses': return 'text-orange-600';
      case 'savings': return 'text-blue-600';
      case 'debt': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income': return TrendingUp;
      case 'bills': return Calendar;
      case 'expenses': return DollarSign;
      case 'savings': return Target;
      case 'debt': return TrendingDown;
      default: return BarChart3;
    }
  };

  if (periods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Data Yet</h3>
        <p className="text-muted-foreground">
          Create your first budget period to see dashboard insights
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budget Dashboard</h2>
          <p className="text-muted-foreground">{dashboardData.periodName}</p>
          {dashboardData.dateRange && (
            <p className="text-sm text-muted-foreground">{dashboardData.dateRange}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="specific">Specific Period</SelectItem>
            </SelectContent>
          </Select>
          
          {viewMode === 'specific' && (
            <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(dashboardData.summary.totalIncome)}
                </p>
                {dashboardData.trends && (
                  <p className={`text-xs ${dashboardData.trends.income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.trends.income >= 0 ? '+' : ''}{dashboardData.trends.income.toFixed(1)}% from last period
                  </p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(dashboardData.summary.totalOut)}
                </p>
                {dashboardData.trends && (
                  <p className={`text-xs ${dashboardData.trends.expenses <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.trends.expenses >= 0 ? '+' : ''}{dashboardData.trends.expenses.toFixed(1)}% from last period
                  </p>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-bold ${dashboardData.summary.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(dashboardData.summary.net)}
                </p>
                {dashboardData.trends && (
                  <p className={`text-xs ${dashboardData.trends.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.trends.net >= 0 ? '+' : ''}{dashboardData.trends.net.toFixed(1)}% from last period
                  </p>
                )}
              </div>
              <DollarSign className={`h-8 w-8 ${dashboardData.summary.isNegative ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.totalItems}
                </p>
                <p className="text-xs text-muted-foreground">
                  {viewMode === 'all' ? `Across ${periods.length} periods` : 'In this period'}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dashboardData.categoryBreakdown).map(([category, data]) => {
              const Icon = getCategoryIcon(category);
              const percentage = dashboardData.summary.totalIncome > 0 
                ? (data.total / dashboardData.summary.totalIncome) * 100 
                : 0;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${getCategoryColor(category)}`} />
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{data.count} items</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${getCategoryColor(category)}`}>
                        {formatCurrency(data.total)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category === 'income' ? 'bg-green-500' :
                          category === 'bills' ? 'bg-red-500' :
                          category === 'expenses' ? 'bg-orange-500' :
                          category === 'savings' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity (for current/specific period) */}
      {viewMode !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(dashboardData.categoryBreakdown)
                .flatMap(([category, data]) => 
                  data.items.map(item => ({ ...item, category }))
                )
                .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
                .slice(0, 10)
                .map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.category === 'income' ? 'bg-green-500' :
                        item.category === 'bills' ? 'bg-red-500' :
                        item.category === 'expenses' ? 'bg-orange-500' :
                        item.category === 'savings' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getCategoryColor(item.category)}`}>
                        {formatCurrency(item.amount)}
                      </p>
                      {item.paid !== undefined && (
                        <p className={`text-xs ${item.paid ? 'text-green-600' : 'text-yellow-600'}`}>
                          {item.paid ? 'Paid' : 'Pending'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
