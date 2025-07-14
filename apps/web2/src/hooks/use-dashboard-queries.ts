/**
 * React Query hooks for all application data fetching
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
} from '@net-worth-tracker/shared-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/services/api'

/**
 * Centralized query key factory for consistent cache key generation across all features
 */
export const queryKeys = {
  // Dashboard related keys
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
    cards: () => [...queryKeys.dashboard.all, 'cards'] as const,
    history: (period?: string) =>
      [...queryKeys.dashboard.all, 'history', period] as const,
  },

  // Account related keys
  accounts: {
    all: ['accounts'] as const,
    list: () => [...queryKeys.accounts.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.accounts.all, 'detail', id] as const,
    assetBreakdown: () =>
      [...queryKeys.accounts.all, 'assetBreakdown'] as const,
    liabilityBreakdown: () =>
      [...queryKeys.accounts.all, 'liabilityBreakdown'] as const,
  },

  // Asset related keys
  assets: {
    all: ['assets'] as const,
    list: () => [...queryKeys.assets.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.assets.all, 'detail', id] as const,
    breakdown: () => [...queryKeys.assets.all, 'breakdown'] as const,
    performance: (period?: string) =>
      [...queryKeys.assets.all, 'performance', period] as const,
  },

  // Liability related keys
  liabilities: {
    all: ['liabilities'] as const,
    list: () => [...queryKeys.liabilities.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.liabilities.all, 'detail', id] as const,
    breakdown: () => [...queryKeys.liabilities.all, 'breakdown'] as const,
    paymentSchedule: (id: string) =>
      [...queryKeys.liabilities.all, 'paymentSchedule', id] as const,
  },

  // Export related keys
  export: {
    all: ['export'] as const,
    data: (format: string, options?: any) =>
      [...queryKeys.export.all, 'data', format, options] as const,
    reports: () => [...queryKeys.export.all, 'reports'] as const,
  },

  // Settings related keys
  settings: {
    all: ['settings'] as const,
    preferences: () => [...queryKeys.settings.all, 'preferences'] as const,
    profile: () => [...queryKeys.settings.all, 'profile'] as const,
    notifications: () => [...queryKeys.settings.all, 'notifications'] as const,
  },

  // Net worth specific keys (separate from dashboard for granular control)
  netWorth: {
    all: ['netWorth'] as const,
    current: () => [...queryKeys.netWorth.all, 'current'] as const,
    history: (period?: string, granularity?: string) =>
      [...queryKeys.netWorth.all, 'history', period, granularity] as const,
    trends: () => [...queryKeys.netWorth.all, 'trends'] as const,
    projections: () => [...queryKeys.netWorth.all, 'projections'] as const,
  },
}

// Legacy exports for backward compatibility
export const dashboardKeys = queryKeys.dashboard
export const accountKeys = queryKeys.accounts

/**
 * Hook to fetch net worth summary
 */
export const useNetWorthSummary = () => {
  return useQuery<NetWorthSummary, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: api.dashboard.getSummary,
  })
}

/**
 * Hook to fetch dashboard summary cards
 */
export const useDashboardCards = () => {
  return useQuery<Array<DashboardSummaryCard>, Error>({
    queryKey: dashboardKeys.cards(),
    queryFn: api.dashboard.getSummaryCards,
  })
}

/**
 * Hook to fetch net worth history for charts
 */
export const useNetWorthHistory = (period: string = '12months') => {
  return useQuery<Array<NetWorthTrend>, Error>({
    queryKey: dashboardKeys.history(period),
    queryFn: () => api.dashboard.getNetWorthHistory(period),
  })
}

/**
 * Hook to fetch all accounts
 */
export const useAccountList = () => {
  return useQuery<Array<AccountListItem>, Error>({
    queryKey: accountKeys.list(),
    queryFn: api.accounts.getList,
  })
}

/**
 * Hook to fetch asset breakdown
 */
export const useAssetBreakdown = () => {
  return useQuery<AssetBreakdown, Error>({
    queryKey: accountKeys.assetBreakdown(),
    queryFn: api.accounts.getAssetBreakdown,
  })
}

/**
 * Hook to fetch liability breakdown
 */
export const useLiabilityBreakdown = () => {
  return useQuery<LiabilityBreakdown, Error>({
    queryKey: accountKeys.liabilityBreakdown(),
    queryFn: api.accounts.getLiabilityBreakdown,
  })
}

/**
 * Combined hook to fetch all dashboard data
 * Useful for components that need multiple data points
 */
export const useDashboardData = () => {
  const summaryQuery = useNetWorthSummary()
  const cardsQuery = useDashboardCards()
  const accountsQuery = useAccountList()
  const historyQuery = useNetWorthHistory()

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
  }
}

/**
 * Mutation hook for refreshing all data
 */
export const useRefreshData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.dashboard.refreshData,
    onSuccess: () => {
      // Invalidate all dashboard, account, and net worth queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.netWorth.all })
    },
    onError: (error) => {
      console.error('Failed to refresh data:', error)
    },
  })
}

/**
 * Mutation hook for connecting a new account
 */
export const useConnectAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.accounts.connectAccount,
    onSuccess: () => {
      // Invalidate account list and summary to show new account
      queryClient.invalidateQueries({ queryKey: accountKeys.list() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() })
    },
  })
}

/**
 * Mutation hook for updating an account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string
      data: Partial<AccountListItem>
    }) => api.accounts.updateAccount(accountId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific account and list
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(variables.accountId),
      })
      queryClient.invalidateQueries({ queryKey: accountKeys.list() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() })
      queryClient.invalidateQueries({ queryKey: queryKeys.netWorth.all })
    },
  })
}

/**
 * Mutation hook for deleting an account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.accounts.deleteAccount,
    onSuccess: () => {
      // Invalidate account list and summary
      queryClient.invalidateQueries({ queryKey: accountKeys.list() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() })
      queryClient.invalidateQueries({ queryKey: queryKeys.netWorth.all })
    },
  })
}

// ==========================================
// ASSETS PAGE HOOKS
// ==========================================

/**
 * Hook to fetch asset accounts only
 */
export const useAssetAccounts = () => {
  return useQuery<Array<AccountListItem>, Error>({
    queryKey: queryKeys.assets.list(),
    queryFn: async () => {
      const accounts = await api.accounts.getList()
      return accounts.filter((account) =>
        ['depository', 'investment', 'manual_asset', 'solana_wallet'].includes(
          account.type,
        ),
      )
    },
  })
}

/**
 * Hook to fetch asset performance over time
 */
export const useAssetPerformance = (period: string = '12months') => {
  return useQuery<Array<NetWorthTrend>, Error>({
    queryKey: queryKeys.assets.performance(period),
    queryFn: () => api.assets.getPerformance(period),
  })
}

// ==========================================
// LIABILITIES PAGE HOOKS
// ==========================================

/**
 * Hook to fetch liability accounts only
 */
export const useLiabilityAccounts = () => {
  return useQuery<Array<AccountListItem>, Error>({
    queryKey: queryKeys.liabilities.list(),
    queryFn: async () => {
      const accounts = await api.accounts.getList()
      return accounts.filter((account) =>
        ['credit', 'loan', 'mortgage'].includes(account.type),
      )
    },
  })
}

/**
 * Hook to fetch payment schedule for a specific liability
 */
export const usePaymentSchedule = (accountId: string) => {
  return useQuery({
    queryKey: queryKeys.liabilities.paymentSchedule(accountId),
    queryFn: () => api.liabilities.getPaymentSchedule(accountId),
    enabled: !!accountId,
  })
}

// ==========================================
// NET WORTH PAGE HOOKS
// ==========================================

/**
 * Hook to fetch detailed net worth history with different granularities
 */
export const useDetailedNetWorthHistory = (
  period: string = '12months',
  granularity: string = 'monthly',
) => {
  return useQuery<Array<NetWorthTrend>, Error>({
    queryKey: queryKeys.netWorth.history(period, granularity),
    queryFn: () => api.netWorth.getDetailedHistory(period, granularity),
  })
}

/**
 * Hook to fetch net worth trends and analysis
 */
export const useNetWorthTrends = () => {
  return useQuery({
    queryKey: queryKeys.netWorth.trends(),
    queryFn: api.netWorth.getTrends,
  })
}

/**
 * Hook to fetch net worth projections
 */
export const useNetWorthProjections = () => {
  return useQuery({
    queryKey: queryKeys.netWorth.projections(),
    queryFn: api.netWorth.getProjections,
  })
}

// ==========================================
// EXPORT PAGE HOOKS
// ==========================================

/**
 * Hook to export data in various formats
 */
export const useExportData = () => {
  return useMutation({
    mutationFn: ({
      format,
      options,
    }: {
      format: 'csv' | 'json' | 'pdf'
      options?: any
    }) => api.export.getData(format, options),
  })
}

/**
 * Hook to fetch available export reports
 */
export const useExportReports = () => {
  return useQuery({
    queryKey: queryKeys.export.reports(),
    queryFn: api.export.getAvailableReports,
  })
}

/**
 * Hook to generate a custom report
 */
export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (reportConfig: any) => api.export.generateReport(reportConfig),
  })
}

// ==========================================
// SETTINGS PAGE HOOKS
// ==========================================

/**
 * Hook to fetch user preferences
 */
export const useUserPreferences = () => {
  return useQuery({
    queryKey: queryKeys.settings.preferences(),
    queryFn: api.settings.getPreferences,
  })
}

/**
 * Hook to update user preferences
 */
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.settings.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.preferences(),
      })
    },
  })
}

/**
 * Hook to fetch user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.settings.profile(),
    queryFn: api.settings.getProfile,
  })
}

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.settings.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.profile() })
    },
  })
}

/**
 * Hook to fetch notification settings
 */
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings.notifications(),
    queryFn: api.settings.getNotificationSettings,
  })
}

/**
 * Hook to update notification settings
 */
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.settings.updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.notifications(),
      })
    },
  })
}

// ==========================================
// GLOBAL REFRESH HOOKS
// ==========================================

/**
 * Enhanced refresh hook that can refresh specific sections
 */
export const useRefreshSection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      section?: 'dashboard' | 'accounts' | 'assets' | 'liabilities' | 'all',
    ) => {
      if (!section || section === 'all') {
        await api.dashboard.refreshData()
        return
      }

      // Section-specific refresh logic
      switch (section) {
        case 'dashboard':
          await api.dashboard.refreshData()
          break
        case 'accounts':
          await api.accounts.refreshAccounts()
          break
        case 'assets':
          await api.assets.refreshData()
          break
        case 'liabilities':
          await api.liabilities.refreshData()
          break
      }
    },
    onSuccess: (_, section) => {
      if (!section || section === 'all') {
        // Refresh everything
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.assets.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.liabilities.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.netWorth.all })
      } else {
        // Refresh specific section
        queryClient.invalidateQueries({ queryKey: queryKeys[section].all })
      }
    },
  })
}
