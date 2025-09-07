# Database Setup Guide

This guide will help you set up the Supabase database tables for the Stock Report Engine.

## Prerequisites

1. A Supabase project set up
2. Environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 1: Apply Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Go to the **SQL Editor** tab
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

### Option B: Using Supabase CLI

If you prefer using the CLI:

```powershell
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project (replace YOUR_PROJECT_REF with your actual project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Push the database changes
supabase db push
```

## Step 2: Verify Setup

After applying the migration, run the validation script:

```powershell
npm run validate-db
```

This will:
- Test database connectivity
- Verify all tables exist
- Confirm proper typing is working

## Step 3: Start Using the Database

Import the database operations in your code:

```typescript
import { 
  userOperations, 
  reportOperations, 
  newsOperations, 
  reportBaseOperations,
  filingOperations 
} from './src/lib/database'

// Example: Create a new user
const user = await userOperations.createUser('user@example.com')

// Example: Create a new report
const report = await reportOperations.createReport(user.id, 'AAPL')

// Example: Add news item
const newsItem = await newsOperations.addNewsItem({
  ticker: 'AAPL',
  headline: 'Apple reports strong quarterly earnings',
  summary: 'Apple exceeded expectations...',
  published_at: new Date().toISOString(),
  url: 'https://example.com/news',
  fingerprint: 'unique-news-id'
})
```

## Database Schema Overview

### Tables Created:

1. **users** - User accounts
   - `id` (UUID, primary key)
   - `email` (text, unique)
   - `created_at` (timestamp)

2. **reports** - Generated stock reports
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to users)
   - `ticker` (text)
   - `status` (enum: 'queued', 'running', 'done', 'failed')
   - `generated_at` (timestamp)
   - `pdf_url` (text)

3. **report_base** - Cached static company information
   - `ticker` (text, primary key)
   - `static_json` (JSONB)
   - `last_full_generated_at` (timestamp)
   - `news_cursor` (timestamp)

4. **news_items** - News articles for tickers
   - `id` (UUID, primary key)
   - `ticker` (text)
   - `headline` (text)
   - `summary` (text)
   - `published_at` (timestamp)
   - `url` (text)
   - `fingerprint` (text, unique)

5. **filings** - SEC filings metadata (Phase 2)
   - `id` (UUID, primary key)
   - `company_id` (text)
   - `filing_type` (text)
   - `filing_date` (date)
   - `file_url` (text)
   - `embedded` (boolean)

## Key Features

- **Type Safety**: Full TypeScript support with proper Supabase typing
- **Performance**: Optimized indexes for common queries
- **Data Integrity**: Foreign key constraints and check constraints
- **Caching**: Report base table for avoiding redundant API calls
- **Incremental Updates**: News cursor for efficient news fetching
- **Future Ready**: Filings table prepared for Phase 2 features

## Rollback

If you need to rollback the migration:

1. Go to Supabase SQL Editor
2. Copy content from `supabase/migrations/001_initial_schema_rollback.sql`
3. Execute the rollback script

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Ensure your Supabase API key has the necessary permissions
2. **Connection Issues**: Check your environment variables are correct
3. **Type Errors**: Make sure you're importing types from `src/types/database`

### Getting Help:

- Check the validation script output for specific error messages
- Review Supabase dashboard logs for detailed error information
- Ensure all environment variables are properly set

## Next Steps

After successful setup:
1. Update your existing API routes to use the new database operations
2. Implement user authentication flows
3. Set up report generation workflows
4. Integrate news fetching with caching

Your database is now ready for the Stock Report Engine! 🚀