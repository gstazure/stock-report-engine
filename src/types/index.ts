// Database table types
export interface User {
  id: string
  email: string | null
  created_at: string
}

export interface Report {
  id: string
  user_id: string | null
  ticker: string | null
  status: 'queued' | 'running' | 'done' | 'failed' | null
  generated_at: string
  pdf_url: string | null
}

export interface ReportBase {
  ticker: string
  static_json: any | null // JSONB type
  last_full_generated_at: string | null
  news_cursor: string | null
}

export interface NewsItem {
  id: string
  ticker: string | null
  headline: string | null
  summary: string | null
  published_at: string | null
  url: string | null
  fingerprint: string | null
}

export interface Filing {
  id: string
  company_id: string | null
  filing_type: string | null
  filing_date: string | null
  file_url: string | null
  embedded: boolean | null
}

// Legacy types (keeping for backward compatibility)
export interface StockData {
  ticker: string
  companyName: string
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  marketCap: number
  volume: number
  peRatio: number
  dividend: number
}

export interface ReportData {
  id: string
  ticker: string
  createdAt: string
  reportContent: string
  status: 'generating' | 'completed' | 'error'
}

// Type aliases for easier use
export type ReportStatus = Report['status']
export type DatabaseTables = {
  users: User
  reports: Report
  report_base: ReportBase
  news_items: NewsItem
  filings: Filing
}