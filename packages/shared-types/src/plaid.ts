/**
 * Plaid-related types for financial institution connections
 */

/** Status of a Plaid item connection */
export type PlaidItemStatus = "active" | "error" | "disconnected";

/** Represents a Plaid item (institution connection) stored in the database */
export interface PlaidItem {
  id: string;
  userId: string;
  itemId: string; // Plaid's unique identifier for this item
  accessToken: string; // Encrypted access token for API calls
  institutionId: string; // Plaid institution identifier
  institutionName: string;
  status: PlaidItemStatus;
  errorCode?: string; // Error code if status is 'error'
  lastSuccessfulUpdate?: Date; // Last successful data refresh timestamp
  createdAt: Date;
  updatedAt: Date;
}

/** Request payload when completing Plaid Link flow */
export interface PlaidLinkRequest {
  publicToken: string; // Public token received from Plaid Link
  metadata: {
    // Metadata about the linked institution and accounts
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      // Array of accounts user selected during Link flow
      id: string;
      name: string;
      type: string;
      subtype: string;
    }>;
  };
}

/** Response after successfully linking Plaid accounts */
export interface PlaidLinkResponse {
  itemId: string; // Internal database ID for the created PlaidItem
  institutionName: string;
  accountIds: string[]; // Array of account IDs that were created
}

/** Webhook payload from Plaid for item updates */
export interface PlaidWebhookRequest {
  webhook_type: string; // Type of webhook (e.g., 'ITEM', 'TRANSACTIONS')
  webhook_code: string; // Specific webhook code (e.g., 'WEBHOOK_UPDATE_ACKNOWLEDGED')
  item_id: string; // Plaid item ID that triggered the webhook
  error?: {
    // Error details if webhook indicates an error
    error_code: string;
    error_message: string;
  };
}

/** Request to refresh Plaid data */
export interface PlaidRefreshRequest {
  itemId?: string; // Specific item ID to refresh (optional - refreshes all if not provided)
  forceRefresh?: boolean; // Force refresh even if recent data exists
}
