-- Migration: Initial schema for stock report engine
-- Created: 2025-09-07
-- Description: Creates all core tables for the stock report engine application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (minimal for now)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  ticker TEXT,
  status TEXT CHECK (status IN ('queued', 'running', 'done', 'failed')),
  generated_at TIMESTAMP DEFAULT NOW(),
  pdf_url TEXT
);

-- Report base table (cached static info)
CREATE TABLE report_base (
  ticker TEXT PRIMARY KEY,
  static_json JSONB,
  last_full_generated_at TIMESTAMP,
  news_cursor TIMESTAMP
);

-- News items table
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT,
  headline TEXT,
  summary TEXT,
  published_at TIMESTAMP,
  url TEXT,
  fingerprint TEXT UNIQUE
);

-- Filings metadata table (Phase 2 prep)
CREATE TABLE filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT,
  filing_type TEXT,
  filing_date DATE,
  file_url TEXT,
  embedded BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_ticker ON reports(ticker);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);

CREATE INDEX idx_news_items_ticker ON news_items(ticker);
CREATE INDEX idx_news_items_published_at ON news_items(published_at);
CREATE INDEX idx_news_items_fingerprint ON news_items(fingerprint);

CREATE INDEX idx_filings_company_id ON filings(company_id);
CREATE INDEX idx_filings_filing_type ON filings(filing_type);
CREATE INDEX idx_filings_filing_date ON filings(filing_date);

-- Add comments to tables for documentation
COMMENT ON TABLE users IS 'User accounts for the stock report engine';
COMMENT ON TABLE reports IS 'Generated stock reports with their status and metadata';
COMMENT ON TABLE report_base IS 'Cached static information for stock tickers to avoid redundant API calls';
COMMENT ON TABLE news_items IS 'News articles related to specific stock tickers';
COMMENT ON TABLE filings IS 'SEC filings metadata for companies (Phase 2 preparation)';

-- Add comments to important columns
COMMENT ON COLUMN reports.status IS 'Report generation status: queued, running, done, failed';
COMMENT ON COLUMN report_base.static_json IS 'Cached static company information in JSON format';
COMMENT ON COLUMN report_base.news_cursor IS 'Timestamp cursor for incremental news fetching';
COMMENT ON COLUMN news_items.fingerprint IS 'Unique identifier to prevent duplicate news items';
COMMENT ON COLUMN filings.embedded IS 'Whether the filing content has been processed for embeddings';