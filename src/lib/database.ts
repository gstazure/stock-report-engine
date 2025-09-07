import { supabase } from './supabase'
import type { 
  User, Report, NewsItem, ReportBase, Filing,
  UserInsert, ReportInsert, ReportBaseInsert, NewsItemInsert, FilingInsert,
  ReportUpdate
} from '../types/database'

// User operations
export const userOperations = {
  async createUser(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  }
}

// Report operations
export const reportOperations = {
  async createReport(userId: string, ticker: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        ticker,
        status: 'queued'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating report:', error)
      return null
    }
    return data
  },

  async updateReportStatus(
    reportId: string, 
    status: Report['status'], 
    pdfUrl?: string
  ): Promise<Report | null> {
    const updateData: ReportUpdate = { status }
    if (pdfUrl) updateData.pdf_url = pdfUrl

    const { data, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating report:', error)
      return null
    }
    return data
  },

  async getReportsByUser(userId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reports:', error)
      return []
    }
    return data || []
  },

  async getReportsByTicker(ticker: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('ticker', ticker)
      .order('generated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reports by ticker:', error)
      return []
    }
    return data || []
  }
}

// Report base operations (for caching)
export const reportBaseOperations = {
  async getReportBase(ticker: string): Promise<ReportBase | null> {
    const { data, error } = await supabase
      .from('report_base')
      .select('*')
      .eq('ticker', ticker)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching report base:', error)
      return null
    }
    return data
  },

  async upsertReportBase(reportBase: ReportBaseInsert): Promise<ReportBase | null> {
    const { data, error } = await supabase
      .from('report_base')
      .upsert(reportBase)
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting report base:', error)
      return null
    }
    return data
  }
}

// News operations
export const newsOperations = {
  async addNewsItem(newsItem: NewsItemInsert): Promise<NewsItem | null> {
    const { data, error } = await supabase
      .from('news_items')
      .insert(newsItem)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding news item:', error)
      return null
    }
    return data
  },

  async getNewsByTicker(ticker: string, limit = 10): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('ticker', ticker)
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching news:', error)
      return []
    }
    return data || []
  },

  async getNewsAfterCursor(ticker: string, cursor: string): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('ticker', ticker)
      .gt('published_at', cursor)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching news after cursor:', error)
      return []
    }
    return data || []
  }
}

// Filing operations (Phase 2 prep)
export const filingOperations = {
  async addFiling(filing: FilingInsert): Promise<Filing | null> {
    const { data, error } = await supabase
      .from('filings')
      .insert(filing)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding filing:', error)
      return null
    }
    return data
  },

  async getFilingsByCompany(companyId: string): Promise<Filing[]> {
    const { data, error } = await supabase
      .from('filings')
      .select('*')
      .eq('company_id', companyId)
      .order('filing_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching filings:', error)
      return []
    }
    return data || []
  },

  async markFilingEmbedded(filingId: string): Promise<Filing | null> {
    const { data, error } = await supabase
      .from('filings')
      .update({ embedded: true })
      .eq('id', filingId)
      .select()
      .single()
    
    if (error) {
      console.error('Error marking filing as embedded:', error)
      return null
    }
    return data
  }
}