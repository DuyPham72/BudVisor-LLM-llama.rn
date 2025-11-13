// BudgetAssistant/app/MainScreen.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardContent, CardHeader, CardTitle } from './components/card';
import { Button } from './components/button';
import { Progress } from './components/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
import { Select, SelectTrigger, SelectContent, SelectItem } from './components/select';
import { DonutChart } from './components/DonutChart';

import kaesiData from '../assets/data/kaesi.json';

import type { Screen } from './App';

interface MainScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenMenu: () => void;
}

type KaesiTransaction = {
  date_transacted: string;
  description: string; // Food, Transportation, Housing, Entertainment, Income
  amount: number; // positive for income, negative for expense
  balance: number;
};

type KaesiJson = {
  user_profile: {
    full_name: string;
    created_at: string;
  };
  accounts: {
    account_name: string;
    beginning_balance: number;
    transactions: KaesiTransaction[];
  };
};

const DATA = kaesiData as KaesiJson;

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const CATEGORY_BUDGETS: Record<string, number> = {
  Food: 500,
  Housing: 1200,
  Transportation: 300,
  Entertainment: 200,
};

function getMonthLabel(dateStr: string) {
  const d = new Date(dateStr);
  const m = d.getMonth();
  return MONTH_LABELS[m] ?? 'Unknown';
}

// Build enriched transactions and summaries **once**
const RAW_TRANSACTIONS = DATA.accounts.transactions as KaesiTransaction[];

// Enriched list used for UI
const ENRICHED_TRANSACTIONS = RAW_TRANSACTIONS.map((t, idx) => {
  const monthLabel = getMonthLabel(t.date_transacted);
  const type = t.amount >= 0 ? 'income' : 'expense';
  return {
    id: String(idx),
    name: t.description,
    category: t.description,
    date: t.date_transacted,
    month: monthLabel,
    type,
    amount: Math.abs(t.amount),
  };
});

// Monthly income vs expenses (for all 12 months, even if 0)
const MONTHLY_SUMMARY = MONTH_LABELS.map((label, index) => {
  const monthTransactions = RAW_TRANSACTIONS.filter(
    (t) => new Date(t.date_transacted).getMonth() === index,
  );
  const income = monthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    month: label,
    income,
    expenses,
  };
});

// Category spending per month (using budgets above)
const CATEGORY_DATA_BY_MONTH: Record<
  string,
  { name: string; spent: number; budget: number }[]
> = {};

MONTH_LABELS.forEach((label, index) => {
  const monthTransactions = RAW_TRANSACTIONS.filter(
    (t) => new Date(t.date_transacted).getMonth() === index,
  );

  const byCat: Record<string, number> = {};
  monthTransactions.forEach((t) => {
    if (t.amount < 0 && t.description !== 'Income') {
      const cat = t.description;
      const spent = Math.abs(t.amount);
      byCat[cat] = (byCat[cat] || 0) + spent;
    }
  });

  CATEGORY_DATA_BY_MONTH[label] = Object.keys(byCat).map((cat) => ({
    name: cat,
    spent: Number(byCat[cat].toFixed(2)),
    budget: CATEGORY_BUDGETS[cat] ?? byCat[cat],
  }));
});

export const MainScreen: React.FC<MainScreenProps> = ({
  onNavigate,
  onOpenMenu,
}) => {
  // Pick last transaction’s month as default
  const lastTx = ENRICHED_TRANSACTIONS[ENRICHED_TRANSACTIONS.length - 1];
  const defaultMonth = lastTx?.month ?? 'Jan';

  const [viewMode, setViewMode] = useState<'overall' | 'detail'>(
    'overall',
  );
  const [overallFilter, setOverallFilter] = useState<string>('overall-2025');
  const [transactionFilter, setTransactionFilter] =
    useState<string>('all');
  const [categoryMonth, setCategoryMonth] =
    useState<string>(defaultMonth);
  const [categoryTransactionFilter, setCategoryTransactionFilter] =
    useState<string>('all');

  const currentBalance =
    RAW_TRANSACTIONS[RAW_TRANSACTIONS.length - 1]?.balance ??
    DATA.accounts.beginning_balance;

  const monthlyComparisonData = MONTHLY_SUMMARY;
  const months = MONTH_LABELS;

  const totalBudget = 5000; // monthly budget (same as old UI, but now using real expenses)
  const yearlyBudget = totalBudget * 12;

  const overallData = useMemo(() => {
    if (overallFilter === 'overall-2025') {
      const yearlyIncome = monthlyComparisonData.reduce(
        (sum, m) => sum + m.income,
        0,
      );
      const yearlyExpenses = monthlyComparisonData.reduce(
        (sum, m) => sum + m.expenses,
        0,
      );
      return {
        spent: yearlyExpenses,
        budget: yearlyBudget,
        percentage: (yearlyExpenses / yearlyBudget) * 100,
        income: yearlyIncome,
      };
    } else {
      const monthData = monthlyComparisonData.find(
        (m) => m.month === overallFilter,
      );
      const spent = monthData?.expenses ?? 0;
      return {
        spent,
        budget: totalBudget,
        percentage: (spent / totalBudget) * 100,
        income: monthData?.income ?? 0,
      };
    }
  }, [overallFilter]);

  const getFilteredTransactions = (filter: string) => {
    if (filter === 'all') return ENRICHED_TRANSACTIONS.slice().reverse();
    return ENRICHED_TRANSACTIONS.filter((t) => t.month === filter).reverse();
  };

  const filteredTransactions = getFilteredTransactions(transactionFilter);
  const categoryTransactions = getFilteredTransactions(
    categoryTransactionFilter,
  );

  const categoryData =
    CATEGORY_DATA_BY_MONTH[categoryMonth] ?? [];

  const currentMonth = defaultMonth; // for potential "Set Budget" style actions

  const firstName = DATA.user_profile.full_name.split(' ')[0];

  const progressPercentage =
    (overallData.spent / overallData.budget) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Budget Tracker</Text>
        </View>
        <Button
          variant="ghost"
          style={styles.menuButton}
          onPress={onOpenMenu}
        >
          <Ionicons name="menu" size={24} color="#4F46E5" />
        </Button>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* View mode tabs */}
        <Tabs
          value={viewMode}
          onValueChange={(v) =>
            setViewMode(v as 'overall' | 'detail')
          }
        >
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="detail">Detail</TabsTrigger>
          </TabsList>

          {/* OVERALL VIEW */}
          <TabsContent value="overall">
            {/* Budget Overview (Donut Chart) */}
            <Card style={styles.card}>
              <CardHeader style={styles.cardHeaderRow}>
                <CardTitle>Overview</CardTitle>
                <Select value={overallFilter} onValueChange={setOverallFilter}>
                  <SelectTrigger style={styles.selectTrigger} />
                  <SelectContent>
                    <SelectItem value="overall-2025">Overall 2025</SelectItem>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m} 2025
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent style={{ alignItems: 'center', paddingVertical: 20 }}>
                <DonutChart
                  progress={progressPercentage}
                  size={160}
                  strokeWidth={14}
                  spent={overallData.spent}
                  budget={overallData.budget}
                />
                <View style={{ alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    {progressPercentage.toFixed(1)}% Used
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    ${overallData.spent.toFixed(2)} of ${overallData.budget.toFixed(0)}
                  </Text>
                </View>
              </CardContent>
            </Card>

            {/* Category budget card */}
            <Card style={styles.card}>
              <CardHeader style={styles.cardHeaderRow}>
                <CardTitle>Category</CardTitle>
                <Select
                  value={categoryMonth}
                  onValueChange={setCategoryMonth}
                >
                  <SelectTrigger style={styles.selectTrigger} />
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m} 2025
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No category data for this month.
                  </Text>
                ) : (
                  categoryData.map((cat) => {
                    const pct =
                      (cat.spent / cat.budget) * 100;
                    return (
                      <View
                        key={cat.name}
                        style={styles.categoryRow}
                      >
                        <View style={styles.categoryHeaderRow}>
                          <Text style={styles.categoryName}>
                            {cat.name}
                          </Text>
                          <Text style={styles.categoryAmounts}>
                            ${cat.spent.toFixed(2)} / $
                            {cat.budget.toFixed(0)}
                          </Text>
                        </View>
                        <Progress value={pct} />
                      </View>
                    );
                  })
                )}
                {categoryMonth === currentMonth && (
                  <Button
                    style={styles.setBudgetButton}
                    onPress={() => {
                      // You can wire this to a future Settings screen
                      // onNavigate('settings');
                    }}
                  >
                    <Ionicons
                      name="settings-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.setBudgetText}>
                      Set Budget (coming soon)
                    </Text>
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES VIEW */}
          <TabsContent value="detail">
            {/* Recent transactions (category view) */}
            <Card style={styles.card}>
              <CardHeader style={styles.cardHeaderRow}>
                <CardTitle>Recent Transactions</CardTitle>
                <Select
                  value={categoryTransactionFilter}
                  onValueChange={setCategoryTransactionFilter}
                >
                  <SelectTrigger style={styles.selectTrigger} />
                  <SelectContent>
                    <SelectItem value="all">All Recent</SelectItem>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {categoryTransactions.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No transactions found.
                  </Text>
                ) : (
                  categoryTransactions.slice(0, 10).map((t) => (
                    <View
                      key={t.id}
                      style={styles.transactionRow}
                    >
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.iconCircle,
                            t.type === 'income'
                              ? styles.incomeIconCircle
                              : styles.expenseIconCircle,
                          ]}
                        >
                          <Ionicons
                            name={
                              t.type === 'income'
                                ? 'trending-up'
                                : 'trending-down'
                            }
                            size={18}
                            color={
                              t.type === 'income'
                                ? '#16A34A'
                                : '#DC2626'
                            }
                          />
                        </View>
                        <View>
                          <Text style={styles.transactionName}>
                            {t.name}
                          </Text>
                          <Text style={styles.transactionMeta}>
                            {t.category} • {t.date}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          t.type === 'income'
                            ? styles.incomeText
                            : styles.expenseText,
                        ]}
                      >
                        {t.type === 'income' ? '+' : '-'}$
                        {t.amount.toFixed(2)}
                      </Text>
                    </View>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  tabsList: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 12,
  },
  barChartRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
  },
  barGroup: {
    alignItems: 'center',
    gap: 4,
  },
  barGroupInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 160,
  },
  barColumn: {
    alignItems: 'center',
    gap: 4,
  },
  incomeLabel: {
    fontSize: 10,
    color: '#16A34A',
  },
  expenseLabel: {
    fontSize: 10,
    color: '#DC2626',
  },
  incomeBar: {
    width: 16,
    borderRadius: 999,
    backgroundColor: '#16A34A',
  },
  expenseBar: {
    width: 16,
    borderRadius: 999,
    backgroundColor: '#DC2626',
  },
  monthLabel: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#4B5563',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectTrigger: {
    width: 140,
  },
  progressSummary: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 4,
  },
  progressSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  progressFooter: {
    marginTop: 8,
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIconCircle: {
    backgroundColor: '#DCFCE7',
  },
  expenseIconCircle: {
    backgroundColor: '#FEE2E2',
  },
  transactionName: {
    fontSize: 14,
    color: '#111827',
  },
  transactionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  incomeText: {
    color: '#16A34A',
  },
  expenseText: {
    color: '#DC2626',
  },
  categoryRow: {
    marginBottom: 12,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#111827',
  },
  categoryAmounts: {
    fontSize: 13,
    color: '#4B5563',
  },
  setBudgetButton: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
  setBudgetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
