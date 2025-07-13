import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import mockData from "./lib/mock-data.js";

const app = new Hono();

// Middleware
app.use("*", logger());

// --- API Routes ---

// Dashboard
app.get("/api/dashboard/summary", (c) => {
  return c.json(mockData.netWorthSummary);
});

app.get("/api/dashboard/cards", (c) => {
  return c.json(mockData.dashboardSummaryCards);
});

app.get("/api/net-worth/history", (c) => {
  return c.json(mockData.netWorthHistory);
});

// Accounts
app.get("/api/accounts", (c) => {
  return c.json(mockData.accountListItems);
});

app.get("/api/accounts/assets/breakdown", (c) => {
  return c.json(mockData.assetBreakdown);
});

app.get("/api/accounts/liabilities/breakdown", (c) => {
  return c.json(mockData.liabilityBreakdown);
});

// Assets
app.get("/api/assets/performance", (c) => {
  const data = mockData.netWorthHistory.map((item) => ({
    date: item.date,
    netWorth: item.totalAssets,
    totalAssets: item.totalAssets,
    totalLiabilities: 0,
  }));
  return c.json(data);
});
app.post("/api/assets/refresh", (c) => {
  return c.json({ success: true, message: "Asset data refresh simulated" });
});

// Liabilities
app.get("/api/liabilities/:id/schedule", (c) => {
  const schedule = [
    {
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: 250.0,
      type: "minimum",
      principal: 150,
      interest: 100,
    },
    {
      date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      amount: 250.0,
      type: "minimum",
      principal: 152,
      interest: 98,
    },
  ];
  return c.json(schedule);
});
app.post("/api/liabilities/refresh", (c) => {
  return c.json({ success: true, message: "Liability data refresh simulated" });
});

// Net Worth
app.get("/api/net-worth/trends", (c) => {
  const trends = {
    monthlyGrowthRate: 2.5,
    yearOverYearGrowth: 15.2,
    volatility: "low",
    trend: "upward",
    projectedNetWorth: {
      sixMonths: 125000,
      oneYear: 135000,
      fiveYears: 200000,
    },
  };
  return c.json(trends);
});
app.get("/api/net-worth/projections", (c) => {
  const projections = {
    conservative: [
      { date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), value: 125000 },
      {
        date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        value: 140000,
      },
    ],
    moderate: [
      { date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), value: 135000 },
      {
        date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        value: 165000,
      },
    ],
    aggressive: [
      { date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), value: 150000 },
      {
        date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        value: 200000,
      },
    ],
  };
  return c.json(projections);
});

// Export
app.post("/api/export", async (c) => {
  const { format } = await c.req.json();
  if (format === "json") {
    return c.json(mockData);
  } else if (format === "csv") {
    const csv =
      "Date,Net Worth,Assets,Liabilities\n" +
      mockData.netWorthHistory
        .map(
          (item) =>
            `${item.date.toISOString()},${item.netWorth},${item.totalAssets},${
              item.totalLiabilities
            }`
        )
        .join("\n");
    return c.text(csv);
  }
  return new Response("PDF content would be here", {
    headers: { "Content-Type": "application/pdf" },
  });
});

app.get("/api/export/reports", (c) => {
  const reports = [
    {
      id: "net-worth-summary",
      name: "Net Worth Summary",
      description: "Complete overview of your net worth",
      formats: ["pdf", "csv"],
    },
    {
      id: "account-details",
      name: "Account Details",
      description: "Detailed breakdown of all accounts",
      formats: ["csv", "json"],
    },
    {
      id: "transaction-history",
      name: "Transaction History",
      description: "All transactions for the selected period",
      formats: ["csv", "json"],
    },
  ];
  return c.json(reports);
});

app.post("/api/export/reports/generate", (c) => {
  const report = {
    reportId: "report-" + Date.now(),
    status: "completed",
    downloadUrl: "/downloads/custom-report.pdf",
    generatedAt: new Date(),
  };
  return c.json(report);
});

// Settings
app.get("/api/settings/preferences", (c) => {
  const preferences = {
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    refreshFrequency: "daily",
    notifications: { email: true, push: false, weeklyReports: true },
    privacy: { shareAnonymousData: false, includeInBenchmarks: true },
  };
  return c.json(preferences);
});
app.put("/api/settings/preferences", async (c) => {
  const preferences = await c.req.json();
  return c.json(preferences);
});
app.get("/api/settings/profile", (c) => {
  const profile = {
    id: "user-123",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    timezone: "America/New_York",
    createdAt: new Date("2024-01-01"),
    lastLoginAt: new Date(),
  };
  return c.json(profile);
});
app.put("/api/settings/profile", async (c) => {
  const profile = await c.req.json();
  return c.json(profile);
});
app.get("/api/settings/notifications", (c) => {
  const settings = {
    email: {
      enabled: true,
      weeklyReports: true,
      accountAlerts: true,
      securityAlerts: true,
    },
    push: { enabled: false, accountAlerts: false, securityAlerts: true },
    sms: { enabled: false, securityAlerts: false },
  };
  return c.json(settings);
});
app.put("/api/settings/notifications", async (c) => {
  const settings = await c.req.json();
  return c.json(settings);
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
