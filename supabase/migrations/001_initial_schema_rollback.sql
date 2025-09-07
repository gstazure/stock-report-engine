-- Rollback migration for: Initial schema for stock report engine
-- Description: Drops all tables created in the initial schema migration

-- Drop indexes first
DROP INDEX IF EXISTS idx_filings_filing_date;
DROP INDEX IF EXISTS idx_filings_filing_type;
DROP INDEX IF EXISTS idx_filings_company_id;

DROP INDEX IF EXISTS idx_news_items_fingerprint;
DROP INDEX IF EXISTS idx_news_items_published_at;
DROP INDEX IF EXISTS idx_news_items_ticker;

DROP INDEX IF EXISTS idx_reports_generated_at;
DROP INDEX IF EXISTS idx_reports_status;
DROP INDEX IF EXISTS idx_reports_ticker;
DROP INDEX IF EXISTS idx_reports_user_id;

-- Drop tables in reverse order (respecting foreign key dependencies)
DROP TABLE IF EXISTS filings;
DROP TABLE IF EXISTS news_items;
DROP TABLE IF EXISTS report_base;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;