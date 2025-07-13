import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircleIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  RefreshCwIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import type {
  AccountCategory,
  AccountListItem,
  AccountType,
} from '@net-worth-tracker/shared-types'
import { QueryErrorFallback } from '@/components/error-boundary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAccountList,
  useNetWorthHistory,
  useNetWorthSummary,
  useRefreshData,
} from '@/hooks/use-dashboard-queries'
import {
  formatCurrency,
  getAccountIcon,
  sortAccountsByCategory,
} from '@/lib/account-utils'

export const Route = createFileRoute('/')({
  component: Dashboard,
  loader: () => ({
    crumb: 'Dashboard',
  }),
  errorComponent: QueryErrorFallback,
})

// Chart configuration
const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

function Dashboard() {
  // Fetch data using React Query hooks
  const {
    data: netWorthSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useNetWorthSummary()
  const {
    data: accountListItems,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAccountList()
  const {
    data: netWorthHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useNetWorthHistory()
  const refreshMutation = useRefreshData()

  // Handle loading states
  const isLoading = summaryLoading || accountsLoading || historyLoading
  const error = summaryError || accountsError || historyError

  // Sort accounts by category for better display - convert to proper format first
  const accountsWithTypedCategories =
    accountListItems?.map((item) => ({
      ...item,
      category: item.category as AccountCategory,
    })) || []
  const sortedAccounts = sortAccountsByCategory(accountsWithTypedCategories)

  // Prepare chart data
  const chartData =
    netWorthHistory?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      netWorth: item.netWorth,
    })) || []

  // Calculate display values with safe defaults
  const netWorth = netWorthSummary?.currentNetWorth || 0
  const netWorthChange = netWorthSummary?.changeFromPrevious?.percentage || 0
  const totalAssets = netWorthSummary?.totalAssets || 0
  const totalLiabilities = netWorthSummary?.totalLiabilities || 0
  const lastUpdated = netWorthSummary?.lastUpdated
    ? new Date(netWorthSummary.lastUpdated).toLocaleString()
    : 'Never'

  const renderAccountIcon = (account: AccountListItem) => {
    const IconComponent = getAccountIcon(
      account.type as AccountType,
      account.subtype,
    )
    return <IconComponent className="h-4 w-4" />
  }

  const getAccountDisplayBalance = (account: AccountListItem) => {
    // For liabilities, show as negative in the UI
    const isLiability = account.type === 'credit' || account.type === 'loan'
    return isLiability ? -account.balance : account.balance
  }

  // Show error state if there's an error
  if (error && !isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your net worth and financial accounts
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try again.
            {error.message && <p className="mt-2 text-sm">{error.message}</p>}
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your net worth and financial accounts
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending || isLoading}
        >
          <RefreshCwIcon
            className={`mr-2 h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`}
          />
          {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(netWorth)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {netWorthChange > 0 ? (
                    <>
                      <ArrowUpRightIcon className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+{netWorthChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRightIcon className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">{netWorthChange}%</span>
                    </>
                  )}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-2 w-full" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalAssets)}
                </div>
                <Progress value={75} className="mt-2" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-2 w-full" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalLiabilities)}
                </div>
                <Progress value={25} className="mt-2" />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth Trend</CardTitle>
          <CardDescription>
            Your net worth over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] space-y-4">
              <div className="flex justify-between items-end h-full">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton
                    key={`chart-skeleton-${index}`}
                    className="w-8"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full [&>div]:!aspect-auto [&>div]:!justify-start"
            >
              <AreaChart
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorNetWorth"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-netWorth)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-netWorth)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="var(--color-netWorth)"
                  fillOpacity={1}
                  fill="url(#colorNetWorth)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Last updated: {lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons for accounts
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))
            ) : sortedAccounts.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-muted-foreground">
                <p>No accounts connected yet.</p>
                <p className="text-sm mt-2">
                  Connect your first account to get started.
                </p>
              </div>
            ) : (
              // Account list
              sortedAccounts.map((account) => {
                const displayBalance = getAccountDisplayBalance(account)
                const isNegative = displayBalance < 0

                return (
                  <div
                    key={account.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        {renderAccountIcon(account)}
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.institutionName} • {account.subtype}
                          {account.mask && ` ••••${account.mask}`}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-right font-medium ${
                        isNegative ? 'text-red-600' : ''
                      }`}
                    >
                      {formatCurrency(Math.abs(displayBalance))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
