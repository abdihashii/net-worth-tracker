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
    id: "bal-12",
    accountId: "acc-12",
    balance: 16000,
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
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
  // Solana Wallets - Current Balances
  {
    id: "bal-14",
    accountId: "acc-16",
    balance: 8400, // ~150 SOL at $56/SOL
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-15",
    accountId: "acc-17",
    balance: 25000, // USDC stablecoin holdings
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-16",
    accountId: "acc-18",
    balance: 12000, // DeFi token portfolio (JUP, RAY, ORCA)
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-17",
    accountId: "acc-19",
    balance: 18500, // Blue chip NFT collection (DeGods, y00ts)
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-18",
    accountId: "acc-20",
    balance: 4200, // Memecoin portfolio (BONK, WIF, POPCAT)
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-19",
    accountId: "acc-21",
    balance: 32000, // Gaming ecosystem (ATLAS, Genopets NFTs)
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-20",
    accountId: "acc-22",
    balance: 7800, // Art NFT collection (Mad Lads, Okay Bears)
    date: getCurrentDate(),
    isCurrent: true,
    source: "solana_rpc",
    createdAt: getCurrentDate(),
  },
  {
    id: "bal-21",
    accountId: "acc-23",
    balance: 15600, // Mixed SOL + SPL portfolio
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
    id: "bal-12-monthly",
    accountId: "acc-12",
    balance: 15800, // RWA steady growth
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
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
  // Solana Wallets - One Month Ago (crypto volatility)
  {
    id: "bal-14-monthly",
    accountId: "acc-16",
    balance: 7200, // SOL was ~$48/SOL (150 SOL)
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-15-monthly",
    accountId: "acc-17",
    balance: 25000, // USDC stable
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-16-monthly",
    accountId: "acc-18",
    balance: 9800, // DeFi tokens down
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-17-monthly",
    accountId: "acc-19",
    balance: 21000, // NFTs were higher
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-18-monthly",
    accountId: "acc-20",
    balance: 6800, // Memecoins had rally
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-19-monthly",
    accountId: "acc-21",
    balance: 28000, // Gaming tokens down
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-20-monthly",
    accountId: "acc-22",
    balance: 9200, // Art NFTs higher
    date: oneMonthAgo,
    isCurrent: false,
    source: "solana_rpc",
    createdAt: oneMonthAgo,
  },
  {
    id: "bal-21-monthly",
    accountId: "acc-23",
    balance: 13400, // Mixed portfolio down
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
    id: "acc-12",
    userId: MOCK_USER_ID,
    name: "RWA Tokens",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "spl_token",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-12"),
    solanaWalletDetails: {
      id: "solana-9",
      accountId: "acc-12",
      userId: MOCK_USER_ID,
      address: "5RWAtoken7H9Yk2LfN6xRbQ3w1Z8vT2qM9KdU3cHp4XjV",
      network: "mainnet-beta",
      name: "RWA Token Portfolio",
      description: "Real World Asset SPL tokens: RealT, ONDO, commodities",
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
    currentBalance: mockAccountBalances[10],
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
    currentBalance: mockAccountBalances[11],
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
    currentBalance: mockAccountBalances[12],
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
  // Solana Wallets - Diverse addresses and holdings
  {
    id: "acc-16",
    userId: MOCK_USER_ID,
    name: "SOL Holdings",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-14"),
    solanaWalletDetails: {
      id: "solana-1",
      accountId: "acc-16",
      userId: MOCK_USER_ID,
      address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      network: "mainnet-beta",
      name: "Primary SOL Wallet",
      description: "150 SOL tokens - main Solana holdings",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-17",
    userId: MOCK_USER_ID,
    name: "USDC Stablecoin",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "spl_token",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-15"),
    solanaWalletDetails: {
      id: "solana-2",
      accountId: "acc-17",
      userId: MOCK_USER_ID,
      address: "4YrKGvXs1pNvzAD6ZGhcdJQqZKz1grSvnrDkJp5TH7Ub",
      network: "mainnet-beta",
      name: "USDC Holdings",
      description: "25,000 USDC stablecoin reserves",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-18",
    userId: MOCK_USER_ID,
    name: "DeFi Token Portfolio",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "spl_token",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-16"),
    solanaWalletDetails: {
      id: "solana-3",
      accountId: "acc-18",
      userId: MOCK_USER_ID,
      address: "8sRT1Mc3Tm6xqpqEMmxcuUWP5YZxAT8ZqhHD7KP4TQvB",
      network: "mainnet-beta",
      name: "DeFi Tokens",
      description: "JUP, RAY, ORCA, SRM - DeFi ecosystem tokens",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-19",
    userId: MOCK_USER_ID,
    name: "Blue Chip NFTs",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana_nft",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-17"),
    solanaWalletDetails: {
      id: "solana-4",
      accountId: "acc-19",
      userId: MOCK_USER_ID,
      address: "6ZkHgx4FY8qWdh7PHj3L2C8NBTMH3GFQK5nGzQk9JvYH",
      network: "mainnet-beta",
      name: "Premium NFT Collection",
      description: "DeGods #2847, y00ts #1523, SMB Gen2 #4891",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-20",
    userId: MOCK_USER_ID,
    name: "Memecoin Portfolio",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "spl_token",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-18"),
    solanaWalletDetails: {
      id: "solana-5",
      accountId: "acc-20",
      userId: MOCK_USER_ID,
      address: "3Nv5rLf9nPQQs8F3X7sJ2e1ZKFT5HbY9Q4mhA6pR8vGq",
      network: "mainnet-beta",
      name: "Meme Token Collection",
      description: "BONK, WIF, POPCAT, MYRO - memecoin plays",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-21",
    userId: MOCK_USER_ID,
    name: "Gaming Ecosystem",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana_nft",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-19"),
    solanaWalletDetails: {
      id: "solana-6",
      accountId: "acc-21",
      userId: MOCK_USER_ID,
      address: "7qX8w4E3h9NjKqbYvZHc1R5g6A2sFm9LtKp3Dz8VvYhT",
      network: "mainnet-beta",
      name: "Gaming Assets",
      description: "Star Atlas ships, Genopets #2341, ATLAS tokens",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-22",
    userId: MOCK_USER_ID,
    name: "Art NFT Collection",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana_nft",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-20"),
    solanaWalletDetails: {
      id: "solana-7",
      accountId: "acc-22",
      userId: MOCK_USER_ID,
      address: "2bGH7YfxM9Ck5VzBqPw8T6uR3hJd1eN4LpQ7SxZmK9wF",
      network: "mainnet-beta",
      name: "Digital Art",
      description: "Mad Lads #892, Okay Bears #3456, Famous Fox #1234",
      createdAt: oneYearAgo,
      updatedAt: getCurrentDate(),
    },
    createdAt: oneYearAgo,
    updatedAt: getCurrentDate(),
  },
  {
    id: "acc-23",
    userId: MOCK_USER_ID,
    name: "Mixed Portfolio",
    type: ACCOUNT_TYPES.SOLANA_WALLET,
    subtype: "solana",
    category: ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    isManual: false,
    isActive: true,
    institutionName: "Connected Wallet",
    currency: "USD",
    currentBalance: mockAccountBalances.find((bal) => bal.id === "bal-21"),
    solanaWalletDetails: {
      id: "solana-8",
      accountId: "acc-23",
      userId: MOCK_USER_ID,
      address: "5Xp9W3mBz7Ck2Hq8fG4vR6uY1eT3Nz9LdS2aQxVbKmJh",
      network: "mainnet-beta",
      name: "Diversified Holdings",
      description: "SOL + SPL tokens: USDT, JTO, PYTH, HNT",
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
  const currentDate = getCurrentDate();
  let startDate: Date;
  let days: number;

  // Handle dynamic periods
  switch (period) {
    case "ytd": {
      // Year to date: Jan 1 of current year to today
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      days = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      break;
    }
    case "thisMonth": {
      // Current month: First day of current month to today
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      days = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      break;
    }
    case "lastMonth": {
      // Previous month: Full previous month
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      startDate = lastMonth;
      const endOfLastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days =
        Math.floor(
          (endOfLastMonth.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      break;
    }
    case "lastYear": {
      // Previous year: Full previous year
      startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(currentDate.getFullYear() - 1, 11, 31);
      days =
        Math.floor(
          (endOfLastYear.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      break;
    }
    case "1month":
    case "30days": {
      days = 30;
      startDate = getDaysAgo(days);
      break;
    }
    case "all": {
      // All available data (3 years for demo)
      days = 1095; // 3 years
      startDate = getDaysAgo(days);
      break;
    }
    default: {
      // Use the existing period map for fixed periods
      const periodMap: Record<string, number> = {
        "3months": 90,
        "6months": 180,
        "12months": 365,
        "24months": 730,
        "5years": 1825,
      };
      days = periodMap[period] || 365;
      startDate = getDaysAgo(days);
    }
  }

  // For lastMonth and lastYear, we need to use the appropriate end date
  const endDate =
    period === "lastMonth" || period === "lastYear"
      ? new Date(
          startDate.getFullYear(),
          startDate.getMonth() + (period === "lastYear" ? 12 : 1),
          0
        )
      : currentDate;

  return generateRealisticHistory(startDate, endDate, granularity);
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
    // DeFi SPL Tokens (JUP, RAY, ORCA)
    splTokensDeFi: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      12000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const defiVolatility = rng.normal(0, 0.18); // High volatility for DeFi
      const jupiterCycle = Math.cos((index / 12) * 3 * Math.PI) * 0.15; // Jupiter ecosystem growth

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + defiVolatility + jupiterCycle)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + defiVolatility + jupiterCycle)
        ),
        assetType: "splTokensDeFi",
        benchmark: point.netWorth * 0.92, // DeFi sector benchmark
      };
    }),
    // Stablecoins (USDC, USDT)
    stablecoins: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      25000
    ).map((point) => {
      const rng = createSeededRandom(point.date);
      const stableVolatility = rng.normal(0, 0.005); // Very low volatility

      return {
        ...point,
        netWorth: Math.round(point.netWorth * (1 + stableVolatility)),
        totalAssets: Math.round(point.totalAssets * (1 + stableVolatility)),
        assetType: "stablecoins",
        benchmark: point.netWorth, // No benchmark for stables
      };
    }),
    // Memecoins (BONK, WIF, POPCAT)
    memecoins: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      4200
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const memeVolatility = rng.normal(0, 0.35); // Extreme volatility
      const viralCycles = index % 2 === 0 ? 0.5 : -0.2; // Viral pump/dump cycles

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + memeVolatility + viralCycles)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + memeVolatility + viralCycles)
        ),
        assetType: "memecoins",
        benchmark: point.netWorth * 0.75, // Very speculative benchmark
      };
    }),
    // Blue Chip NFTs (DeGods, y00ts)
    blueChipNFTs: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      18500
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const blueChipVolatility = rng.normal(0, 0.25); // High but less extreme than other NFTs
      const utilityAdoption = Math.log(index + 2) * 0.02; // Gradual utility increase

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + blueChipVolatility + utilityAdoption)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + blueChipVolatility + utilityAdoption)
        ),
        assetType: "blueChipNFTs",
        benchmark: point.netWorth * 0.85, // Blue chip NFT sector
      };
    }),
    // Gaming NFTs (Star Atlas, Genopets)
    gamingNFTs: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      32000
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const gamingVolatility = rng.normal(0, 0.28); // Gaming sector volatility
      const metaverseTrends = Math.sin((index / 12) * 4 * Math.PI) * 0.12; // Gaming hype cycles

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + gamingVolatility + metaverseTrends)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + gamingVolatility + metaverseTrends)
        ),
        assetType: "gamingNFTs",
        benchmark: point.netWorth * 0.78, // Gaming NFT sector
      };
    }),
    // Art NFTs (Mad Lads, Okay Bears)
    artNFTs: generateRealisticHistory(
      startDate,
      currentDate,
      "monthly",
      7800
    ).map((point, index) => {
      const rng = createSeededRandom(point.date);
      const artVolatility = rng.normal(0, 0.32); // Art market volatility
      const culturalTrends = index % 4 === 0 ? 0.2 : -0.05; // Cultural adoption waves

      return {
        ...point,
        netWorth: Math.round(
          point.netWorth * (1 + artVolatility + culturalTrends)
        ),
        totalAssets: Math.round(
          point.totalAssets * (1 + artVolatility + culturalTrends)
        ),
        assetType: "artNFTs",
        benchmark: point.netWorth * 0.82, // Digital art market
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
  monthlyGrowthRate: 3.2,
  yearOverYearGrowth: 18.4,
  volatility: "high",
  trend: "upward",
  bestPerformingAsset: "Gaming NFTs",
  worstPerformingAsset: "Stablecoins",
  averageMonthlyContribution: 1000,
  projectedBreakeven: null,
  riskScore: 7.8, // out of 10 (higher due to crypto exposure)
  diversificationScore: 8.6, // out of 10 (good spread across asset types)
  insights: [
    "Your Solana ecosystem investments have outperformed traditional assets",
    "DeFi tokens show strong correlation with Jupiter ecosystem growth",
    "Gaming NFTs are your highest-performing asset class with 45% gains",
    "Consider taking profits from memecoin positions - they're up 180%",
    "Stablecoin reserves provide good stability anchor for volatile crypto portfolio",
    "Your Solana wallet diversification reduces single-point-of-failure risk",
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
/**
 * Mock Solana token metadata for realistic SPL token holdings
 */
export const mockSolanaTokens = {
  // Stablecoins
  USDC: {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    currentPrice: 1.0,
    priceChange24h: 0.001,
  },
  USDT: {
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    currentPrice: 0.999,
    priceChange24h: -0.002,
  },
  // DeFi Tokens
  JUP: {
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    decimals: 6,
    logoUri: "https://static.jup.ag/jup/icon.png",
    currentPrice: 0.78,
    priceChange24h: 5.2,
  },
  RAY: {
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
    name: "Raydium",
    decimals: 6,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
    currentPrice: 1.85,
    priceChange24h: -2.1,
  },
  ORCA: {
    mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    symbol: "ORCA",
    name: "Orca",
    decimals: 6,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
    currentPrice: 3.45,
    priceChange24h: 8.7,
  },
  // Memecoins
  BONK: {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    decimals: 5,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
    currentPrice: 0.000024,
    priceChange24h: 12.3,
  },
  WIF: {
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    symbol: "WIF",
    name: "dogwifhat",
    decimals: 6,
    logoUri:
      "https://bafkreibk3covs5ltyqxa272mpgm22kv4c2pklxtcnw7m7ba7w6lqscn3c4.ipfs.dweb.link/",
    currentPrice: 1.92,
    priceChange24h: -5.4,
  },
  POPCAT: {
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    symbol: "POPCAT",
    name: "Popcat",
    decimals: 9,
    logoUri:
      "https://assets.coingecko.com/coins/images/30419/standard/popcat.png",
    currentPrice: 0.86,
    priceChange24h: 18.5,
  },
  // Gaming
  ATLAS: {
    mint: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
    symbol: "ATLAS",
    name: "Star Atlas",
    decimals: 8,
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx/logo.png",
    currentPrice: 0.0034,
    priceChange24h: -1.2,
  },
  // Real World Assets (RWA)
  REALT: {
    mint: "ReALT7kKz2LfN6xPvQ8E3bT9qMKjCUsXm3VYNtHs9wF",
    symbol: "REALT",
    name: "RealT Token",
    decimals: 6,
    logoUri: "https://realt.co/images/realt-token-logo.png",
    currentPrice: 1.02,
    priceChange24h: 0.5,
  },
  ONDO: {
    mint: "OnDo5rKz7LfN6xPvQ8E3bT9qMKjCUsXm3VYNtHs9wF",
    symbol: "ONDO",
    name: "Ondo Finance",
    decimals: 6,
    logoUri: "https://ondo.finance/images/ondo-logo.png",
    currentPrice: 0.95,
    priceChange24h: 1.2,
  },
  GOLD: {
    mint: "GoLD7kKz2LfN6xPvQ8E3bT9qMKjCUsXm3VYNtHs9wF",
    symbol: "GOLD",
    name: "Tokenized Gold",
    decimals: 8,
    logoUri: "https://paxos.com/images/paxg-logo.png",
    currentPrice: 2045.5,
    priceChange24h: -0.3,
  },
};

/**
 * Mock Solana NFT collections with realistic floor prices and metadata
 */
export const mockSolanaNFTs = {
  // Blue Chip Collections
  DeGods: {
    collectionId: "degods",
    name: "DeGods",
    symbol: "DEGODS",
    floorPrice: 14.5, // SOL
    totalSupply: 10000,
    verified: true,
    image:
      "https://creator-hub-prod.s3.us-east-2.amazonaws.com/degods_pfp_1656558927467.png",
    description:
      "DeGods is a digital art collection and global community of creators, builders, and makers.",
  },
  y00ts: {
    collectionId: "y00ts",
    name: "y00ts",
    symbol: "Y00TS",
    floorPrice: 8.2, // SOL
    totalSupply: 15000,
    verified: true,
    image:
      "https://creator-hub-prod.s3.us-east-2.amazonaws.com/y00ts_pfp_1660349505032.gif",
    description:
      "y00ts is a generative art project and community DAO on Solana.",
  },
  // Art Collections
  MadLads: {
    collectionId: "madlads",
    name: "Mad Lads",
    symbol: "MADLADS",
    floorPrice: 25.8, // SOL
    totalSupply: 10000,
    verified: true,
    image: "https://madlads.s3.us-west-2.amazonaws.com/images/1.png",
    description: "Mad Lads by Coral Cube - a collection of 10,000 Mad Lads.",
  },
  OkayBears: {
    collectionId: "okaybears",
    name: "Okay Bears",
    symbol: "OKAYBEARS",
    floorPrice: 4.1, // SOL
    totalSupply: 10000,
    verified: true,
    image:
      "https://bafybeihvvuqhdpjpsrxstnyj7rlcvzrjsfywwpuqovbcxdpra5nh6dwyc4.ipfs.dweb.link/6999.png",
    description: "Okay Bears is a culture club for the grown and sexy.",
  },
  // Gaming NFTs
  StarAtlas: {
    collectionId: "staratlas",
    name: "Star Atlas Ships",
    symbol: "STASHIPS",
    floorPrice: 12.3, // SOL
    totalSupply: 22500,
    verified: true,
    image:
      "https://storage.googleapis.com/fractal-launchpad-public-assets/staratlas/Pearce_C11.png",
    description: "Spaceships from the Star Atlas metaverse gaming ecosystem.",
  },
  Genopets: {
    collectionId: "genopets",
    name: "Genopets",
    symbol: "GENOPETS",
    floorPrice: 3.7, // SOL
    totalSupply: 3333,
    verified: true,
    image:
      "https://www.arweave.net/7u4xMpJhZaQZS3uKNP8UQ8gLa6Q6W2UQH3W8Q7kZ6y8",
    description:
      "Genopets are evolving NFT creatures that level up through daily activity.",
  },
};

/**
 * Calculate detailed token holdings for each wallet
 */
export const mockSolanaTokenHoldings = {
  // USDC Wallet (acc-15)
  "4YrKGvXs1pNvzAD6ZGhcdJQqZKz1grSvnrDkJp5TH7Ub": [
    { token: mockSolanaTokens.USDC, amount: 25000, value: 25000 },
  ],
  // DeFi Portfolio (acc-16)
  "8sRT1Mc3Tm6xqpqEMmxcuUWP5YZxAT8ZqhHD7KP4TQvB": [
    { token: mockSolanaTokens.JUP, amount: 5000, value: 3900 },
    { token: mockSolanaTokens.RAY, amount: 2500, value: 4625 },
    { token: mockSolanaTokens.ORCA, amount: 1000, value: 3450 },
  ],
  // Memecoin Portfolio (acc-18)
  "3Nv5rLf9nPQQs8F3X7sJ2e1ZKFT5HbY9Q4mhA6pR8vGq": [
    { token: mockSolanaTokens.BONK, amount: 50000000, value: 1200 },
    { token: mockSolanaTokens.WIF, amount: 800, value: 1536 },
    { token: mockSolanaTokens.POPCAT, amount: 1600, value: 1376 },
  ],
  // Mixed Portfolio (acc-21)
  "5Xp9W3mBz7Ck2Hq8fG4vR6uY1eT3Nz9LdS2aQxVbKmJh": [
    { token: mockSolanaTokens.USDT, amount: 8000, value: 7992 },
    { token: mockSolanaTokens.ATLAS, amount: 1000000, value: 3400 },
    { token: mockSolanaTokens.JUP, amount: 2000, value: 1560 },
  ],
  // RWA Token Portfolio (acc-12)
  "5RWAtoken7H9Yk2LfN6xRbQ3w1Z8vT2qM9KdU3cHp4XjV": [
    { token: mockSolanaTokens.REALT, amount: 9800, value: 9996 }, // ~60% real estate
    { token: mockSolanaTokens.ONDO, amount: 4200, value: 3990 }, // ~25% structured products
    { token: mockSolanaTokens.GOLD, amount: 1, value: 2045 }, // ~15% tokenized gold
  ],
};

/**
 * Calculate detailed NFT holdings for each wallet
 */
export const mockSolanaNFTHoldings = {
  // Blue Chip NFTs (acc-17)
  "6ZkHgx4FY8qWdh7PHj3L2C8NBTMH3GFQK5nGzQk9JvYH": [
    {
      collection: mockSolanaNFTs.DeGods,
      tokenId: "2847",
      name: "DeGods #2847",
      image:
        "https://creator-hub-prod.s3.us-east-2.amazonaws.com/degods_pfp_1656558927467.png",
      value: 14.5 * 56, // floor price * SOL price
      attributes: [
        { trait_type: "Background", value: "Orange" },
        { trait_type: "Clothing", value: "Turtleneck" },
        { trait_type: "Skin", value: "Light" },
      ],
    },
    {
      collection: mockSolanaNFTs.y00ts,
      tokenId: "1523",
      name: "y00ts #1523",
      image:
        "https://creator-hub-prod.s3.us-east-2.amazonaws.com/y00ts_pfp_1660349505032.gif",
      value: 8.2 * 56,
      attributes: [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Clothing", value: "Hoodie" },
        { trait_type: "Eyes", value: "Sleepy" },
      ],
    },
  ],
  // Gaming NFTs (acc-19)
  "7qX8w4E3h9NjKqbYvZHc1R5g6A2sFm9LtKp3Dz8VvYhT": [
    {
      collection: mockSolanaNFTs.StarAtlas,
      tokenId: "starship-001",
      name: "Pearce C11 Medium Fighter",
      image:
        "https://storage.googleapis.com/fractal-launchpad-public-assets/staratlas/Pearce_C11.png",
      value: 12.3 * 56,
      attributes: [
        { trait_type: "Class", value: "Fighter" },
        { trait_type: "Size", value: "Medium" },
        { trait_type: "Faction", value: "MUD Territory" },
      ],
    },
    {
      collection: mockSolanaNFTs.Genopets,
      tokenId: "2341",
      name: "Genopets #2341",
      image:
        "https://www.arweave.net/7u4xMpJhZaQZS3uKNP8UQ8gLa6Q6W2UQH3W8Q7kZ6y8",
      value: 3.7 * 56,
      attributes: [
        { trait_type: "Type", value: "Fire" },
        { trait_type: "Stage", value: "Adult" },
        { trait_type: "Rarity", value: "Rare" },
      ],
    },
  ],
  // Art NFTs (acc-20)
  "2bGH7YfxM9Ck5VzBqPw8T6uR3hJd1eN4LpQ7SxZmK9wF": [
    {
      collection: mockSolanaNFTs.MadLads,
      tokenId: "892",
      name: "Mad Lads #892",
      image: "https://madlads.s3.us-west-2.amazonaws.com/images/892.png",
      value: 25.8 * 56,
      attributes: [
        { trait_type: "Background", value: "Purple" },
        { trait_type: "Body", value: "Robot" },
        { trait_type: "Eyes", value: "Laser" },
      ],
    },
    {
      collection: mockSolanaNFTs.OkayBears,
      tokenId: "3456",
      name: "Okay Bears #3456",
      image:
        "https://bafybeihvvuqhdpjpsrxstnyj7rlcvzrjsfywwpuqovbcxdpra5nh6dwyc4.ipfs.dweb.link/3456.png",
      value: 4.1 * 56,
      attributes: [
        { trait_type: "Background", value: "Pink" },
        { trait_type: "Clothing", value: "Tuxedo" },
        { trait_type: "Expression", value: "Cool" },
      ],
    },
  ],
};

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
  solanaTokens: mockSolanaTokens,
  solanaNFTs: mockSolanaNFTs,
  solanaTokenHoldings: mockSolanaTokenHoldings,
  solanaNFTHoldings: mockSolanaNFTHoldings,
  getHistoricalData,
  getMockNetWorthHistory,
  getMockNetWorthSummary,
  getMockAssetPerformance,
  validateDataConsistency,
  getUserData: getMockUserData,
};
