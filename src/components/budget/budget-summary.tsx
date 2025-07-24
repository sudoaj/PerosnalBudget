'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { BudgetSummary, BudgetPeriod } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
  period: BudgetPeriod;
  className?: string;
}

export function BudgetSummaryCard({ summary, period, className = '' }: BudgetSummaryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`${className} border-2 shadow-lg`}>
      {/* Header with Period Info */}
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
            {period.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {formatDate(period.startDate)} - {formatDate(period.endDate)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Main Financial Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Income</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.totalIncome)}
            </div>
          </motion.div>

          {/* Bills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Bills</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary.totalBills)}
            </div>
          </motion.div>

          {/* Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
          >
            <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Expenses</div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(summary.totalExpenses)}
            </div>
          </motion.div>

          {/* Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Savings</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(summary.totalSavings)}
            </div>
          </motion.div>
        </div>

        {/* Debt (if any) */}
        {summary.totalDebt > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Debt Payments</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(summary.totalDebt)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Section: Total Out and Net Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border"
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Out</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(summary.totalOut)}
            </div>
          </motion.div>

          {/* Net Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-4 rounded-lg border-2 ${
              summary.isNegative 
                ? 'bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700' 
                : 'bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</span>
              {summary.isNegative ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <TrendingUp className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${
              summary.isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {formatCurrency(summary.net)}
            </div>
            {summary.isNegative && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                Over budget by {formatCurrency(Math.abs(summary.net))}
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
