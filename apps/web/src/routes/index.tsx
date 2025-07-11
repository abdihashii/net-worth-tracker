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

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: () => ({
    crumb: "Dashboard",
  }),
});

function Dashboard() {
  // Mock data - will be replaced with real data from API
  const netWorth = 125000;
  const netWorthChange = 12.5;
  const totalAssets = 180000;
  const totalLiabilities = 55000;
  const lastUpdated = new Date().toLocaleString();

  const accounts = [
    {
      id: 1,
      name: "Chase Checking",
      type: "Cash",
      balance: 12500,
      institution: "Chase",
    },
    {
      id: 2,
      name: "Chase Savings",
      type: "Cash",
      balance: 25000,
      institution: "Chase",
    },
    {
      id: 3,
      name: "Schwab Brokerage",
      type: "Investment",
      balance: 85000,
      institution: "Charles Schwab",
    },
    {
      id: 4,
      name: "Vanguard IRA",
      type: "Investment",
      balance: 42500,
      institution: "Vanguard",
    },
    {
      id: 5,
      name: "Chase Sapphire",
      type: "Credit Card",
      balance: -2500,
      institution: "Chase",
    },
    {
      id: 6,
      name: "Auto Loan",
      type: "Loan",
      balance: -15000,
      institution: "Toyota Financial",
    },
    {
      id: 7,
      name: "Home (Manual)",
      type: "Property",
      balance: 350000,
      institution: "Manual Entry",
    },
    {
      id: 8,
      name: "2022 Toyota Camry",
      type: "Vehicle",
      balance: 28000,
      institution: "Manual Entry",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "Cash":
        return <Wallet className="h-4 w-4" />;
      case "Investment":
        return <TrendingUp className="h-4 w-4" />;
      case "Credit Card":
      case "Loan":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
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
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.institution} • {account.type}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-right font-medium ${
                    account.balance < 0 ? "text-red-600" : ""
                  }`}
                >
                  {formatCurrency(Math.abs(account.balance))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
