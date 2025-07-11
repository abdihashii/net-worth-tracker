# Net Worth Tracker - Database Schema

This document outlines the complete database schema for the Net Worth Tracker application using PostgreSQL.

## Overview

The database is designed to support:

- User authentication and preferences
- Plaid integration for automatic account syncing
- Manual asset and liability tracking
- Historical balance tracking
- Performance-optimized net worth calculations
- Audit trails and data refresh logging

## Database Functions

### Updated At Trigger

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## Core Tables

### 1. Users Table

Stores user account information and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  preferences JSONB DEFAULT '{"theme": "system", "currency": "USD", "dateFormat": "MM/DD/YYYY"}'::jsonb
);

CREATE INDEX idx_users_email ON users(email);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. User Sessions Table (Simple MVP)

Basic session tracking for security.

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed session token
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Cleanup expired sessions periodically
CREATE INDEX idx_user_sessions_cleanup ON user_sessions(expires_at) WHERE expires_at < NOW();
```

### 3. Plaid Items Table

Manages Plaid connections for each user.

```sql
CREATE TYPE plaid_item_status AS ENUM ('active', 'error', 'disconnected');

CREATE TABLE plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id VARCHAR(255) UNIQUE NOT NULL,
  access_token TEXT NOT NULL, -- Should be encrypted at application level
  institution_id VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255) NOT NULL,
  status plaid_item_status NOT NULL DEFAULT 'active',
  error_code VARCHAR(255),
  last_successful_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plaid_items_user_id ON plaid_items(user_id);
CREATE INDEX idx_plaid_items_status ON plaid_items(status);

-- Trigger for updated_at
CREATE TRIGGER update_plaid_items_updated_at BEFORE UPDATE ON plaid_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Accounts Table

Stores both Plaid-connected and manual accounts.

```sql
CREATE TYPE account_type AS ENUM ('depository', 'investment', 'loan', 'credit', 'manual_asset', 'manual_liability');
CREATE TYPE account_category AS ENUM ('cash', 'investment', 'property', 'vehicle', 'precious_metal', 'digital_asset', 'other');

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plaid_item_id UUID REFERENCES plaid_items(id) ON DELETE CASCADE,
  plaid_account_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  official_name VARCHAR(255),
  type account_type NOT NULL,
  subtype VARCHAR(255) NOT NULL, -- checking, savings, 401k, mortgage, etc.
  category account_category NOT NULL,
  is_manual BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  institution_name VARCHAR(255),
  mask VARCHAR(10), -- Last 4 digits
  currency CHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'), -- MVP: USD only
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_plaid_or_manual CHECK (
    (is_manual = FALSE AND plaid_item_id IS NOT NULL AND plaid_account_id IS NOT NULL) OR
    (is_manual = TRUE AND plaid_item_id IS NULL AND plaid_account_id IS NULL)
  )
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_plaid_item_id ON accounts(plaid_item_id);
CREATE INDEX idx_accounts_is_active ON accounts(is_active);
CREATE INDEX idx_accounts_category ON accounts(category);

-- Trigger for updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Account Balances Table

Tracks historical balance data for all accounts.

```sql
CREATE TYPE balance_source AS ENUM ('plaid', 'manual', 'kbb_api');

CREATE TABLE account_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  balance NUMERIC(19,2) NOT NULL,
  available_balance NUMERIC(19,2),
  limit NUMERIC(19,2), -- For credit accounts
  date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  source balance_source NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one current balance per account
CREATE UNIQUE INDEX idx_account_balances_current ON account_balances(account_id) WHERE is_current = TRUE;
CREATE INDEX idx_account_balances_account_date ON account_balances(account_id, date DESC);
CREATE INDEX idx_account_balances_date ON account_balances(date);
```

### 5. Manual Assets Table (Simplified for MVP)

Stores basic information for manual assets.

```sql
CREATE TABLE manual_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  notes TEXT, -- Any additional notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_manual_assets_account_id ON manual_assets(account_id);

-- Trigger for updated_at
CREATE TRIGGER update_manual_assets_updated_at BEFORE UPDATE ON manual_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. Net Worth Snapshots Table

Pre-calculated daily snapshots for performance.

```sql
CREATE TABLE net_worth_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_assets NUMERIC(19,2) NOT NULL CHECK (total_assets >= 0),
  total_liabilities NUMERIC(19,2) NOT NULL CHECK (total_liabilities >= 0),
  net_worth NUMERIC(19,2) NOT NULL,
  asset_breakdown JSONB NOT NULL, -- {cash: 0, investments: 0, property: 0, ...}
  liability_breakdown JSONB NOT NULL, -- {credit_cards: 0, loans: 0, mortgages: 0}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_user_date UNIQUE (user_id, date)
);

CREATE INDEX idx_net_worth_snapshots_user_date ON net_worth_snapshots(user_id, date DESC);
```

### 7. Data Refresh Logs Table

Tracks all data refresh operations.

```sql
CREATE TYPE refresh_type AS ENUM ('manual', 'scheduled', 'webhook');
CREATE TYPE refresh_status AS ENUM ('pending', 'success', 'partial_success', 'failed');

CREATE TABLE data_refresh_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plaid_item_id UUID REFERENCES plaid_items(id) ON DELETE CASCADE,
  refresh_type refresh_type NOT NULL,
  status refresh_status NOT NULL DEFAULT 'pending',
  accounts_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_logs_user_id ON data_refresh_logs(user_id);
CREATE INDEX idx_refresh_logs_status ON data_refresh_logs(status);
CREATE INDEX idx_refresh_logs_started_at ON data_refresh_logs(started_at DESC);
```

## Support Tables

### 8. Account Types Configuration

Defines account type metadata for UI.

```sql
CREATE TABLE account_type_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  subtype VARCHAR(50) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT uk_type_subtype UNIQUE (type, subtype)
);

-- Insert default account types
INSERT INTO account_type_config (type, subtype, display_name, category, icon, sort_order) VALUES
-- Cash accounts
('depository', 'checking', 'Checking Account', 'cash', 'wallet', 1),
('depository', 'savings', 'Savings Account', 'cash', 'piggy-bank', 2),
('depository', 'cd', 'Certificate of Deposit', 'cash', 'lock', 3),
-- Investment accounts
('investment', 'brokerage', 'Brokerage Account', 'investment', 'trending-up', 10),
('investment', '401k', '401(k)', 'investment', 'briefcase', 11),
('investment', 'ira', 'IRA', 'investment', 'shield', 12),
('investment', 'roth_ira', 'Roth IRA', 'investment', 'shield', 13),
-- Liabilities
('credit', 'credit_card', 'Credit Card', 'credit_cards', 'credit-card', 20),
('loan', 'mortgage', 'Mortgage', 'mortgages', 'home', 30),
('loan', 'auto', 'Auto Loan', 'loans', 'car', 31),
('loan', 'personal', 'Personal Loan', 'loans', 'user', 32),
-- Manual assets
('manual_asset', 'real_estate', 'Real Estate', 'property', 'home', 40),
('manual_asset', 'vehicle', 'Vehicle', 'vehicle', 'car', 41),
('manual_asset', 'precious_metal', 'Precious Metal', 'precious_metal', 'coins', 42),
('manual_asset', 'crypto', 'Cryptocurrency', 'digital_asset', 'bitcoin', 43),
('manual_asset', 'other', 'Other Asset', 'other', 'box', 50);
```

## TypeScript Data Models

```typescript
// User model
interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  currency: string;
  dateFormat: string;
  dashboardLayout?: string;
}

// Plaid connection model
interface PlaidItem {
  id: string;
  userId: string;
  itemId: string;
  accessToken: string; // Encrypted
  institutionId: string;
  institutionName: string;
  status: "active" | "error" | "disconnected";
  errorCode?: string;
  lastSuccessfulUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Account model
interface Account {
  id: string;
  userId: string;
  plaidItemId?: string;
  plaidAccountId?: string;
  name: string;
  officialName?: string;
  type: AccountType;
  subtype: string;
  category: AccountCategory;
  isManual: boolean;
  isActive: boolean;
  institutionName?: string;
  mask?: string;
  currency: string;
  currentBalance?: AccountBalance;
  balanceHistory?: AccountBalance[];
  manualAssetDetails?: ManualAsset;
}

type AccountType =
  | "depository"
  | "investment"
  | "loan"
  | "credit"
  | "manual_asset"
  | "manual_liability";
type AccountCategory =
  | "cash"
  | "investment"
  | "property"
  | "vehicle"
  | "precious_metal"
  | "digital_asset"
  | "other";

// Balance model
interface AccountBalance {
  id: string;
  accountId: string;
  balance: number;
  availableBalance?: number;
  limit?: number;
  date: Date;
  isCurrent: boolean;
  source: "plaid" | "manual" | "kbb_api";
  createdAt: Date;
}

// Manual asset details (simplified for MVP)
interface ManualAsset {
  id: string;
  accountId: string;
  userId: string;
  description: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Net worth model
interface NetWorthSnapshot {
  id: string;
  userId: string;
  date: Date;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetBreakdown: AssetBreakdown;
  liabilityBreakdown: LiabilityBreakdown;
  createdAt: Date;
}

interface AssetBreakdown {
  cash: number;
  investments: number;
  property: number;
  vehicles: number;
  preciousMetals: number;
  digitalAssets: number;
  other: number;
}

interface LiabilityBreakdown {
  creditCards: number;
  mortgages: number;
  loans: number;
  other: number;
}

// Data refresh model
interface DataRefreshLog {
  id: string;
  userId: string;
  plaidItemId?: string;
  refreshType: "manual" | "scheduled" | "webhook";
  status: "pending" | "success" | "partial_success" | "failed";
  accountsUpdated: number;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
}
```

## Database Views

### Current Account Balances View

```sql
CREATE VIEW current_account_balances AS
SELECT
  a.id,
  a.user_id,
  a.name,
  a.type,
  a.category,
  a.institution_name,
  b.balance,
  b.available_balance,
  b.limit,
  b.date as balance_date,
  b.source
FROM accounts a
LEFT JOIN account_balances b ON a.id = b.account_id AND b.is_current = TRUE
WHERE a.is_active = TRUE;
```

### User Net Worth Summary View

```sql
CREATE VIEW user_net_worth_summary AS
WITH latest_snapshot AS (
  SELECT DISTINCT ON (user_id) *
  FROM net_worth_snapshots
  ORDER BY user_id, date DESC
)
SELECT
  u.id as user_id,
  u.email,
  COALESCE(s.net_worth, 0) as current_net_worth,
  COALESCE(s.total_assets, 0) as total_assets,
  COALESCE(s.total_liabilities, 0) as total_liabilities,
  s.date as last_updated
FROM users u
LEFT JOIN latest_snapshot s ON u.id = s.user_id;
```

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on all user-data tables
2. **Encryption**: Access tokens must be encrypted at the application level
3. **Audit Trail**: All data modifications should be logged
4. **Data Isolation**: Users can only access their own data

### Complete RLS Setup

```sql
-- Enable RLS on all user data tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE net_worth_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_refresh_logs ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY accounts_user_select ON accounts
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY accounts_user_insert ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY accounts_user_update ON accounts
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY accounts_user_delete ON accounts
  FOR DELETE USING (user_id = auth.uid());

-- Account balances policies (through account ownership)
CREATE POLICY account_balances_user_policy ON account_balances
  FOR ALL USING (
    account_id IN (
      SELECT id FROM accounts WHERE user_id = auth.uid()
    )
  );

-- Manual assets policies
CREATE POLICY manual_assets_user_policy ON manual_assets
  FOR ALL USING (user_id = auth.uid());

-- Plaid items policies
CREATE POLICY plaid_items_user_policy ON plaid_items
  FOR ALL USING (user_id = auth.uid());

-- Net worth snapshots policies
CREATE POLICY net_worth_snapshots_user_policy ON net_worth_snapshots
  FOR ALL USING (user_id = auth.uid());

-- Data refresh logs policies
CREATE POLICY data_refresh_logs_user_policy ON data_refresh_logs
  FOR ALL USING (user_id = auth.uid());
```

## Migration Strategy

1. Use a migration tool like Prisma Migrate or node-pg-migrate
2. Version all schema changes
3. Always include rollback scripts
4. Test migrations on a staging environment first
5. Backup production data before migrations

## Performance Optimization

1. **Indexes**: Created on all foreign keys and commonly queried fields
2. **Partitioning**: Consider partitioning `account_balances` by date for large datasets
3. **Materialized Views**: Use for complex aggregations
4. **Connection Pooling**: Implement at the application level
5. **Query Optimization**: Use EXPLAIN ANALYZE for slow queries

## Maintenance Tasks

1. **Daily**: Generate net worth snapshots for active users
2. **Weekly**: Clean up expired export files
3. **Monthly**: Archive old balance data (keep last 2 years active)
4. **Quarterly**: Analyze and optimize slow queries
