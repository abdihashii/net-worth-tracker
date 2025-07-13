/**
 * @net-worth-tracker/shared-types
 *
 * Shared TypeScript types for the Net Worth Tracker monorepo.
 * This package provides consistent type definitions across web and API applications.
 */

// User Profile Types
export type {
  AppUser,
  AppUserResponse,
  UpdateUserPreferencesRequest,
  UserPreferences,
  UserProfile,
  UserProfileResponse,
} from "./user";

// Authentication Types (Supabase)
export type {
  AuthChangeEvent,
  AuthContextType,
  AuthState,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
} from "./auth";

// Plaid Integration Types
export type {
  PlaidItem,
  PlaidItemStatus,
  PlaidLinkRequest,
  PlaidLinkResponse,
  PlaidRefreshRequest,
  PlaidWebhookRequest,
} from "./plaid";

// Account and Balance Types
export type {
  Account,
  AccountBalance,
  AccountBalanceResponse,
  AccountCategory,
  AccountResponse,
  AccountType,
  AccountTypeConfig,
  ConnectSolanaWalletRequest,
  CreateAccountRequest,
  ManualAsset,
  ManualAssetResponse,
  SolanaNFTMetadata,
  SolanaTokenMetadata,
  SolanaWallet,
  SolanaWalletResponse,
  UpdateAccountRequest,
  UpdateBalanceRequest,
} from "./account";

// Net Worth and Financial Summary Types
export type {
  AssetBreakdown,
  DateRange,
  LiabilityBreakdown,
  NetWorthHistoryRequest,
  NetWorthHistoryResponse,
  NetWorthQuery,
  NetWorthResponse,
  NetWorthSnapshot,
  NetWorthSummary,
  NetWorthSummaryResponse,
  NetWorthTrend,
  NetWorthTrendResponse,
} from "./net-worth";

// Data Refresh Types
export type {
  DataRefreshLog,
  DataRefreshLogResponse,
  RefreshAccountsRequest,
  RefreshAccountsResponse,
  RefreshStatus,
  RefreshStatusResponse,
  RefreshType,
} from "./data-refresh";

// API Common Types
export type {
  ApiEndpoint,
  ApiError,
  ApiMethod,
  ApiResponse,
  CreateUserProfileRequest,
  ExportRequest,
  ExportResponse,
  HealthCheckResponse,
  PaginatedResponse,
  PaginationQuery,
  RefreshSolanaWalletRequest,
  RefreshSolanaWalletResponse,
  SolanaBalanceInfo,
  SolanaNFTInfo,
  SolanaWalletBalancesResponse,
  UpdateUserProfileRequest,
  UserProfileQuery,
  ValidationError,
  ValidationErrorResponse,
} from "./api";

// UI and Frontend Types
export type {
  AccountListItem,
  AssetBreakdownChartData,
  ChartDataPoint,
  DashboardState,
  DashboardSummaryCard,
  DashboardView,
  EmptyState,
  FormField,
  FormState,
  LiabilityBreakdownChartData,
  LoadingState,
  Modal,
  NavigationItem,
  NetWorthChartData,
  Theme,
  Toast,
} from "./ui";

// Constants and Enums

/** Account type constants */
export const ACCOUNT_TYPES = {
  DEPOSITORY: "depository",
  INVESTMENT: "investment",
  LOAN: "loan",
  CREDIT: "credit",
  MANUAL_ASSET: "manual_asset",
  MANUAL_LIABILITY: "manual_liability",
  SOLANA_WALLET: "solana_wallet",
} as const;

/** Account category constants for net worth breakdown */
export const ACCOUNT_CATEGORIES = {
  CASH: "cash",
  INVESTMENT: "investment",
  PROPERTY: "property",
  VEHICLE: "vehicle",
  PRECIOUS_METAL: "precious_metal",
  DIGITAL_ASSET: "digital_asset",
  OTHER: "other",
} as const;

/** Dashboard view mode constants */
export const DASHBOARD_VIEWS = {
  NET_WORTH: "net_worth",
  ASSETS: "assets",
  LIABILITIES: "liabilities",
} as const;

/** Date range constants for data filtering */
export const DATE_RANGES = {
  "30D": "30d",
  "90D": "90d",
  YTD: "ytd",
  "1Y": "1y",
  "2Y": "2y",
  "5Y": "5y",
  ALL: "all",
} as const;

/** Data refresh status constants */
export const REFRESH_STATUSES = {
  PENDING: "pending",
  SUCCESS: "success",
  PARTIAL_SUCCESS: "partial_success",
  FAILED: "failed",
} as const;

/** Data refresh type constants */
export const REFRESH_TYPES = {
  MANUAL: "manual",
  SCHEDULED: "scheduled",
  WEBHOOK: "webhook",
} as const;

/** UI theme constants */
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

/** Solana network constants */
export const SOLANA_NETWORKS = {
  MAINNET: "mainnet-beta",
  DEVNET: "devnet",
  TESTNET: "testnet",
} as const;

/** Balance source constants */
export const BALANCE_SOURCES = {
  PLAID: "plaid",
  MANUAL: "manual",
  KBB_API: "kbb_api",
  SOLANA_RPC: "solana_rpc",
} as const;
