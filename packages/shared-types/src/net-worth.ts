/**
 * Net worth tracking and financial summary types
 */

/**
 * Net worth snapshot at a specific point in time
 */
export interface NetWorthSnapshot {
  id: string;
  userId: string;
  date: Date;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number; // Calculated as totalAssets - totalLiabilities
  assetBreakdown: AssetBreakdown;
  liabilityBreakdown: LiabilityBreakdown;
  createdAt: Date;
}

/**
 * Asset breakdown by category
 */
export interface AssetBreakdown {
  cash: number;
  investments: number;
  property: number;
  vehicles: number;
  preciousMetals: number;
  digitalAssets: number; // Crypto, NFTs, etc.
  other: number;
}

/**
 * Liability breakdown by category
 */
export interface LiabilityBreakdown {
  creditCards: number;
  mortgages: number;
  loans: number;
  other: number;
}

/**
 * API response format for NetWorthSnapshot (dates as strings)
 */
export interface NetWorthResponse {
  id: string;
  userId: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetBreakdown: AssetBreakdown;
  liabilityBreakdown: LiabilityBreakdown;
  createdAt: string;
}

/**
 * Single data point for net worth trend analysis
 */
export interface NetWorthTrend {
  date: Date;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

/**
 * API response format for NetWorthTrend (date as string)
 */
export interface NetWorthTrendResponse {
  date: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

/**
 * Current net worth summary with optional change metrics
 */
export interface NetWorthSummary {
  currentNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  lastUpdated: Date;
  changeFromPrevious?: {
    amount: number;
    percentage: number;
    period: string;
  };
}

/**
 * API response format for NetWorthSummary (date as string)
 */
export interface NetWorthSummaryResponse {
  currentNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  lastUpdated: string;
  changeFromPrevious?: {
    amount: number;
    percentage: number;
    period: string;
  };
}

/**
 * Predefined date ranges for queries
 */
export type DateRange = "30d" | "90d" | "ytd" | "1y" | "2y" | "5y" | "all";

/**
 * Query parameters for net worth data
 */
export interface NetWorthQuery {
  dateRange?: DateRange;
  startDate?: string;
  endDate?: string;
  granularity?: "daily" | "weekly" | "monthly";
}

/**
 * Request parameters for net worth history API
 */
export interface NetWorthHistoryRequest {
  dateRange?: DateRange;
  startDate?: string;
  endDate?: string;
  granularity?: "daily" | "weekly" | "monthly";
}

/**
 * API response for net worth history with trend data
 */
export interface NetWorthHistoryResponse {
  data: NetWorthTrendResponse[];
  summary: NetWorthSummaryResponse;
  /** Actual date range returned */
  dateRange: {
    start: string;
    end: string;
  };
}
