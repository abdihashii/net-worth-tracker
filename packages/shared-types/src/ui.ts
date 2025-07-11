/**
 * UI-specific types for frontend components and state management
 */

import type { DateRange } from "./net-worth";

/** Dashboard view modes */
export type DashboardView = "net_worth" | "assets" | "liabilities";

/** UI theme options */
export type Theme = "light" | "dark" | "system";

/** Dashboard component state */
export interface DashboardState {
  view: DashboardView; // Current view mode
  dateRange: DateRange; // Selected date range for data
  isLoading: boolean; // Whether data is being loaded
  lastRefresh?: Date; // Timestamp of last data refresh
  error?: string; // Error message if any
}

/** Single data point for charts */
export interface ChartDataPoint {
  date: string; // ISO date string
  value: number; // Numeric value for the point
  label?: string; // Optional display label
}

/** Data structure for net worth chart */
export interface NetWorthChartData {
  data: ChartDataPoint[]; // Array of chart data points
  trend: "up" | "down" | "flat"; // Overall trend direction
  changeAmount: number; // Absolute change amount
  changePercentage: number; // Percentage change
  period: string; // Time period for the change
}

/** Data structure for asset breakdown chart */
export interface AssetBreakdownChartData {
  name: string; // Display name for the asset category
  value: number; // Dollar value of the category
  percentage: number; // Percentage of total assets
  color: string; // Color for chart display
  category: string; // Asset category identifier
}

/** Data structure for liability breakdown chart */
export interface LiabilityBreakdownChartData {
  name: string; // Display name for the liability category
  value: number; // Dollar value of the category
  percentage: number; // Percentage of total liabilities
  color: string; // Color for chart display
  category: string; // Liability category identifier
}

/** Account item for UI lists */
export interface AccountListItem {
  id: string;
  name: string; // Account display name
  institutionName?: string; // Financial institution name
  type: string; // Account type
  subtype: string; // Account subtype
  category: string; // Net worth category
  balance: number; // Current balance
  isManual: boolean; // Whether manually added
  isActive: boolean; // Whether account is active
  mask?: string; // Last 4 digits of account number
  lastUpdated: Date; // Last update timestamp
  icon?: string; // Icon identifier for UI
}

/** Summary card component props */
export interface DashboardSummaryCard {
  title: string; // Card title
  value: number; // Main value to display
  change?: {
    // Optional change information
    amount: number; // Absolute change
    percentage: number; // Percentage change
    period: string; // Time period
    trend: "up" | "down" | "flat"; // Trend direction
  };
  format: "currency" | "number" | "percentage"; // Value formatting
  icon?: string; // Optional icon identifier
}

/** Navigation menu item */
export interface NavigationItem {
  id: string;
  label: string; // Display label
  path: string; // Navigation path
  icon?: string; // Optional icon identifier
  isActive: boolean; // Whether currently active
  children?: NavigationItem[]; // Optional child items
}

/** Toast notification */
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info"; // Toast type
  title: string; // Toast title
  message?: string; // Optional detailed message
  duration?: number; // Auto-dismiss duration in ms
  actions?: Array<{
    // Optional action buttons
    label: string;
    action: () => void;
  }>;
}

/** Modal dialog */
export interface Modal {
  id: string;
  title: string; // Modal title
  content: any; // Modal content (React component)
  size?: "sm" | "md" | "lg" | "xl"; // Modal size
  closable?: boolean; // Whether modal can be closed
  onClose?: () => void; // Close callback
}

/** Loading state indicator */
export interface LoadingState {
  isLoading: boolean; // Whether loading is active
  message?: string; // Optional loading message
  progress?: number; // Optional progress percentage (0-100)
}

/** Empty state component */
export interface EmptyState {
  title: string; // Empty state title
  message: string; // Empty state message
  icon?: string; // Optional icon identifier
  actions?: Array<{
    // Optional action buttons
    label: string;
    action: () => void;
    variant?: "primary" | "secondary"; // Button variant
  }>;
}

/** Form field configuration */
export interface FormField {
  name: string; // Field name
  label: string; // Field label
  type: // Field input type
  "text" | "email" | "password" | "number" | "select" | "textarea" | "date";
  required?: boolean; // Whether field is required
  placeholder?: string; // Placeholder text
  validation?: {
    // Validation rules
    min?: number; // Minimum value/length
    max?: number; // Maximum value/length
    pattern?: string; // Regex pattern
    message?: string; // Custom validation message
  };
  options?: Array<{
    // Options for select fields
    value: string;
    label: string;
  }>;
}

/** Form state management */
export interface FormState {
  isSubmitting: boolean; // Whether form is being submitted
  isDirty: boolean; // Whether form has been modified
  isValid: boolean; // Whether form is valid
  errors: Record<string, string>; // Field-specific error messages
  values: Record<string, any>; // Current field values
}
