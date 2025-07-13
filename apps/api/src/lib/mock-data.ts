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

// Base dates for realistic data
const now = new Date();
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

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
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-2",
    accountId: "acc-2",
    balance: 25000,
    availableBalance: 25000,
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-3",
    accountId: "acc-3",
    balance: 85000,
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-4",
    accountId: "acc-4",
    balance: 42500,
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-5",
    accountId: "acc-5",
    balance: 2500,
    limit: 15000,
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-6",
    accountId: "acc-6",
    balance: 15000,
    date: now,
    isCurrent: true,
    source: "plaid",
    createdAt: now,
  },
  {
    id: "bal-7",
    accountId: "acc-7",
    balance: 350000,
    date: now,
    isCurrent: true,
    source: "manual",
    createdAt: now,
  },
  {
    id: "bal-8",
    accountId: "acc-8",
    balance: 28000,
    date: now,
    isCurrent: true,
    source: "manual",
    createdAt: now,
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
    updatedAt: now,
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
    updatedAt: now,
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
    updatedAt: now,
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
    updatedAt: now,
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
    updatedAt: now,
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
    updatedAt: now,
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
      updatedAt: now,
    },
    createdAt: oneYearAgo,
    updatedAt: now,
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
      updatedAt: now,
    },
    createdAt: oneYearAgo,
    updatedAt: now,
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
 * Mock net worth summary with realistic calculations
 */
export const mockNetWorthSummary: NetWorthSummary = {
  currentNetWorth: 490000, // Total assets - liabilities
  totalAssets: 507500, // Sum of all assets
  totalLiabilities: 17500, // Sum of all liabilities
  lastUpdated: now,
  changeFromPrevious: {
    amount: 12500,
    percentage: 2.6,
    period: "last month",
  },
};

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
 * Calculate asset breakdown by category
 */
export const mockAssetBreakdown = {
  cash: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.CASH)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  investments: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.INVESTMENT)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  property: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.PROPERTY)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  vehicles: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.VEHICLE)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  preciousMetals: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.PRECIOUS_METAL)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  digitalAssets: mockAccounts
    .filter((acc) => acc.category === ACCOUNT_CATEGORIES.DIGITAL_ASSET)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  other: mockAccounts
    .filter(
      (acc) =>
        acc.category === ACCOUNT_CATEGORIES.OTHER &&
        [
          ACCOUNT_TYPES.MANUAL_ASSET,
          ACCOUNT_TYPES.DEPOSITORY,
          ACCOUNT_TYPES.INVESTMENT,
        ].includes(acc.type as any)
    )
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
};

/**
 * Calculate liability breakdown by category
 */
export const mockLiabilityBreakdown = {
  creditCards: mockAccounts
    .filter((acc) => acc.type === ACCOUNT_TYPES.CREDIT)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  mortgages: mockAccounts
    .filter(
      (acc) => acc.type === ACCOUNT_TYPES.LOAN && acc.subtype === "mortgage"
    )
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  loans: mockAccounts
    .filter(
      (acc) => acc.type === ACCOUNT_TYPES.LOAN && acc.subtype !== "mortgage"
    )
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
  other: mockAccounts
    .filter((acc) => acc.type === ACCOUNT_TYPES.MANUAL_LIABILITY)
    .reduce((sum, acc) => sum + (acc.currentBalance?.balance || 0), 0),
};

/**
 * Mock historical net worth data for charts
 */
export const mockNetWorthHistory = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(now.getTime() - (11 - i) * 30 * 24 * 60 * 60 * 1000);
  const baseNetWorth = 465000; // Base net worth from 11 months ago
  const growth = i * 2500; // Steady growth over time
  const variance = Math.sin(i * 0.5) * 5000; // Some realistic variance

  return {
    date,
    netWorth: baseNetWorth + growth + variance,
    totalAssets: baseNetWorth + growth + variance + 17500,
    totalLiabilities: 17500,
  };
});

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
  getUserData: getMockUserData,
};
