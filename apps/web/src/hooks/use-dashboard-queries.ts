/**
 * React Query hooks for dashboard data fetching
 *
 * These hooks provide a clean interface for components to fetch data
 * with built-in loading, error, and caching states.
 */

import type {
  AccountListItem,
  AssetBreakdown,
  DashboardSummaryCard,
  LiabilityBreakdown,
  NetWorthSummary,
  NetWorthTrend,
} from "@net-worth-tracker/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/services/api";

/**
 * Query key factory for consistent cache key generation
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  cards: () => [...dashboardKeys.all, "cards"] as const,
  history: (period?: string) =>
    [...dashboardKeys.all, "history", period] as const,
};

export const accountKeys = {
  all: ["accounts"] as const,
  list: () => [...accountKeys.all, "list"] as const,
  detail: (id: string) => [...accountKeys.all, "detail", id] as const,
  assetBreakdown: () => [...accountKeys.all, "assetBreakdown"] as const,
  liabilityBreakdown: () => [...accountKeys.all, "liabilityBreakdown"] as const,
};

/**
 * Hook to fetch net worth summary
 */
export const useNetWorthSummary = () => {
  return useQuery<NetWorthSummary, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: api.dashboard.getSummary,
  });
};

/**
 * Hook to fetch dashboard summary cards
 */
export const useDashboardCards = () => {
  return useQuery<DashboardSummaryCard[], Error>({
    queryKey: dashboardKeys.cards(),
    queryFn: api.dashboard.getSummaryCards,
  });
};

/**
 * Hook to fetch net worth history for charts
 */
export const useNetWorthHistory = (period: string = "12months") => {
  return useQuery<NetWorthTrend[], Error>({
    queryKey: dashboardKeys.history(period),
    queryFn: () => api.dashboard.getNetWorthHistory(period),
  });
};

/**
 * Hook to fetch all accounts
 */
export const useAccountList = () => {
  return useQuery<AccountListItem[], Error>({
    queryKey: accountKeys.list(),
    queryFn: api.accounts.getList,
  });
};

/**
 * Hook to fetch asset breakdown
 */
export const useAssetBreakdown = () => {
  return useQuery<AssetBreakdown, Error>({
    queryKey: accountKeys.assetBreakdown(),
    queryFn: api.accounts.getAssetBreakdown,
  });
};

/**
 * Hook to fetch liability breakdown
 */
export const useLiabilityBreakdown = () => {
  return useQuery<LiabilityBreakdown, Error>({
    queryKey: accountKeys.liabilityBreakdown(),
    queryFn: api.accounts.getLiabilityBreakdown,
  });
};

/**
 * Combined hook to fetch all dashboard data
 * Useful for components that need multiple data points
 */
export const useDashboardData = () => {
  const summaryQuery = useNetWorthSummary();
  const cardsQuery = useDashboardCards();
  const accountsQuery = useAccountList();
  const historyQuery = useNetWorthHistory();

  return {
    summary: summaryQuery,
    cards: cardsQuery,
    accounts: accountsQuery,
    history: historyQuery,
    // Aggregate loading and error states
    isLoading:
      summaryQuery.isLoading ||
      cardsQuery.isLoading ||
      accountsQuery.isLoading ||
      historyQuery.isLoading,
    isError:
      summaryQuery.isError ||
      cardsQuery.isError ||
      accountsQuery.isError ||
      historyQuery.isError,
    error:
      summaryQuery.error ||
      cardsQuery.error ||
      accountsQuery.error ||
      historyQuery.error,
  };
};

/**
 * Mutation hook for refreshing all data
 */
export const useRefreshData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.dashboard.refreshData,
    onSuccess: () => {
      // Invalidate all dashboard and account queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
    onError: (error) => {
      console.error("Failed to refresh data:", error);
    },
  });
};

/**
 * Mutation hook for connecting a new account
 */
export const useConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.accounts.connectAccount,
    onSuccess: () => {
      // Invalidate account list and summary to show new account
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
};

/**
 * Mutation hook for updating an account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string;
      data: Partial<AccountListItem>;
    }) => api.accounts.updateAccount(accountId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific account and list
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(variables.accountId),
      });
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
};

/**
 * Mutation hook for deleting an account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.accounts.deleteAccount,
    onSuccess: () => {
      // Invalidate account list and summary
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
};
