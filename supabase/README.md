# Supabase Migrations

This directory contains SQL migration files for the Stock Report Engine database schema.

## Migration Files

- `001_initial_schema.sql` - Creates all core tables for the application
- `001_initial_schema_rollback.sql` - Rollback script to drop all tables

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for development)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content of `001_initial_schema.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI (Recommended for production)

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not done already):
   ```bash
   supabase init
   ```

3. Link your project to Supabase:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Apply the migration:
   ```bash
   supabase db push
   ```

### Option 3: Manual SQL Execution

You can also run the SQL commands directly in any PostgreSQL client connected to your Supabase database.

## Tables Created

1. **users** - User accounts (minimal schema for now)
2. **reports** - Generated stock reports with status tracking
3. **report_base** - Cached static company information
4. **news_items** - News articles related to stock tickers
5. **filings** - SEC filings metadata (preparation for Phase 2)

## Rollback

If you need to rollback the migration, run the content of `001_initial_schema_rollback.sql` in the same way you applied the original migration.

## Notes

- All tables use UUID primary keys for better scalability
- Proper indexes are created for performance optimization
- Foreign key constraints ensure data integrity
- Check constraints validate data (e.g., report status values)
- Table and column comments provide documentation