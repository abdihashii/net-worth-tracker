# Net Worth Tracker - Product Requirements Document

## Overview

A minimal, lightweight web application that allows users to track their net worth by connecting financial accounts and manually adding physical/digital assets. Think Personal Capital's net worth feature, but simpler and focused solely on wealth tracking.

## Core Features

### 1. User Authentication

- Email/password authentication via Supabase Auth
- Password reset functionality
- Session management

### 2. Account Connection

- Financial Accounts: Integration with Plaid to connect:

  - Bank accounts (checking, savings)
  - Investment accounts (Schwab, Fidelity, Vanguard, etc.)
  - Credit cards (for liability tracking)
  - Loans (mortgage, auto, personal)

- Manual Assets:
  - Vehicles (with optional KBB API integration for valuation)
  - Precious metals (gold, silver) with manual value entry
  - Real estate (manual entry)
  - Digital assets (crypto, stablecoins) with manual entry
  - Other assets (collectibles, etc.)

### 3. Dashboard Views

#### Main Dashboard

- Total net worth display with change indicator
- Quick stats: Total Assets, Total Liabilities
- Line graph showing net worth over time
- List of connected accounts with current balances
- "Refresh Data" button for manual updates

#### Three View Modes

1. **Net Worth View** (default)

- Line graph showing net worth trend
- Date range filters: YTD, This Year, Last Year, This Month, Last Month, 90d, 30d, All Time

2. **Assets View**

- Line graph showing total assets trend
- Breakdown by category (Cash, Investments, Property, Digital Assets, etc.)

3. **Liabilities View**

- Line graph showing total liabilities trend
- Breakdown by type (Credit Cards, Mortgages, Loans)

### 4. Account Management

- Add/remove connected accounts
- Edit manual asset values
- Disconnect all data (with confirmation)
- Account categorization (automatic for Plaid, manual for others)

### 5. Data Export

- Export to CSV format
- Include all transactions and balance history
- Date range selection for exports

## Technical Architecture

### Frontend

```typescript
// Tech Stack
- React 18+ with TypeScript
- TanStack Start (for SSR/routing)
- shadcn/ui components
- Recharts for graphs
- TanStack Query for data fetching
```

### Backend

```typescript
// API Layer
- Node.js with Hono framework
- TypeScript
- Plaid SDK for financial connections
- KBB API for vehicle valuations (future)
- Redis for caching account balances
```

### Database Schema (Supabase/PostgreSQL)

```sql
-- Core tables
users (id, email, created_at)
accounts (id, user_id, plaid_account_id, name, type, subtype)
account_balances (id, account_id, balance, date, currency)
manual_assets (id, user_id, name, category, value, updated_at)
plaid_items (id, user_id, access_token, item_id, institution_name)
```

### Data Flow

1. User connects account via Plaid Link
2. Store access_token securely in database
3. Fetch account balances and store in account_balances table
4. Display aggregated data in dashboard
5. Manual refresh triggers new Plaid API calls
6. Cache recent balances in Redis (5-minute TTL)

## API Endpoints

```typescript
// Account Management
POST /api/accounts/connect // Initiate Plaid Link
POST /api/accounts/callback // Handle Plaid callback
DELETE /api/accounts/:id // Remove account
GET /api/accounts // List all accounts

// Manual Assets
POST /api/assets // Add manual asset
PUT /api/assets/:id // Update asset value
DELETE /api/assets/:id // Remove asset

// Data Retrieval
GET /api/net-worth // Get net worth data with filters
GET /api/refresh // Trigger manual data refresh
GET /api/export // Generate CSV export
```

## Security Considerations

- All Plaid access tokens encrypted at rest
- Read-only access to financial accounts
- Rate limiting on refresh endpoints
- HTTPS only
- Supabase RLS policies for data isolation

## Development Phases

### Phase 1: MVP

- Supabase auth setup
- Plaid integration for basic accounts
- Simple dashboard with net worth graph
- Manual asset entry
- Basic date filtering

### Phase 2: Enhancements

- KBB integration for auto values
- Improved caching layer
- Export functionality
- Better error handling and retry logic

### Phase 3: Polish

- Cron job for automatic daily updates
- More sophisticated charts
- Performance optimizations
- Mobile responsive improvements

## Key User Flows

### First-Time User

### First-Time User

1. Sign up with email/password
2. Land on empty dashboard
3. Click "Connect Account" → Plaid Link flow
4. See first account balance appear
5. Add manual assets if desired
6. View net worth graph

### Returning User

1. Log in
2. See dashboard with last known balances
3. Click "Refresh" for latest data
4. Check different date ranges
5. Export data if needed

## Success Metrics (for personal tracking)

- Page load time < 1s
- Data refresh < 3s
- Zero data inconsistencies
- Successful Plaid connection rate
- App stability (uptime)
