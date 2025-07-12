/**
 * API Service Layer
 *
 * This service abstracts all data fetching logic, making it easy to swap
 * mock data for real API calls in the future. Each method returns data
 * in the same format that the real API would return.
 */

import {
  AccountListItem,
  AssetBreakdown,
  DashboardSummaryCard,
  LiabilityBreakdown,
  NetWorthSummary,
  NetWorthTrend,
} from "@net-worth-tracker/shared-types";

import mockData from "@/lib/mock-data";

// Simulate network delay for more realistic behavior
const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Error simulation for testing error states (disabled by default)
const SIMULATE_ERRORS = false;
const shouldSimulateError = () => SIMULATE_ERRORS && Math.random() < 0.1;

/**
 * Dashboard API endpoints
 */
const dashboard = {
  /**
   * Get net worth summary including current value and changes
   * Future: GET /api/net-worth/summary
   */
  getSummary: async (): Promise<NetWorthSummary> => {
    await simulateDelay();

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch net worth summary");
    }

    // In the future, replace with:
    // const response = await fetch('/api/net-worth/summary');
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.netWorthSummary;
  },

  /**
   * Get summary cards for dashboard display
   * Future: GET /api/dashboard/cards
   */
  getSummaryCards: async (): Promise<DashboardSummaryCard[]> => {
    await simulateDelay(200);

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch dashboard cards");
    }

    // In the future, replace with:
    // const response = await fetch('/api/dashboard/cards');
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.dashboardSummaryCards;
  },

  /**
   * Get net worth history for chart display
   * Future: GET /api/net-worth/history?period=12months
   */
  getNetWorthHistory: async (
    period: string = "12months"
  ): Promise<NetWorthTrend[]> => {
    await simulateDelay(400);

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch net worth history");
    }

    // In the future, replace with:
    // const response = await fetch(`/api/net-worth/history?period=${period}`);
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.netWorthHistory.map((item) => ({
      date: item.date,
      netWorth: item.netWorth,
      totalAssets: item.totalAssets,
      totalLiabilities: item.totalLiabilities,
    }));
  },

  /**
   * Refresh all dashboard data
   * Future: POST /api/refresh
   */
  refreshData: async (): Promise<void> => {
    await simulateDelay(1000); // Simulate longer delay for refresh

    if (shouldSimulateError()) {
      throw new Error("Failed to refresh data");
    }

    // In the future, replace with:
    // const response = await fetch('/api/refresh', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // For now, just simulate success
    console.log("Data refresh simulated");
  },
};

/**
 * Accounts API endpoints
 */
const accounts = {
  /**
   * Get list of all accounts
   * Future: GET /api/accounts
   */
  getList: async (): Promise<AccountListItem[]> => {
    await simulateDelay();

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch accounts");
    }

    // In the future, replace with:
    // const response = await fetch('/api/accounts');
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.accountListItems;
  },

  /**
   * Get asset breakdown by category
   * Future: GET /api/accounts/assets/breakdown
   */
  getAssetBreakdown: async (): Promise<AssetBreakdown> => {
    await simulateDelay(250);

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch asset breakdown");
    }

    // In the future, replace with:
    // const response = await fetch('/api/accounts/assets/breakdown');
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.assetBreakdown;
  },

  /**
   * Get liability breakdown by category
   * Future: GET /api/accounts/liabilities/breakdown
   */
  getLiabilityBreakdown: async (): Promise<LiabilityBreakdown> => {
    await simulateDelay(250);

    if (shouldSimulateError()) {
      throw new Error("Failed to fetch liability breakdown");
    }

    // In the future, replace with:
    // const response = await fetch('/api/accounts/liabilities/breakdown');
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    return mockData.liabilityBreakdown;
  },

  /**
   * Connect a new account via Plaid
   * Future: POST /api/accounts/connect
   */
  connectAccount: async (
    publicToken: string
  ): Promise<{ success: boolean }> => {
    await simulateDelay(1500);

    // In the future, replace with:
    // const response = await fetch('/api/accounts/connect', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ publicToken })
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    console.log("Account connection simulated with token:", publicToken);
    return { success: true };
  },

  /**
   * Update a manual account value
   * Future: PUT /api/accounts/:id
   */
  updateAccount: async (
    accountId: string,
    data: Partial<AccountListItem>
  ): Promise<AccountListItem> => {
    await simulateDelay(500);

    // In the future, replace with:
    // const response = await fetch(`/api/accounts/${accountId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // return response.json();

    const account = mockData.accountListItems.find((a) => a.id === accountId);
    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    return { ...account, ...data };
  },

  /**
   * Delete an account
   * Future: DELETE /api/accounts/:id
   */
  deleteAccount: async (accountId: string): Promise<void> => {
    await simulateDelay(500);

    // In the future, replace with:
    // const response = await fetch(`/api/accounts/${accountId}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    console.log("Account deletion simulated for:", accountId);
  },
};

/**
 * Export the API object with all endpoints organized by feature
 */
export const api = {
  dashboard,
  accounts,

  // Add more feature areas as needed:
  // auth: { ... },
  // settings: { ... },
  // export: { ... },
};

// Type exports for better IDE support
export type Api = typeof api;
export type DashboardApi = typeof dashboard;
export type AccountsApi = typeof accounts;
