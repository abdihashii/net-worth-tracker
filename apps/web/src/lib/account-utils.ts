/**
 * Account utility functions for type mappings, icons, and display helpers
 */

import {
  ACCOUNT_CATEGORIES,
  ACCOUNT_TYPES,
  AccountCategory,
  AccountType,
} from "@net-worth-tracker/shared-types";
import {
  Bitcoin,
  Box,
  Briefcase,
  Building,
  Car,
  Coins,
  CreditCard,
  Home,
  Lock,
  PiggyBank,
  Shield,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

/**
 * Maps account types to their corresponding categories
 */
export const accountTypeToCategory: Record<AccountType, AccountCategory> = {
  [ACCOUNT_TYPES.DEPOSITORY]: ACCOUNT_CATEGORIES.CASH,
  [ACCOUNT_TYPES.INVESTMENT]: ACCOUNT_CATEGORIES.INVESTMENT,
  [ACCOUNT_TYPES.LOAN]: ACCOUNT_CATEGORIES.OTHER,
  [ACCOUNT_TYPES.CREDIT]: ACCOUNT_CATEGORIES.OTHER,
  [ACCOUNT_TYPES.MANUAL_ASSET]: ACCOUNT_CATEGORIES.OTHER,
  [ACCOUNT_TYPES.MANUAL_LIABILITY]: ACCOUNT_CATEGORIES.OTHER,
};

/**
 * Maps account categories to their display names
 */
export const categoryDisplayNames: Record<AccountCategory, string> = {
  [ACCOUNT_CATEGORIES.CASH]: "Cash",
  [ACCOUNT_CATEGORIES.INVESTMENT]: "Investment",
  [ACCOUNT_CATEGORIES.PROPERTY]: "Property",
  [ACCOUNT_CATEGORIES.VEHICLE]: "Vehicle",
  [ACCOUNT_CATEGORIES.PRECIOUS_METAL]: "Precious Metal",
  [ACCOUNT_CATEGORIES.DIGITAL_ASSET]: "Digital Asset",
  [ACCOUNT_CATEGORIES.OTHER]: "Other",
};

/**
 * Maps account types to their display names
 */
export const accountTypeDisplayNames: Record<AccountType, string> = {
  [ACCOUNT_TYPES.DEPOSITORY]: "Bank Account",
  [ACCOUNT_TYPES.INVESTMENT]: "Investment Account",
  [ACCOUNT_TYPES.LOAN]: "Loan",
  [ACCOUNT_TYPES.CREDIT]: "Credit Card",
  [ACCOUNT_TYPES.MANUAL_ASSET]: "Manual Asset",
  [ACCOUNT_TYPES.MANUAL_LIABILITY]: "Manual Liability",
};

/**
 * Maps account subtypes to their display names
 */
export const subtypeDisplayNames: Record<string, string> = {
  // Depository subtypes
  checking: "Checking Account",
  savings: "Savings Account",
  cd: "Certificate of Deposit",
  money_market: "Money Market",

  // Investment subtypes
  brokerage: "Brokerage Account",
  "401k": "401(k)",
  ira: "IRA",
  roth_ira: "Roth IRA",
  "403b": "403(b)",
  "457b": "457(b)",

  // Credit subtypes
  credit_card: "Credit Card",

  // Loan subtypes
  mortgage: "Mortgage",
  auto: "Auto Loan",
  personal: "Personal Loan",
  student: "Student Loan",

  // Manual asset subtypes
  real_estate: "Real Estate",
  vehicle: "Vehicle",
  precious_metal: "Precious Metal",
  crypto: "Cryptocurrency",
  collectible: "Collectible",
  other: "Other Asset",
};

/**
 * Gets the appropriate icon component for an account type/subtype
 */
export function getAccountIcon(type: AccountType, subtype?: string) {
  // Check subtype first for more specific icons
  if (subtype) {
    switch (subtype) {
      case "checking":
        return Wallet;
      case "savings":
        return PiggyBank;
      case "cd":
        return Lock;
      case "brokerage":
        return TrendingUp;
      case "401k":
      case "403b":
      case "457b":
        return Briefcase;
      case "ira":
      case "roth_ira":
        return Shield;
      case "credit_card":
        return CreditCard;
      case "mortgage":
        return Home;
      case "auto":
        return Car;
      case "personal":
      case "student":
        return User;
      case "real_estate":
        return Home;
      case "vehicle":
        return Car;
      case "precious_metal":
        return Coins;
      case "crypto":
        return Bitcoin;
      default:
        break;
    }
  }

  // Fall back to type-based icons
  switch (type) {
    case ACCOUNT_TYPES.DEPOSITORY:
      return Wallet;
    case ACCOUNT_TYPES.INVESTMENT:
      return TrendingUp;
    case ACCOUNT_TYPES.CREDIT:
      return CreditCard;
    case ACCOUNT_TYPES.LOAN:
      return TrendingDown;
    case ACCOUNT_TYPES.MANUAL_ASSET:
      return Building;
    case ACCOUNT_TYPES.MANUAL_LIABILITY:
      return TrendingDown;
    default:
      return Box;
  }
}

/**
 * Gets the appropriate icon component for an account category
 */
export function getCategoryIcon(category: AccountCategory) {
  switch (category) {
    case ACCOUNT_CATEGORIES.CASH:
      return Wallet;
    case ACCOUNT_CATEGORIES.INVESTMENT:
      return TrendingUp;
    case ACCOUNT_CATEGORIES.PROPERTY:
      return Home;
    case ACCOUNT_CATEGORIES.VEHICLE:
      return Car;
    case ACCOUNT_CATEGORIES.PRECIOUS_METAL:
      return Coins;
    case ACCOUNT_CATEGORIES.DIGITAL_ASSET:
      return Bitcoin;
    case ACCOUNT_CATEGORIES.OTHER:
    default:
      return Box;
  }
}

/**
 * Formats currency values with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSign?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) {
  const {
    showSign = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {};

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Math.abs(amount));

  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }

  return formatted;
}

/**
 * Formats percentage values
 */
export function formatPercentage(value: number, decimals: number = 1) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Determines if an account type represents an asset or liability
 */
export function isAssetAccount(type: AccountType): boolean {
  return [
    ACCOUNT_TYPES.DEPOSITORY,
    ACCOUNT_TYPES.INVESTMENT,
    ACCOUNT_TYPES.MANUAL_ASSET,
  ].includes(type as any);
}

/**
 * Determines if an account type represents a liability
 */
export function isLiabilityAccount(type: AccountType): boolean {
  return [
    ACCOUNT_TYPES.CREDIT,
    ACCOUNT_TYPES.LOAN,
    ACCOUNT_TYPES.MANUAL_LIABILITY,
  ].includes(type as any);
}

/**
 * Gets the display name for an account based on its type and subtype
 */
export function getAccountDisplayName(
  name: string,
  type: AccountType,
  subtype?: string
): string {
  // If the name is descriptive enough, use it as-is
  if (name && name.length > 3 && !name.match(/^[A-Z0-9]+$/)) {
    return name;
  }

  // Otherwise, create a display name from type/subtype
  const subtypeDisplay = subtype ? subtypeDisplayNames[subtype] : null;
  return subtypeDisplay || accountTypeDisplayNames[type] || name;
}

/**
 * Sorts accounts by category and then by balance (descending)
 */
export function sortAccountsByCategory<
  T extends { category: AccountCategory; balance: number }
>(accounts: T[]): T[] {
  const categoryOrder: AccountCategory[] = [
    ACCOUNT_CATEGORIES.CASH,
    ACCOUNT_CATEGORIES.INVESTMENT,
    ACCOUNT_CATEGORIES.PROPERTY,
    ACCOUNT_CATEGORIES.VEHICLE,
    ACCOUNT_CATEGORIES.PRECIOUS_METAL,
    ACCOUNT_CATEGORIES.DIGITAL_ASSET,
    ACCOUNT_CATEGORIES.OTHER,
  ];

  return accounts.sort((a, b) => {
    // First sort by category order
    const aCategoryIndex = categoryOrder.indexOf(a.category);
    const bCategoryIndex = categoryOrder.indexOf(b.category);

    if (aCategoryIndex !== bCategoryIndex) {
      return aCategoryIndex - bCategoryIndex;
    }

    // Then sort by balance (descending, but handle negative balances)
    const aBalance = Math.abs(a.balance);
    const bBalance = Math.abs(b.balance);
    return bBalance - aBalance;
  });
}
