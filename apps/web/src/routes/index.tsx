import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  getAccountIcon,
  sortAccountsByCategory,
} from "@/lib/account-utils";
import mockData from "@/lib/mock-data";
import {
  AccountCategory,
  AccountListItem,
  AccountType,
} from "@net-worth-tracker/shared-types";

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: () => ({
    crumb: "Dashboard",
  }),
});

function Dashboard() {
  // Get mock data from the centralized mock data file
  const { netWorthSummary, accountListItems } = mockData;

  // Sort accounts by category for better display - convert to proper format first
  const accountsWithTypedCategories = accountListItems.map((item) => ({
    ...item,
    category: item.category as AccountCategory,
  }));
  const sortedAccounts = sortAccountsByCategory(accountsWithTypedCategories);

  // Calculate display values
  const netWorth = netWorthSummary.currentNetWorth;
  const netWorthChange = netWorthSummary.changeFromPrevious?.percentage || 0;
  const totalAssets = netWorthSummary.totalAssets;
  const totalLiabilities = netWorthSummary.totalLiabilities;
  const lastUpdated = netWorthSummary.lastUpdated.toLocaleString();

  const renderAccountIcon = (account: AccountListItem) => {
    const IconComponent = getAccountIcon(
      account.type as AccountType,
      account.subtype
    );
    return <IconComponent className="h-4 w-4" />;
  };

  const getAccountDisplayBalance = (account: AccountListItem) => {
    // For liabilities, show as negative in the UI
    const isLiability = account.type === "credit" || account.type === "loan";
    return isLiability ? -account.balance : account.balance;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your net worth and financial accounts
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
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
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAssets)}
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalLiabilities)}
            </div>
            <Progress value={25} className="mt-2" />
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
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart will be implemented with Recharts
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Last updated: {lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedAccounts.map((account) => {
              const displayBalance = getAccountDisplayBalance(account);
              const isNegative = displayBalance < 0;

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
                      isNegative ? "text-red-600" : ""
                    }`}
                  >
                    {formatCurrency(Math.abs(displayBalance))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
