/**
 * API request/response types and common API utilities
 */

import type { UserPreferences } from "./user";

/** Standard API response wrapper */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T; // Response data when success is true
  error?: string; // Error message when success is false
  message?: string; // Optional descriptive message
}

/** Detailed error information */
export interface ApiError {
  code: string; // Machine-readable error code
  message: string; // Human-readable error message
  details?: Record<string, any>; // Additional error context
}

/** Query parameters for paginated endpoints */
export interface PaginationQuery {
  page?: number; // Page number (1-based)
  limit?: number; // Items per page
  sortBy?: string; // Field to sort by
  sortOrder?: "asc" | "desc";
}

/** Response wrapper for paginated data */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number; // Current page number
    limit: number; // Items per page
    total: number; // Total number of items
    totalPages: number; // Total number of pages
    hasNext: boolean; // Whether there are more pages
    hasPrevious: boolean; // Whether there are previous pages
  };
}

/** Request to create user profile */
export interface CreateUserProfileRequest {
  preferences: UserPreferences;
}

/** Request to update user profile */
export interface UpdateUserProfileRequest {
  preferences: Partial<UserPreferences>; // Only include fields to update
}

/** Query parameters for user profile */
export interface UserProfileQuery {
  userId: string;
}

/** Request to export user data */
export interface ExportRequest {
  format: "csv" | "json";
  dateRange?: {
    // Optional date range filter
    start: string; // ISO date string
    end: string; // ISO date string
  };
  includeAccounts?: boolean; // Include account details
  includeBalances?: boolean; // Include balance history
  includeTransactions?: boolean; // Include transaction history
}

/** Response with export download details */
export interface ExportResponse {
  exportId: string; // Unique identifier for the export
  downloadUrl: string; // Pre-signed URL for download
  filename: string; // Generated filename
  format: "csv" | "json";
  expiresAt: string; // ISO timestamp when download expires
  createdAt: string; // ISO timestamp when export was created
}

/** API health check response */
export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy"; // Overall API status
  version: string; // API version
  timestamp: string; // ISO timestamp of check
  services: {
    // Status of dependent services
    database: "healthy" | "unhealthy";
    plaid: "healthy" | "unhealthy";
    redis?: "healthy" | "unhealthy";
  };
}

/** Individual field validation error */
export interface ValidationError {
  field: string; // Name of the field that failed validation
  message: string; // Human-readable error message
  code: string; // Machine-readable validation error code
}

/** Response for validation errors */
export interface ValidationErrorResponse {
  success: false;
  error: "validation_error";
  message: string; // Summary of validation errors
  errors: ValidationError[]; // Array of field-specific errors
}

/** HTTP methods supported by the API */
export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** API endpoint metadata */
export interface ApiEndpoint {
  method: ApiMethod;
  path: string; // URL path pattern
  description: string; // Human-readable description
  requiresAuth: boolean; // Whether authentication is required
}

/** Solana wallet balance information */
export interface SolanaBalanceInfo {
  mint: string; // Token mint address (native SOL uses "11111111111111111111111111111111")
  symbol: string; // Token symbol
  name: string; // Token name
  balance: number; // Token balance (already divided by decimals)
  uiAmount: string; // UI-formatted amount string
  decimals: number; // Token decimals
  logoUri?: string; // Token logo URL
}

/** Solana NFT information */
export interface SolanaNFTInfo {
  mint: string; // NFT mint address
  name: string; // NFT name
  symbol?: string; // NFT symbol
  image?: string; // NFT image URL
  collection?: string; // Collection name
  floorPrice?: number; // Floor price in SOL
  lastSale?: number; // Last sale price in SOL
}

/** Response for Solana wallet balances */
export interface SolanaWalletBalancesResponse {
  address: string; // Wallet address
  network: string; // Solana network
  solBalance: SolanaBalanceInfo; // SOL balance
  splTokens: SolanaBalanceInfo[]; // SPL token balances
  nfts: SolanaNFTInfo[]; // NFT holdings
  lastUpdated: string; // ISO timestamp of last update
}

/** Request to refresh Solana wallet balances */
export interface RefreshSolanaWalletRequest {
  walletId: string; // Solana wallet ID
  includeTokens?: boolean; // Include SPL tokens (default: true)
  includeNFTs?: boolean; // Include NFTs (default: true)
}

/** Response for Solana wallet refresh operation */
export interface RefreshSolanaWalletResponse {
  walletId: string; // Solana wallet ID
  status: "success" | "partial_success" | "failed";
  accountsUpdated: number; // Number of accounts updated
  tokensFound: number; // Number of SPL tokens found
  nftsFound: number; // Number of NFTs found
  errorMessage?: string; // Error message if failed
  lastUpdated: string; // ISO timestamp of update
}
