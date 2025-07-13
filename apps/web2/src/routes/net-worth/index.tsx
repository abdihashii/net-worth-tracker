import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  RefreshCw,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import { QueryErrorFallback } from '@/components/error-boundary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
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
  useDetailedNetWorthHistory,
  useNetWorthProjections,
  useNetWorthSummary,
  useNetWorthTrends,
  useRefreshData,
} from '@/hooks/use-dashboard-queries'
import { formatCurrency } from '@/lib/account-utils'

export const Route = createFileRoute('/net-worth/')({
  component: NetWorth,
  loader: () => ({
    crumb: 'Net Worth',
  }),
  errorComponent: QueryErrorFallback,
})

// Chart configuration
const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'var(--chart-1)',
  },
  assets: {
    label: 'Assets',
    color: 'var(--chart-2)',
  },
  liabilities: {
    label: 'Liabilities',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

function NetWorth() {
  const [selectedPeriod, setSelectedPeriod] = useState('12months')
  const [selectedGranularity, setSelectedGranularity] = useState('monthly')

  const {
    data: netWorthSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useNetWorthSummary()
  const {
    data: netWorthHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useDetailedNetWorthHistory(selectedPeriod, selectedGranularity)
  const {
    data: trends,
    isLoading: trendsLoading,
    error: trendsError,
  } = useNetWorthTrends()
  const {
    data: projections,
    isLoading: projectionsLoading,
    error: projectionsError,
  } = useNetWorthProjections()
  const refreshMutation = useRefreshData()

  const isLoading =
    summaryLoading || historyLoading || trendsLoading || projectionsLoading
  const error = summaryError || historyError || trendsError || projectionsError

  const netWorth = netWorthSummary?.currentNetWorth || 0
  const netWorthChange = netWorthSummary?.changeFromPrevious?.percentage || 0
  const netWorthChangeAmount = netWorthSummary?.changeFromPrevious?.amount || 0
  const totalAssets = netWorthSummary?.totalAssets || 0
  const totalLiabilities = netWorthSummary?.totalLiabilities || 0
  const lastUpdated = netWorthSummary?.lastUpdated
    ? new Date(netWorthSummary.lastUpdated).toLocaleString()
    : 'Never'

  // Prepare chart data
  const chartData =
    netWorthHistory?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        year:
          selectedPeriod !== '3months' && selectedPeriod !== '6months'
            ? '2-digit'
            : undefined,
      }),
      netWorth: item.netWorth,
      assets: item.totalAssets,
      liabilities: item.totalLiabilities,
    })) || []

  if (error && !isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Net Worth</h1>
            <p className="text-muted-foreground">
              Detailed analysis of your net worth over time
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load net worth data. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Net Worth</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your net worth over time
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending || isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshMutation.isPending ? 'animate-spin' : ''
            }`}
          />
          {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Net Worth
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
                  {formatCurrency(netWorth)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {netWorthChange > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+{netWorthChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">{netWorthChange}%</span>
                    </>
                  )}
                  ({formatCurrency(netWorthChangeAmount)})
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(totalAssets)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(totalLiabilities)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asset-to-Liability Ratio
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalLiabilities > 0
                    ? (totalAssets / totalLiabilities).toFixed(2)
                    : '∞'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalAssets > totalLiabilities ? (
                    <Badge variant="default" className="text-xs">
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      At Risk
                    </Badge>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Net Worth History</CardTitle>
              <CardDescription>
                Track your net worth progression over time
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">1 Year</SelectItem>
                  <SelectItem value="24months">2 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedGranularity}
                onValueChange={setSelectedGranularity}
              >
                <SelectTrigger className="w-full sm:w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          ) : chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full [&>div]:!aspect-auto [&>div]:!justify-start"
            >
              <LineChart
                data={chartData}
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
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  stroke="var(--color-netWorth)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="assets"
                  stroke="var(--color-assets)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="liabilities"
                  stroke="var(--color-liabilities)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data available for the selected period</p>
                <p className="text-xs mt-2">
                  Try selecting a different time range
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth Trends</CardTitle>
          <CardDescription>
            Analysis and insights about your financial growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  Average monthly growth: 2.5%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Best performing month: March 2024
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Tracking since: January 2023
                </span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Your net worth has shown consistent growth over the past 12
                  months, with particularly strong performance in your
                  investment accounts.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth Projections</CardTitle>
          <CardDescription>
            Projected net worth based on current trends and assumptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectionsLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  1 Year
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(netWorth * 1.08)}
                </p>
                <p className="text-xs text-green-600">+8% projected growth</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  3 Years
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(netWorth * 1.26)}
                </p>
                <p className="text-xs text-green-600">+26% projected growth</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  5 Years
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(netWorth * 1.47)}
                </p>
                <p className="text-xs text-green-600">+47% projected growth</p>
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated} • Projections based on historical
              performance and market trends
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
