/**
 * Data refresh and synchronization types
 */

/** Type of data refresh operation */
export type RefreshType = "manual" | "scheduled" | "webhook";

/** Status of a data refresh operation */
export type RefreshStatus =
  | "pending" // Operation in progress
  | "success" // All accounts updated successfully
  | "partial_success" // Some accounts updated, some failed
  | "failed"; // Operation failed completely

/** Log entry for data refresh operations */
export interface DataRefreshLog {
  id: string;
  userId: string;
  plaidItemId?: string; // Specific Plaid item if targeted refresh
  refreshType: RefreshType;
  status: RefreshStatus;
  accountsUpdated: number; // Number of accounts successfully updated
  errorMessage?: string; // Error message if refresh failed
  startedAt: Date; // When refresh was initiated
  completedAt?: Date; // When refresh completed (if finished)
}

/** API response format for DataRefreshLog (dates as strings) */
export interface DataRefreshLogResponse {
  id: string;
  userId: string;
  plaidItemId?: string;
  refreshType: RefreshType;
  status: RefreshStatus;
  accountsUpdated: number;
  errorMessage?: string;
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

/** Request to refresh specific accounts or items */
export interface RefreshAccountsRequest {
  accountIds?: string[]; // Specific account IDs to refresh
  itemIds?: string[]; // Specific Plaid item IDs to refresh
  forceRefresh?: boolean; // Force refresh even if recent data exists
}

/** Response after initiating account refresh */
export interface RefreshAccountsResponse {
  refreshId: string; // Unique ID for tracking this refresh operation
  status: RefreshStatus; // Current status of the refresh
  accountsUpdated: number; // Number of accounts successfully updated
  message?: string; // Human-readable status message
  errors?: Array<{
    // Account-specific errors
    accountId: string;
    error: string;
  }>;
}

/** Status check response for ongoing refresh operation */
export interface RefreshStatusResponse {
  refreshId: string;
  status: RefreshStatus;
  progress: {
    // Progress tracking for the refresh
    completed: number; // Number of accounts processed
    total: number; // Total number of accounts to process
  };
  accountsUpdated: number; // Number of accounts successfully updated
  errors?: Array<{
    // Account-specific errors
    accountId: string;
    error: string;
  }>;
  completedAt?: string; // ISO timestamp when refresh completed
}
