/**
 * Account-related types for financial accounts and manual assets
 */

/** Account type classification */
export type AccountType =
  | "depository" // Bank accounts
  | "investment" // Investment accounts
  | "loan" // Loan accounts
  | "credit" // Credit card accounts
  | "manual_asset" // Manually added assets
  | "manual_liability"; // Manually added liabilities

/** Account category for net worth breakdown */
export type AccountCategory =
  | "cash"
  | "investment"
  | "property"
  | "vehicle"
  | "precious_metal"
  | "digital_asset"
  | "other";

/** Financial account (both Plaid-connected and manual) */
export interface Account {
  id: string;
  userId: string;
  plaidItemId?: string; // Reference to Plaid item if connected
  plaidAccountId?: string; // Plaid's account ID
  name: string; // User-friendly account name
  officialName?: string; // Official name from institution
  type: AccountType;
  subtype: string; // Specific account subtype (checking, savings, etc.)
  category: AccountCategory; // Category for net worth breakdown
  isManual: boolean; // Whether this is a manually added account
  isActive: boolean; // Whether account is active
  institutionName?: string; // Name of financial institution
  mask?: string; // Last 4 digits of account number
  currency: string; // Account currency (USD for MVP)
  currentBalance?: AccountBalance; // Most recent balance
  balanceHistory?: AccountBalance[]; // Historical balance data
  manualAssetDetails?: ManualAsset; // Additional details for manual assets
  createdAt: Date;
  updatedAt: Date;
}

/** Configuration for account types (used in UI) */
export interface AccountTypeConfig {
  id: string;
  type: string;
  subtype: string;
  displayName: string; // Human-readable display name
  category: string; // Net worth category
  icon?: string; // Icon identifier for UI
  sortOrder: number; // Display order in UI
}

/** Request to create a manual account */
export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  subtype: string;
  category: AccountCategory;
  initialBalance?: number; // Starting balance for manual accounts
  description?: string; // Description for manual assets
  notes?: string; // Additional notes
}

/** Request to update account details */
export interface UpdateAccountRequest {
  name?: string; // Update account name
  isActive?: boolean; // Enable/disable account
  category?: AccountCategory; // Change categorization
}

/** API response format for Account (dates as strings) */
export interface AccountResponse {
  id: string;
  userId: string;
  plaidItemId?: string;
  plaidAccountId?: string;
  name: string;
  officialName?: string;
  type: AccountType;
  subtype: string;
  category: AccountCategory;
  isManual: boolean;
  isActive: boolean;
  institutionName?: string;
  mask?: string;
  currency: string;
  currentBalance?: AccountBalanceResponse;
  balanceHistory?: AccountBalanceResponse[];
  manualAssetDetails?: ManualAssetResponse;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** Account balance snapshot */
export interface AccountBalance {
  id: string;
  accountId: string;
  balance: number; // Account balance
  availableBalance?: number; // Available balance (for checking accounts)
  limit?: number; // Credit limit (for credit accounts)
  date: Date; // Date of balance
  isCurrent: boolean; // Whether this is the current balance
  source: "plaid" | "manual" | "kbb_api"; // Source of balance data
  createdAt: Date;
}

/** API response format for AccountBalance (dates as strings) */
export interface AccountBalanceResponse {
  id: string;
  accountId: string;
  balance: number;
  availableBalance?: number;
  limit?: number;
  date: string; // ISO date string
  isCurrent: boolean;
  source: "plaid" | "manual" | "kbb_api";
  createdAt: string; // ISO timestamp
}

/** Additional details for manual assets */
export interface ManualAsset {
  id: string;
  accountId: string;
  userId: string;
  description: string; // Asset description
  notes?: string; // Additional notes
  createdAt: Date;
  updatedAt: Date;
}

/** API response format for ManualAsset (dates as strings) */
export interface ManualAssetResponse {
  id: string;
  accountId: string;
  userId: string;
  description: string;
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** Request to update account balance */
export interface UpdateBalanceRequest {
  balance: number; // New balance value
  date?: string; // Date of balance (defaults to current date)
}
