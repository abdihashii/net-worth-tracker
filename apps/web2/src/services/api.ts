/**
 * API Service Layer
 *
 * This service abstracts all data fetching logic. It now fetches data
 * from the live API server.
 */

import type {
  AccountListItem,
  AssetBreakdown,
  DashboardSummaryCard,
  LiabilityBreakdown,
  NetWorthSummary,
  NetWorthTrend,
} from '@net-worth-tracker/shared-types'

const API_BASE_URL = '/api'

const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * Dashboard API endpoints
 */
const dashboard = {
  getSummary: (): Promise<NetWorthSummary> => apiFetch('/dashboard/summary'),
  getSummaryCards: (): Promise<Array<DashboardSummaryCard>> =>
    apiFetch('/dashboard/cards'),
  getNetWorthHistory: (
    period: string = '12months',
  ): Promise<Array<NetWorthTrend>> =>
    apiFetch(`/net-worth/history?period=${period}`),
  refreshData: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/refresh`, { method: 'POST' })
  },
}

/**
 * Accounts API endpoints
 */
const accounts = {
  getList: (): Promise<Array<AccountListItem>> => apiFetch('/accounts'),
  getAssetBreakdown: (): Promise<AssetBreakdown> =>
    apiFetch('/accounts/assets/breakdown'),
  getLiabilityBreakdown: (): Promise<LiabilityBreakdown> =>
    apiFetch('/accounts/liabilities/breakdown'),
  connectAccount: async (
    publicToken: string,
  ): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/accounts/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicToken }),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
  updateAccount: async (
    accountId: string,
    data: Partial<AccountListItem>,
  ): Promise<AccountListItem> => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
  deleteAccount: async (accountId: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/accounts/${accountId}`, { method: 'DELETE' })
  },
  refreshAccounts: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/accounts/refresh`, { method: 'POST' })
  },
}

/**
 * Assets API endpoints
 */
const assets = {
  getPerformance: (
    period: string = '12months',
    type: string = 'all',
  ): Promise<Array<NetWorthTrend>> =>
    apiFetch(`/assets/performance?period=${period}&type=${type}`),
  getAllocation: (): Promise<
    Record<string, { value: number; percentage: number; color: string }>
  > => apiFetch('/assets/allocation'),
  refreshData: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/assets/refresh`, { method: 'POST' })
  },
}

/**
 * Liabilities API endpoints
 */
const liabilities = {
  getPaymentSchedule: (accountId: string): Promise<Array<any>> =>
    apiFetch(`/liabilities/${accountId}/schedule`),
  refreshData: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/liabilities/refresh`, { method: 'POST' })
  },
}

/**
 * Net Worth API endpoints
 */
const netWorth = {
  getDetailedHistory: (
    period: string = '12months',
    granularity: string = 'monthly',
  ): Promise<Array<NetWorthTrend>> =>
    apiFetch(`/net-worth/history?period=${period}&granularity=${granularity}`),
  getTrends: (): Promise<any> => apiFetch('/net-worth/trends'),
  getProjections: (): Promise<any> => apiFetch('/net-worth/projections'),
}

/**
 * Export API endpoints
 */
const exportApi = {
  getData: async (
    format: 'csv' | 'json' | 'pdf',
    options?: any,
  ): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, options }),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.blob()
  },
  getAvailableReports: (): Promise<Array<any>> => apiFetch('/export/reports'),
  generateReport: async (reportConfig: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/export/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportConfig),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
}

/**
 * Settings API endpoints
 */
const settings = {
  getPreferences: (): Promise<any> => apiFetch('/settings/preferences'),
  updatePreferences: async (preferences: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/settings/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
  getProfile: (): Promise<any> => apiFetch('/settings/profile'),
  updateProfile: async (profile: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/settings/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
  getNotificationSettings: (): Promise<any> =>
    apiFetch('/settings/notifications'),
  updateNotificationSettings: async (settingsData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
}

/**
 * Export the API object with all endpoints organized by feature
 */
export const api = {
  dashboard,
  accounts,
  assets,
  liabilities,
  netWorth,
  export: exportApi,
  settings,
}

// Type exports for better IDE support
export type Api = typeof api
export type DashboardApi = typeof dashboard
export type AccountsApi = typeof accounts
export type AssetsApi = typeof assets
export type LiabilitiesApi = typeof liabilities
export type NetWorthApi = typeof netWorth
export type ExportApi = typeof exportApi
export type SettingsApi = typeof settings
