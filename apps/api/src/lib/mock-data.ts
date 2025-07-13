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
const getDaysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

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
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32;
    return this.seed / 2 ** 32;
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
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
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
  // Digital Assets - Current Balances
  {
    id: "bal-9",
    accountId: "acc-9",
    balance: 25000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-10",
    accountId: "acc-10",
    balance: 15000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-11",
    accountId: "acc-11",
    balance: 11000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-12",
    accountId: "acc-12",
    balance: 16000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  // Precious Metals - Current Balances
  {
    id: "bal-13",
    accountId: "acc-13",
    balance: 20000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-14",
    accountId: "acc-14",
    balance: 8000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-15",
    accountId: "acc-15",
    balance: 20000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "manual",
    createdAt: getCurrentDate(),
  },
  // Solana Wallet - Current Balances
  {
    id: "bal-16",
    accountId: "acc-16",
    balance: 12000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-17",
    accountId: "acc-17",
    balance: 8500,
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-18",
    accountId: "acc-18",
    balance: 15000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
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
  // Digital Assets - One Month Ago (higher volatility)
  {
    id: "bal-9-monthly",
    accountId: "acc-9",
    balance: 22000, // Bitcoin was lower
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-10-monthly",
    accountId: "acc-10",
    balance: 13500, // Ethereum was lower
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-11-monthly",
    accountId: "acc-11",
    balance: 8000, // NFTs had a surge
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-12-monthly",
    accountId: "acc-12",
    balance: 15800, // RWA steady growth
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  // Precious Metals - One Month Ago (stable)
  {
    id: "bal-13-monthly",
    accountId: "acc-13",
    balance: 19500, // Gold slight appreciation
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-14-monthly",
    accountId: "acc-14",
    balance: 7800, // Silver slight appreciation
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-15-monthly",
    accountId: "acc-15",
    balance: 19600, // PM ETFs tracking spot
    date: oneMonthAgo,
    isCurrent: false,
    source: "manual",
    createdAt: oneMonthAgo,
  },
  // Solana Wallet - One Month Ago (higher volatility)
  {
    id: "bal-16-monthly",
    accountId: "acc-16",
    balance: 10500, // SOL was lower
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-17-monthly",
    accountId: "acc-17",
    balance: 7200, // SPL tokens varied
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-18-monthly",
    accountId: "acc-18",
    balance: 18000, // NFTs had different values
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
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
  // Digital Assets
  {
    id: "acc-9",
    userId: MOCK_USER_ID,
    name: "Bitcoin Holdings",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "bitcoin",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: true,
    isActive: true,
    institutionName: "Coinbase Pro",
    currency: "USD",
    currentBalance: mockAccountBalances[8],
    manualAssetDetails: {
      id: "asset-3",
      accountId: "acc-9",
      userId: MOCK_USER_ID,
      description: "Bitcoin (BTC) - 0.58 BTC @ ~$43,000",
      notes: "Primary cryptocurrency holding, long-term store of value",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-10",
    userId: MOCK_USER_ID,
    name: "Ethereum Holdings",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "ethereum",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: true,
    isActive: true,
    institutionName: "Coinbase Pro",
    currency: "USD",
    currentBalance: mockAccountBalances[9],
    manualAssetDetails: {
      id: "asset-4",
      accountId: "acc-10",
      userId: MOCK_USER_ID,
      description: "Ethereum (ETH) - 6.2 ETH @ ~$2,420",
      notes: "Smart contract platform, DeFi ecosystem exposure",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-11",
    userId: MOCK_USER_ID,
    name: "NFT Collection",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "nft",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: true,
    isActive: true,
    institutionName: "OpenSea",
    currency: "USD",
    currentBalance: mockAccountBalances[10],
    manualAssetDetails: {
      id: "asset-5",
      accountId: "acc-11",
      userId: MOCK_USER_ID,
      description: "Digital art & utility NFTs - 8 pieces",
      notes: "Blue-chip: CryptoPunks, Bored Apes; Utility: Gaming assets",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-12",
    userId: MOCK_USER_ID,
    name: "RWA Tokens",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "rwa",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: true,
    isActive: true,
    institutionName: "RealT / Ondo",
    currency: "USD",
    currentBalance: mockAccountBalances[11],
    manualAssetDetails: {
      id: "asset-6",
      accountId: "acc-12",
      userId: MOCK_USER_ID,
      description: "Real World Asset tokens - Property & Commodities",
      notes: "Tokenized real estate (60%) + gold-backed tokens (40%)",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  // Precious Metals
  {
    id: "acc-13",
    userId: MOCK_USER_ID,
    name: "Physical Gold",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "gold",
    category: ACCOUNT_CATEGORIES.PRECIOUS_METAL,
    isManual: true,
    isActive: true,
    institutionName: "APMEX Vault",
    currency: "USD",
    currentBalance: mockAccountBalances[12],
    manualAssetDetails: {
      id: "asset-7",
      accountId: "acc-13",
      userId: MOCK_USER_ID,
      description: "Physical gold - coins & bars (~10 oz)",
      notes: "American Eagles, Canadian Maples, 1oz bars",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-14",
    userId: MOCK_USER_ID,
    name: "Silver Bullion",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "silver",
    category: ACCOUNT_CATEGORIES.PRECIOUS_METAL,
    isManual: true,
    isActive: true,
    institutionName: "Local Coin Shop",
    currency: "USD",
    currentBalance: mockAccountBalances[13],
    manualAssetDetails: {
      id: "asset-8",
      accountId: "acc-14",
      userId: MOCK_USER_ID,
      description: "Physical silver - mostly coins (~320 oz)",
      notes: "American Silver Eagles, junk silver quarters",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-15",
    userId: MOCK_USER_ID,
    name: "Precious Metal ETFs",
    type: ACCOUNT_TYPES.MANUAL_ASSET,
    subtype: "etf",
    category: ACCOUNT_CATEGORIES.PRECIOUS_METAL,
    isManual: true,
    isActive: true,
    institutionName: "Schwab Brokerage",
    currency: "USD",
    currentBalance: mockAccountBalances[14],
    manualAssetDetails: {
      id: "asset-9",
      accountId: "acc-15",
      userId: MOCK_USER_ID,
      description: "Gold & Silver ETFs - GLD, SLV, IAUM",
      notes: "Liquid precious metals exposure, easier to trade",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  // Solana Wallets
  {
    id: "acc-16",
    userId: MOCK_USER_ID,
    name: "Main Solana Wallet",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Phantom Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-16"),
    solanaWalletDetails: {
      id: "solana-1",
      accountId: "acc-16",
      userId: MOCK_USER_ID,
      address: "7B9HMsT9R5oeJfqVKVfAnwPzFWUo8MzLr9Y6k2z9vF3Q",
      network: "mainnet-beta",
      name: "Main Wallet",
      description: "Primary Solana wallet with SOL and various tokens",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-17",
    userId: MOCK_USER_ID,
    name: "USDC Holdings",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "spl_token",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Phantom Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-17"),
    solanaWalletDetails: {
      id: "solana-2",
      accountId: "acc-17",
      userId: MOCK_USER_ID,
      address: "7B9HMsT9R5oeJfqVKVfAnwPzFWUo8MzLr9Y6k2z9vF3Q",
      network: "mainnet-beta",
      name: "USDC Token Account",
      description: "USD Coin (USDC) SPL token holdings",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-18",
    userId: MOCK_USER_ID,
    name: "Solana NFT Collection",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana_nft",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Magic Eden",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-18"),
    solanaWalletDetails: {
      id: "solana-3",
      accountId: "acc-18",
      userId: MOCK_USER_ID,
      address: "7B9HMsT9R5oeJfqVKVfAnwPzFWUo8MzLr9Y6k2z9vF3Q",
      network: "mainnet-beta",
      name: "NFT Collection",
      description:
        "Various Solana NFTs including DeGods, y00ts, and art pieces",
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
  const startingNetWorth =
    targetNetWorth / Math.pow(1 + totalGrowthRate, periodYears);

  // Market simulation parameters
  const volatility = 0.12; // 12% annual volatility
  const volatilityPerInterval =
    volatility * Math.sqrt(intervalMs / (365 * msPerDay));

  let currentNetWorth = startingNetWorth;
  let currentAssets = startingNetWorth + targetLiabilities;
  let currentLiabilities = targetLiabilities;

  for (let i = 0; i <= numPoints; i++) {
    const date = new Date(startDate.getTime() + i * intervalMs);
    const progress = i / numPoints; // 0 to 1

    // Create seeded random generator for this date point
    const rng = createSeededRandom(date);

    // Calculate target values for this progress point
    const targetProgressNetWorth =
      startingNetWorth * Math.pow(1 + totalGrowthRate, progress * periodYears);

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
    currentAssets =
      currentNetWorth + currentLiabilities + contribution * progress;

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
export const getMockNetWorthHistory = () =>
  getHistoricalData("12months", "monthly");

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
  const digitalAssets = breakdown.digitalAssets; // 67,000 (crypto + NFTs + RWA)
  const preciousMetals = breakdown.preciousMetals; // 48,000 (gold + silver + ETFs)

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
    digitalAssets: {
      value: digitalAssets,
      percentage: Math.round((digitalAssets / totalAssets) * 1000) / 10,
      color: "var(--chart-7)",
    },
    preciousMetals: {
      value: preciousMetals,
      percentage: Math.round((preciousMetals / totalAssets) * 1000) / 10,
      color: "var(--chart-8)",
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
    stocks: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      68000
    ).map((point) => ({
      ...point,
      assetType: "stocks",
      benchmark: point.netWorth * 0.98, // Slightly underperforming S&P 500
    })),
    bonds: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      17000
    ).map((point) => ({
      ...point,
      assetType: "bonds",
      benchmark: point.netWorth * 1.01, // Slightly outperforming bond index
    })),
    realEstate: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      350000
    ).map((point) => ({
      ...point,
      assetType: "realEstate",
      benchmark: point.netWorth * 0.97, // Slightly outperforming local market
    })),
    retirement: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      42500
    ).map((point) => ({
      ...point,
      assetType: "retirement",
      benchmark: point.netWorth * 0.96, // Conservative retirement portfolio
    })),
    cash: getHistoricalData("12months", "monthly").map((point) => ({
      date: point.date,
      netWorth: Math.round(
        (37500 / currentTotals.currentNetWorth) * point.netWorth
      ),
      totalAssets: Math.round(
        (37500 / currentTotals.currentNetWorth) * point.netWorth
      ),
      totalLiabilities: 0,
      assetType: "cash",
      benchmark: Math.round(
        (37500 / currentTotals.currentNetWorth) * point.netWorth
      ), // Cash doesn't have a benchmark
    })),
    bitcoin: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      25000
    ).map((point, index) => {
      // Bitcoin has higher volatility and different patterns
      const rng = createSeededRandom(point.date);
      const extraVolatility = rng.normal(0, 0.15); // Extra 15% volatility for crypto
      const cryptoWinter = Math.sin((index / 12) * 2 * Math.PI) * 0.1; // Crypto cycles

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + extraVolatility + cryptoWinter)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + extraVolatility + cryptoWinter)
        ),
        assetType: "bitcoin",
        benchmark: point.netWorth * 0.95, // Benchmark vs crypto index
      };
    }),
    ethereum: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      15000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const extraVolatility = rng.normal(0, 0.18); // Even higher volatility for ETH
      const defiCycle = Math.cos((index / 12) * 3 * Math.PI) * 0.08; // DeFi boom/bust cycles

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + extraVolatility + defiCycle)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + extraVolatility + defiCycle)
        ),
        assetType: "ethereum",
        benchmark: point.netWorth * 0.92, // More volatile than BTC
      };
    }),
    nfts: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      11000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const extremeVolatility = rng.normal(0, 0.25); // Extreme volatility for NFTs
      const hypeBooms = index % 4 === 0 ? 0.3 : 0; // Occasional hype booms

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + extremeVolatility + hypeBooms)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + extremeVolatility + hypeBooms)
        ),
        assetType: "nfts",
        benchmark: point.netWorth * 0.85, // Very speculative
      };
    }),
    gold: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      20000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const safeHavenFlight = Math.sin((index / 12) * Math.PI) * 0.05; // Flight to safety cycles
      const inflationHedge = rng.normal(0, 0.08); // Lower volatility, inflation hedge

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + inflationHedge + safeHavenFlight)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + inflationHedge + safeHavenFlight)
        ),
        assetType: "gold",
        benchmark: point.netWorth * 1.02, // Slight outperformance vs inflation
      };
    }),
    silver: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      8000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const industrialDemand = Math.cos((index / 12) * 2 * Math.PI) * 0.06; // Industrial cycles
      const volatility = rng.normal(0, 0.12); // Higher volatility than gold

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + volatility + industrialDemand)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + volatility + industrialDemand)
        ),
        assetType: "silver",
        benchmark: point.netWorth * 0.98, // Slightly underperforms gold
      };
    }),
    solana: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      12000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const extremeVolatility = rng.normal(0, 0.2); // High volatility for SOL
      const ecosystemGrowth = Math.cos((index / 12) * 1.5 * Math.PI) * 0.12; // Ecosystem cycles

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + extremeVolatility + ecosystemGrowth)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + extremeVolatility + ecosystemGrowth)
        ),
        assetType: "solana",
        benchmark: point.netWorth * 0.9, // More volatile than BTC
      };
    }),
    splTokens: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      8500
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const tokenVolatility = rng.normal(0, 0.15); // Moderate volatility for SPL tokens
      const defiCycles = Math.sin((index / 12) * 2.5 * Math.PI) * 0.08;

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + tokenVolatility + defiCycles)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + tokenVolatility + defiCycles)
        ),
        assetType: "splTokens",
        benchmark: point.netWorth * 0.94, // Tracking various SPL token indices
      };
    }),
    solanaNFTs: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      15000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const nftVolatility = rng.normal(0, 0.3); // Extreme volatility for NFTs
      const hypeCycles = index % 3 === 0 ? 0.25 : 0; // Occasional hype spikes

      return {
        ...point,
        netWorth: Math.round(point.netWorth * (1 + nftVolatility + hypeCycles)),
        totalAssets: Math.round(
          point.totalAssets * (1 + nftVolatility + hypeCycles)
        ),
        assetType: "solanaNFTs",
        benchmark: point.netWorth * 0.8, // Very speculative asset class
      };
    }),
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

  if (
    Math.abs(calculatedTotals.currentNetWorth - summaryTotals.currentNetWorth) >
    1
  ) {
    errors.push(
      `Net worth mismatch: calculated ${calculatedTotals.currentNetWorth}, summary ${summaryTotals.currentNetWorth}`
    );
  }

  if (Math.abs(calculatedTotals.totalAssets - summaryTotals.totalAssets) > 1) {
    errors.push(
      `Total assets mismatch: calculated ${calculatedTotals.totalAssets}, summary ${summaryTotals.totalAssets}`
    );
  }

  if (
    Math.abs(
      calculatedTotals.totalLiabilities - summaryTotals.totalLiabilities
    ) > 1
  ) {
    errors.push(
      `Total liabilities mismatch: calculated ${calculatedTotals.totalLiabilities}, summary ${summaryTotals.totalLiabilities}`
    );
  }

  // Validate historical data ends with current values
  const lastHistoricalPoint =
    mockNetWorthHistory[mockNetWorthHistory.length - 1];
  if (
    Math.abs(lastHistoricalPoint.netWorth - summaryTotals.currentNetWorth) >
    1000
  ) {
    errors.push(
      `Historical data doesn't end at current net worth: ${lastHistoricalPoint.netWorth} vs ${summaryTotals.currentNetWorth}`
    );
  }

  // Validate asset allocation percentages sum to ~100%
  const allocation = mockAssetAllocation;
  const totalPercentage = Object.values(allocation).reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  if (Math.abs(totalPercentage - 100) > 1) {
    errors.push(
      `Asset allocation percentages don't sum to 100%: ${totalPercentage}%`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    summary: {
      calculatedTotals,
      summaryTotals,
      lastHistoricalPoint,
      totalAllocationPercentage: totalPercentage,
    },
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
