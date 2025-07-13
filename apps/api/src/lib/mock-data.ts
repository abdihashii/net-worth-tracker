/**
 * Mock data for development and testing
 * Uses proper shared types and realistic financial data
 */

import type {
  Account,
  AccountBalance,
  AccountListItem,
  DashboardSummaryCard,
  NetWorthSummary,
} from "@net-worth-tracker/shared-types";
import {
  ACCOUNT_CATEGORIES,
  ACCOUNT_TYPES,
} from "@net-worth-tracker/shared-types";

// Mock user ID for consistent data relationships
export const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

// Dynamic date helpers for always-current mock data
const getCurrentDate = () => new Date();
const getDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// Base dates for realistic data (always relative to current date)
const oneMonthAgo = getDaysAgo(30);
const oneYearAgo = getDaysAgo(365);

/**
 * Seeded pseudo-random number generator for consistent mock data
 * Uses a simple Linear Congruential Generator (LCG) algorithm
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Generate next pseudo-random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2**32;
    return this.seed / 2**32;
  }

  // Generate random number between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Generate normally distributed random number (Box-Muller transform)
  normal(mean: number = 0, stdDev: number = 1): number {
    if (this.spareNormal !== undefined) {
      const spare = this.spareNormal;
      this.spareNormal = undefined;
      return spare * stdDev + mean;
    }

    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    
    this.spareNormal = z1;
    return z0 * stdDev + mean;
  }

  private spareNormal?: number;
}

/**
 * Create a seeded random generator based on a date
 */
function createSeededRandom(date: Date): SeededRandom {
  // Use date components to create a consistent seed
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return new SeededRandom(seed);
}

/**
 * Mock account balances with historical data
 */
export const mockAccountBalances: AccountBalance[] = [
  // Current Balances
  {
    id: "bal-1",
    accountId: "acc-1",
    balance: 12500,
    availableBalance: 12500,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-2",
    accountId: "acc-2",
    balance: 25000,
    availableBalance: 25000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-3",
    accountId: "acc-3",
    balance: 85000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-4",
    accountId: "acc-4",
    balance: 42500,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-5",
    accountId: "acc-5",
    balance: 2500,
    limit: 15000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-6",
    accountId: "acc-6",
    balance: 15000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "plaid",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-7",
    accountId: "acc-7",
    balance: 350000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-8",
    accountId: "acc-8",
    balance: 28000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  // One Month Ago Balances
  {
    id: "bal-1-monthly",
    accountId: "acc-1",
    balance: 12000,
    availableBalance: 12000,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-2-monthly",
    accountId: "acc-2",
    balance: 24500,
    availableBalance: 24500,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-3-monthly",
    accountId: "acc-3",
    balance: 82000,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-4-monthly",
    accountId: "acc-4",
    balance: 41000,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-5-monthly",
    accountId: "acc-5",
    balance: 3000,
    limit: 15000,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-6-monthly",
    accountId: "acc-6",
    balance: 15500,
    date: oneMonthAgo,
    isCurrent: false,
    source: "plaid",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-7-monthly",
    accountId: "acc-7",
    balance: 348000,
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-8-monthly",
    accountId: "acc-8",
    balance: 28500,
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
];

/**
 * Mock accounts with proper types and relationships
 */
export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    userId: MOCK_USER_ID,
    plaidItemId: "item-1",
    plaidAccountId: "plaid-acc-1",
    name: "Chase Checking",
    officialName: "Chase Total Checking",
    type: ACCOUNT_TYPES.DEPOSITORY,
    subtype: "checking",
    category: ACCOUNT_CATEGORIES.CASH,
    isManual: false,
    isActive: true,
    institutionName: "Chase",
    mask: "1234",
    currency: "USD",
    currentBalance: mockAccountBalances[0],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-2",
    userId: MOCK_USER_ID,
    plaidItemId: "item-1",
    plaidAccountId: "plaid-acc-2",
    name: "Chase Savings",
    officialName: "Chase Premier Savings",
    type: ACCOUNT_TYPES.DEPOSITORY,
    subtype: "savings",
    category: ACCOUNT_CATEGORIES.CASH,
    isManual: false,
    isActive: true,
    institutionName: "Chase",
    mask: "5678",
    currency: "USD",
    currentBalance: mockAccountBalances[1],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-3",
    userId: MOCK_USER_ID,
    plaidItemId: "item-2",
    plaidAccountId: "plaid-acc-3",
    name: "Schwab Brokerage",
    officialName: "Charles Schwab Brokerage Account",
    type: ACCOUNT_TYPES.INVESTMENT,
    subtype: "brokerage",
    category: ACCOUNT_CATEGORIES.INVESTMENT,
    isManual: false,
    isActive: true,
    institutionName: "Charles Schwab",
    mask: "9012",
    currency: "USD",
    currentBalance: mockAccountBalances[2],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-4",
    userId: MOCK_USER_ID,
    plaidItemId: "item-3",
    plaidAccountId: "plaid-acc-4",
    name: "Vanguard IRA",
    officialName: "Vanguard Individual Retirement Account",
    type: ACCOUNT_TYPES.INVESTMENT,
    subtype: "ira",
    category: ACCOUNT_CATEGORIES.INVESTMENT,
    isManual: false,
    isActive: true,
    institutionName: "Vanguard",
    mask: "3456",
    currency: "USD",
    currentBalance: mockAccountBalances[3],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-5",
    userId: MOCK_USER_ID,
    plaidItemId: "item-1",
    plaidAccountId: "plaid-acc-5",
    name: "Chase Sapphire",
    officialName: "Chase Sapphire Preferred",
    type: ACCOUNT_TYPES.CREDIT,
    subtype: "credit_card",
    category: ACCOUNT_CATEGORIES.OTHER,
    isManual: false,
    isActive: true,
    institutionName: "Chase",
    mask: "7890",
    currency: "USD",
    currentBalance: mockAccountBalances[4],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-6",
    userId: MOCK_USER_ID,
    plaidItemId: "item-4",
    plaidAccountId: "plaid-acc-6",
    name: "Auto Loan",
    officialName: "Toyota Financial Services Auto Loan",
    type: ACCOUNT_TYPES.LOAN,
    subtype: "auto",
    category: ACCOUNT_CATEGORIES.OTHER,
    isManual: false,
    isActive: true,
    institutionName: "Toyota Financial",
    mask: "2468",
    currency: "USD",
    currentBalance: mockAccountBalances[5],
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-7",
    userId: MOCK_USER_ID,
    name: "Home",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "real_estate",
    category: ACCOUNT_CATEGORIES.PROPERTY,
    isManual: true,
    isActive: true,
    institutionName: "Manual Entry",
    currency: "USD",
    currentBalance: mockAccountBalances[6],
    manualAssetDetails: {
      id: "asset-1",
      accountId: "acc-7",
      userId: MOCK_USER_ID,
      description: "Primary residence - 3br/2ba single family home",
      notes: "Estimated value based on recent comparable sales",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-8",
    userId: MOCK_USER_ID,
    name: "2022 Toyota Camry",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "vehicle",
    category: ACCOUNT_CATEGORIES.VEHICLE,
    isManual: true,
    isActive: true,
    institutionName: "Manual Entry",
    currency: "USD",
    currentBalance: mockAccountBalances[7],
    manualAssetDetails: {
      id: "asset-2",
      accountId: "acc-8",
      userId: MOCK_USER_ID,
      description: "2022 Toyota Camry LE - 4dr sedan",
      notes: "KBB estimated value for good condition",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
];

/**
 * Mock account list items optimized for UI display
 */
export const mockAccountListItems: AccountListItem[] = mockAccounts.map(
  (account): AccountListItem => ({
    id: account.id,
    name: account.name,
    institutionName: account.institutionName,
    type: account.type,
    subtype: account.subtype,
    category: account.category,
    balance: account.currentBalance?.balance || 0,
    isManual: account.isManual,
    isActive: account.isActive,
    mask: account.mask,
    lastUpdated: account.updatedAt,
  })
);

/**
 * Calculate current totals from account balances
 */
const calculateCurrentTotals = () => {
  const currentBalances = mockAccountBalances.filter((bal) => bal.isCurrent);

  let totalAssets = 0;
  let totalLiabilities = 0;

  for (const balance of currentBalances) {
    const account = mockAccounts.find((acc) => acc.id === balance.accountId);
    if (!account) continue;

    const balanceValue = balance.balance || 0;

    // Assets: depository, investment, manual_asset accounts
    if (
      [
        ACCOUNT_TYPES.DEPOSITORY,
        ACCOUNT_TYPES.INVESTMENT,
        ACCOUNT_TYPES.MANUAL_ASSET,
      ].includes(account.type as any)
    ) {
      totalAssets += balanceValue;
    }
    // Liabilities: credit and loan accounts (positive balances represent debt)
    else if (
      [ACCOUNT_TYPES.CREDIT, ACCOUNT_TYPES.LOAN].includes(account.type as any)
    ) {
      totalLiabilities += balanceValue;
    }
  }

  return {
    totalAssets,
    totalLiabilities,
    currentNetWorth: totalAssets - totalLiabilities,
  };
};

const currentTotals = calculateCurrentTotals();

/**
 * Mock net worth summary with realistic calculations (always current)
 */
export const getMockNetWorthSummary = (): NetWorthSummary => ({
  currentNetWorth: currentTotals.currentNetWorth, // Calculated: 525,500
  totalAssets: currentTotals.totalAssets, // Calculated: 543,000
  totalLiabilities: currentTotals.totalLiabilities, // Calculated: 17,500
  lastUpdated: getCurrentDate(), // Always current date/time
  changeFromPrevious: {
    amount: 15500, // Updated to reflect the higher baseline
    percentage: 3.0, // Adjusted percentage
    period: "last month",
  },
});

// Export as static for backwards compatibility, but use function for fresh dates
export const mockNetWorthSummary: NetWorthSummary = getMockNetWorthSummary();

/**
 * Mock dashboard summary cards
 */
export const mockDashboardSummaryCards: DashboardSummaryCard[] = [
  {
    title: "Net Worth",
    value: mockNetWorthSummary.currentNetWorth,
    change: {
      amount: mockNetWorthSummary.changeFromPrevious?.amount || 0,
      percentage: mockNetWorthSummary.changeFromPrevious?.percentage || 0,
      period: mockNetWorthSummary.changeFromPrevious?.period || "last month",
      trend: "up",
    },
    format: "currency",
    icon: "wallet",
  },
  {
    title: "Total Assets",
    value: mockNetWorthSummary.totalAssets,
    format: "currency",
    icon: "trending-up",
  },
  {
    title: "Total Liabilities",
    value: mockNetWorthSummary.totalLiabilities,
    format: "currency",
    icon: "trending-down",
  },
];

/**
 * Calculate asset breakdown by category using dynamic calculations
 */
const calculateAssetBreakdown = () => {
  const assetAccounts = mockAccounts.filter((acc) =>
    [
      ACCOUNT_TYPES.DEPOSITORY,
      ACCOUNT_TYPES.INVESTMENT,
      ACCOUNT_TYPES.MANUAL_ASSET,
    ].includes(acc.type as any)
  );

  return {
    cash: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.CASH)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    investments: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.INVESTMENT)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    property: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.PROPERTY)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    vehicles: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.VEHICLE)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    preciousMetals: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.PRECIOUS_METAL)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    digitalAssets: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.DIGITAL_ASSET)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    other: assetAccounts
      .filter((acc) => acc.category === ACCOUNT_CATEGORIES.OTHER)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  };
};

export const mockAssetBreakdown = calculateAssetBreakdown();

/**
 * Calculate liability breakdown by category using dynamic calculations
 */
const calculateLiabilityBreakdown = () => {
  const liabilityAccounts = mockAccounts.filter((acc) =>
    [
      ACCOUNT_TYPES.CREDIT,
      ACCOUNT_TYPES.LOAN,
      ACCOUNT_TYPES.MANUAL_LIABILITY,
    ].includes(acc.type as any)
  );

  return {
    creditCards: liabilityAccounts
      .filter((acc) => acc.type === ACCOUNT_TYPES.CREDIT)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    mortgages: liabilityAccounts
      .filter(
        (acc) => acc.type === ACCOUNT_TYPES.LOAN && acc.subtype === "mortgage"
      )
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    loans: liabilityAccounts
      .filter(
        (acc) => acc.type === ACCOUNT_TYPES.LOAN && acc.subtype !== "mortgage"
      )
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
    other: liabilityAccounts
      .filter((acc) => acc.type === ACCOUNT_TYPES.MANUAL_LIABILITY)
      .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  };
};

export const mockLiabilityBreakdown = calculateLiabilityBreakdown();

/**
 * Generate realistic historical data with market-like volatility (deterministic)
 */
function generateRealisticHistory(
  startDate: Date,
  endDate: Date,
  granularity: "daily" | "weekly" | "monthly" | "quarterly" = "monthly",
  targetEndNetWorth?: number
) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const msPerWeek = 7 * msPerDay;
  const msPerMonth = 30 * msPerDay;
  const msPerQuarter = 90 * msPerDay;

  const intervalMs = {
    daily: msPerDay,
    weekly: msPerWeek,
    monthly: msPerMonth,
    quarterly: msPerQuarter,
  }[granularity];

  const points = [];
  const totalDuration = endDate.getTime() - startDate.getTime();
  const numPoints = Math.floor(totalDuration / intervalMs);
  
  // Use current totals as target if not specified
  const targetNetWorth = targetEndNetWorth || currentTotals.currentNetWorth;
  const targetAssets = targetNetWorth + currentTotals.totalLiabilities;
  const targetLiabilities = currentTotals.totalLiabilities;

  // Calculate starting values to reach target by end
  const totalGrowthRate = 0.08; // 8% annual growth over the full period
  const periodYears = totalDuration / (365 * msPerDay);
  const startingNetWorth = targetNetWorth / Math.pow(1 + totalGrowthRate, periodYears);
  
  // Market simulation parameters
  const volatility = 0.12; // 12% annual volatility
  const volatilityPerInterval = volatility * Math.sqrt(intervalMs / (365 * msPerDay));

  let currentNetWorth = startingNetWorth;
  let currentAssets = startingNetWorth + targetLiabilities;
  let currentLiabilities = targetLiabilities;

  for (let i = 0; i <= numPoints; i++) {
    const date = new Date(startDate.getTime() + i * intervalMs);
    const progress = i / numPoints; // 0 to 1
    
    // Create seeded random generator for this date point
    const rng = createSeededRandom(date);

    // Calculate target values for this progress point
    const targetProgressNetWorth = startingNetWorth * Math.pow(1 + totalGrowthRate, progress * periodYears);
    
    // Market cycles and seasonality (deterministic)
    const yearProgress = (date.getMonth() + date.getDate() / 30) / 12;
    const marketCycle = Math.sin(yearProgress * 2 * Math.PI) * 0.02; // 2% seasonal variance
    const economicCycle = Math.sin(progress * 4 * Math.PI) * 0.03; // Economic cycles
    
    // Deterministic "random" market movements
    const randomShock = rng.normal(0, volatilityPerInterval * 0.5);
    
    // Smooth progression towards target with variance
    const variance = 1 + marketCycle + economicCycle + randomShock;
    currentNetWorth = targetProgressNetWorth * variance;

    // Assets grow with market + contributions
    const contribution = granularity === "monthly" ? 1000 : 0; // Monthly contributions
    currentAssets = currentNetWorth + currentLiabilities + (contribution * progress);

    // Liabilities change slightly (deterministic)
    if (granularity === "monthly") {
      currentLiabilities *= 0.9995; // Very slight decrease from loan payments
      currentLiabilities += rng.range(-100, 100); // Small credit card fluctuations
      currentLiabilities = Math.max(15000, Math.min(20000, currentLiabilities));
    }

    // Ensure the last point exactly matches our targets
    if (i === numPoints) {
      date.setTime(endDate.getTime()); // Ensure exact end date
      currentNetWorth = targetNetWorth;
      currentAssets = targetAssets;
      currentLiabilities = targetLiabilities;
    }

    points.push({
      date: new Date(date),
      netWorth: Math.round(currentNetWorth),
      totalAssets: Math.round(currentAssets),
      totalLiabilities: Math.round(currentLiabilities),
    });
  }

  return points;
}

/**
 * Get historical data for different time periods and granularities (always current)
 * Generates data relative to current date every time
 */
export function getHistoricalData(
  period: string = "12months",
  granularity: "daily" | "weekly" | "monthly" | "quarterly" = "monthly"
) {
  const periodMap: Record<string, number> = {
    "3months": 90,
    "6months": 180,
    "12months": 365,
    "24months": 730,
    "5years": 1825,
  };

  const days = periodMap[period] || 365;
  const currentDate = getCurrentDate();
  const startDate = getDaysAgo(days);

  return generateRealisticHistory(startDate, currentDate, granularity);
}

/**
 * Mock historical net worth data for charts (default 12 months, always current)
 */
export const getMockNetWorthHistory = () => getHistoricalData("12months", "monthly");

// Export static version for backwards compatibility
export const mockNetWorthHistory = getMockNetWorthHistory();

/**
 * Asset allocation breakdown for portfolio charts using calculated values
 */
const calculateAssetAllocation = () => {
  const breakdown = calculateAssetBreakdown();
  const totalAssets = currentTotals.totalAssets;

  // Map specific account values for more detailed allocation
  const cash = breakdown.cash; // 37,500 (checking + savings)
  const stocks = 68000; // From investment accounts (brokerage portion)
  const bonds = 17000; // From investment accounts (bond portion)
  const realEstate = breakdown.property; // 350,000 (home)
  const vehicles = breakdown.vehicles; // 28,000 (car)
  const retirement = 42500; // IRA portion

  return {
    cash: {
      value: cash,
      percentage: Math.round((cash / totalAssets) * 1000) / 10,
      color: "var(--chart-1)",
    },
    stocks: {
      value: stocks,
      percentage: Math.round((stocks / totalAssets) * 1000) / 10,
      color: "var(--chart-2)",
    },
    bonds: {
      value: bonds,
      percentage: Math.round((bonds / totalAssets) * 1000) / 10,
      color: "var(--chart-3)",
    },
    realEstate: {
      value: realEstate,
      percentage: Math.round((realEstate / totalAssets) * 1000) / 10,
      color: "var(--chart-4)",
    },
    vehicles: {
      value: vehicles,
      percentage: Math.round((vehicles / totalAssets) * 1000) / 10,
      color: "var(--chart-5)",
    },
    retirement: {
      value: retirement,
      percentage: Math.round((retirement / totalAssets) * 1000) / 10,
      color: "var(--chart-6)",
    },
  };
};

export const mockAssetAllocation = calculateAssetAllocation();

/**
 * Get individual asset performance data (always current)
 */
export const getMockAssetPerformance = () => {
  const currentDate = getCurrentDate();
  const startDate = getDaysAgo(365);
  
  return {
    stocks: generateRealisticHistory(startDate, currentDate, "monthly", 68000).map((point) => ({
      ...point,
      assetType: "stocks",
      benchmark: point.netWorth * 0.98, // Slightly underperforming S&P 500
    })),
    bonds: generateRealisticHistory(startDate, currentDate, "monthly", 17000).map((point) => ({
      ...point,
      assetType: "bonds",
      benchmark: point.netWorth * 1.01, // Slightly outperforming bond index
    })),
    realEstate: generateRealisticHistory(startDate, currentDate, "monthly", 350000).map((point) => ({
      ...point,
      assetType: "realEstate",
      benchmark: point.netWorth * 0.97, // Slightly outperforming local market
    })),
    retirement: generateRealisticHistory(startDate, currentDate, "monthly", 42500).map((point) => ({
      ...point,
      assetType: "retirement",
      benchmark: point.netWorth * 0.96, // Conservative retirement portfolio
    })),
    cash: getHistoricalData("12months", "monthly").map((point) => ({
      date: point.date,
      netWorth: Math.round((37500 / currentTotals.currentNetWorth) * point.netWorth),
      totalAssets: Math.round((37500 / currentTotals.currentNetWorth) * point.netWorth),
      totalLiabilities: 0,
      assetType: "cash",
      benchmark: Math.round((37500 / currentTotals.currentNetWorth) * point.netWorth), // Cash doesn't have a benchmark
    })),
  };
};

/**
 * Individual asset performance data (always current, deterministic)
 */
export const mockAssetPerformance = getMockAssetPerformance();

/**
 * Enhanced trend analysis with realistic insights
 */
export const mockTrendAnalysis = {
  monthlyGrowthRate: 2.8,
  yearOverYearGrowth: 15.7,
  volatility: "moderate",
  trend: "upward",
  bestPerformingAsset: "Real Estate",
  worstPerformingAsset: "Cash",
  averageMonthlyContribution: 1000,
  projectedBreakeven: null,
  riskScore: 6.2, // out of 10
  diversificationScore: 8.1, // out of 10
  insights: [
    "Your net worth has grown consistently over the past 12 months",
    "Real estate represents 44% of your portfolio - consider diversifying",
    "Your investment returns are tracking 2% below market benchmarks",
    "Emergency fund covers 3.2 months of expenses - consider increasing to 6 months",
  ],
};

/**
 * Enhanced projections with multiple scenarios based on current net worth
 */
const calculateProjections = () => {
  const baseNetWorth = currentTotals.currentNetWorth; // 525,500

  return {
    conservative: {
      oneYear: Math.round(baseNetWorth * 1.05), // 5% growth
      threeYears: Math.round(baseNetWorth * Math.pow(1.05, 3)), // 5% compound
      fiveYears: Math.round(baseNetWorth * Math.pow(1.05, 5)), // 5% compound
      annualReturn: 0.05,
      riskLevel: "low",
    },
    moderate: {
      oneYear: Math.round(baseNetWorth * 1.08), // 8% growth
      threeYears: Math.round(baseNetWorth * Math.pow(1.08, 3)), // 8% compound
      fiveYears: Math.round(baseNetWorth * Math.pow(1.08, 5)), // 8% compound
      annualReturn: 0.08,
      riskLevel: "medium",
    },
    aggressive: {
      oneYear: Math.round(baseNetWorth * 1.12), // 12% growth
      threeYears: Math.round(baseNetWorth * Math.pow(1.12, 3)), // 12% compound
      fiveYears: Math.round(baseNetWorth * Math.pow(1.12, 5)), // 12% compound
      annualReturn: 0.12,
      riskLevel: "high",
    },
  };
};

export const mockProjections = calculateProjections();

/**
 * Data validation functions to ensure consistency
 */
export function validateDataConsistency() {
  const errors: string[] = [];
  
  // Validate totals match calculations
  const calculatedTotals = calculateCurrentTotals();
  const summaryTotals = mockNetWorthSummary;
  
  if (Math.abs(calculatedTotals.currentNetWorth - summaryTotals.currentNetWorth) > 1) {
    errors.push(`Net worth mismatch: calculated ${calculatedTotals.currentNetWorth}, summary ${summaryTotals.currentNetWorth}`);
  }
  
  if (Math.abs(calculatedTotals.totalAssets - summaryTotals.totalAssets) > 1) {
    errors.push(`Total assets mismatch: calculated ${calculatedTotals.totalAssets}, summary ${summaryTotals.totalAssets}`);
  }
  
  if (Math.abs(calculatedTotals.totalLiabilities - summaryTotals.totalLiabilities) > 1) {
    errors.push(`Total liabilities mismatch: calculated ${calculatedTotals.totalLiabilities}, summary ${summaryTotals.totalLiabilities}`);
  }
  
  // Validate historical data ends with current values
  const lastHistoricalPoint = mockNetWorthHistory[mockNetWorthHistory.length - 1];
  if (Math.abs(lastHistoricalPoint.netWorth - summaryTotals.currentNetWorth) > 1000) {
    errors.push(`Historical data doesn't end at current net worth: ${lastHistoricalPoint.netWorth} vs ${summaryTotals.currentNetWorth}`);
  }
  
  // Validate asset allocation percentages sum to ~100%
  const allocation = mockAssetAllocation;
  const totalPercentage = Object.values(allocation).reduce((sum, item) => sum + item.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 1) {
    errors.push(`Asset allocation percentages don't sum to 100%: ${totalPercentage}%`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    summary: {
      calculatedTotals,
      summaryTotals,
      lastHistoricalPoint,
      totalAllocationPercentage: totalPercentage,
    }
  };
}

/**
 * Get mock data for a specific user (for future API compatibility)
 */
export function getMockUserData(userId: string = MOCK_USER_ID) {
  return {
    accounts: mockAccounts.filter((acc) => acc.userId === userId),
    accountListItems: mockAccountListItems.filter(
      (item) =>
        mockAccounts.find((acc) => acc.id === item.id)?.userId === userId
    ),
    netWorthSummary: mockNetWorthSummary,
    dashboardSummaryCards: mockDashboardSummaryCards,
    assetBreakdown: mockAssetBreakdown,
    liabilityBreakdown: mockLiabilityBreakdown,
    netWorthHistory: mockNetWorthHistory,
    assetAllocation: mockAssetAllocation,
    assetPerformance: mockAssetPerformance,
    trendAnalysis: mockTrendAnalysis,
    projections: mockProjections,
    getHistoricalData,
    getMockNetWorthHistory,
    getMockNetWorthSummary,
    getMockAssetPerformance,
  };
}

/**
 * Default export for easy importing
 */
export default {
  accounts: mockAccounts,
  accountListItems: mockAccountListItems,
  netWorthSummary: mockNetWorthSummary,
  dashboardSummaryCards: mockDashboardSummaryCards,
  assetBreakdown: mockAssetBreakdown,
  liabilityBreakdown: mockLiabilityBreakdown,
  netWorthHistory: mockNetWorthHistory,
  assetAllocation: mockAssetAllocation,
  assetPerformance: mockAssetPerformance,
  trendAnalysis: mockTrendAnalysis,
  projections: mockProjections,
  getHistoricalData,
  getMockNetWorthHistory,
  getMockNetWorthSummary,
  getMockAssetPerformance,
  validateDataConsistency,
  getUserData: getMockUserData,
};
