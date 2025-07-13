import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import type {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAssetAccounts,
  useAssetPerformance,
  useRefreshSection,
} from '@/hooks/use-dashboard-queries'
import { formatCurrency, getAccountIcon } from '@/lib/account-utils'
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/assets/')({
  component: Assets,
  loader: () => ({
    crumb: 'Assets',
  }),
  errorComponent: QueryErrorFallback,
})

// Chart configuration
const chartConfig = {
  performance: {
    label: 'Asset Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

// Hook for asset allocation data
const useAssetAllocation = () => {
  return useQuery({
    queryKey: ['assets', 'allocation'],
    queryFn: api.assets.getAllocation,
  })
}

function Assets() {
  const [timePeriod, setTimePeriod] = useState('12months')

  // Fetch data using React Query hooks
  const {
    data: assetAccounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAssetAccounts()
  const {
    data: assetPerformance,
    isLoading: performanceLoading,
    error: performanceError,
  } = useAssetPerformance(timePeriod)
  const {
    data: assetAllocation,
    isLoading: allocationLoading,
    error: allocationError,
  } = useAssetAllocation()
  const refreshMutation = useRefreshSection()

  // Handle loading states
  const isLoading = accountsLoading || performanceLoading || allocationLoading
  const error = accountsError || performanceError || allocationError

  // Calculate summary values
  const totalAssetValue =
    assetAccounts?.reduce((sum, account) => sum + account.balance, 0) || 0
  const assetCount = assetAccounts?.length || 0

  // Calculate performance metrics
  const firstValue = assetPerformance?.[0]?.netWorth || 0
  const lastValue =
    assetPerformance?.[assetPerformance.length - 1]?.netWorth || 0
  const performanceChange =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0
  const performanceChangeAmount = lastValue - firstValue

  // Prepare chart data
  const performanceChartData =
    assetPerformance?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: item.netWorth,
    })) || []

  // Prepare allocation chart data
  const allocationChartData = assetAllocation
    ? Object.entries(assetAllocation).map(([key, data]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: data.value,
        percentage: data.percentage,
        color: data.color,
      }))
    : []

  const renderAccountIcon = (account: AccountListItem) => {
    const IconComponent = getAccountIcon(
      account.type as AccountType,
      account.subtype,
    )
    return <IconComponent className="h-4 w-4" />
  }

  // Show error state if there's an error
  if (error && !isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">
              Track and analyze your asset portfolio
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load asset data. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Track and analyze your asset portfolio
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshMutation.mutate('assets')}
          disabled={refreshMutation.isPending || isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`}
          />
          {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asset Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
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
                  {formatCurrency(totalAssetValue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {assetCount} account{assetCount !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                  {performanceChange > 0 ? '+' : ''}
                  {performanceChange.toFixed(2)}%
                </div>
                <p
                  className={`text-xs mt-1 ${performanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(performanceChangeAmount)} this period
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asset Categories
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
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
                  {allocationChartData.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Diversified portfolio
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              How your assets are distributed across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-8 border-gray-200 animate-pulse" />
              </div>
            ) : allocationChartData.length > 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <RechartsPieChart>
                    <Pie
                      data={allocationChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {allocationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.value)} (
                                {data.percentage.toFixed(1)}%)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No allocation data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>
                  Track your asset value over time
                </CardDescription>
              </div>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="24months">Last 24 Months</SelectItem>
                  <SelectItem value="5years">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            ) : performanceChartData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full [&>div]:!aspect-auto [&>div]:!justify-start"
              >
                <LineChart
                  data={performanceChartData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-performance)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No performance data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Accounts</CardTitle>
          <CardDescription>
            Detailed view of your individual asset accounts
          </CardDescription>
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
            ) : assetAccounts && assetAccounts.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-muted-foreground">
                <p>No asset accounts found.</p>
                <p className="text-sm mt-2">
                  Connect accounts to start tracking your assets.
                </p>
              </div>
            ) : (
              // Account list
              assetAccounts?.map((account) => (
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
                  <div className="text-right font-medium">
                    {formatCurrency(account.balance)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
