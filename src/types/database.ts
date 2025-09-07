export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string | null
          ticker: string | null
          status: 'queued' | 'running' | 'done' | 'failed' | null
          generated_at: string
          pdf_url: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          ticker?: string | null
          status?: 'queued' | 'running' | 'done' | 'failed' | null
          generated_at?: string
          pdf_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          ticker?: string | null
          status?: 'queued' | 'running' | 'done' | 'failed' | null
          generated_at?: string
          pdf_url?: string | null
        }
      }
      report_base: {
        Row: {
          ticker: string
          static_json: any | null
          last_full_generated_at: string | null
          news_cursor: string | null
        }
        Insert: {
          ticker: string
          static_json?: any | null
          last_full_generated_at?: string | null
          news_cursor?: string | null
        }
        Update: {
          ticker?: string
          static_json?: any | null
          last_full_generated_at?: string | null
          news_cursor?: string | null
        }
      }
      news_items: {
        Row: {
          id: string
          ticker: string | null
          headline: string | null
          summary: string | null
          published_at: string | null
          url: string | null
          fingerprint: string | null
        }
        Insert: {
          id?: string
          ticker?: string | null
          headline?: string | null
          summary?: string | null
          published_at?: string | null
          url?: string | null
          fingerprint?: string | null
        }
        Update: {
          id?: string
          ticker?: string | null
          headline?: string | null
          summary?: string | null
          published_at?: string | null
          url?: string | null
          fingerprint?: string | null
        }
      }
      filings: {
        Row: {
          id: string
          company_id: string | null
          filing_type: string | null
          filing_date: string | null
          file_url: string | null
          embedded: boolean | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          filing_type?: string | null
          filing_date?: string | null
          file_url?: string | null
          embedded?: boolean | null
        }
        Update: {
          id?: string
          company_id?: string | null
          filing_type?: string | null
          filing_date?: string | null
          file_url?: string | null
          embedded?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type ReportBase = Database['public']['Tables']['report_base']['Row']
export type NewsItem = Database['public']['Tables']['news_items']['Row']
export type Filing = Database['public']['Tables']['filings']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']
export type ReportBaseInsert = Database['public']['Tables']['report_base']['Insert']
export type NewsItemInsert = Database['public']['Tables']['news_items']['Insert']
export type FilingInsert = Database['public']['Tables']['filings']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']
export type ReportBaseUpdate = Database['public']['Tables']['report_base']['Update']
export type NewsItemUpdate = Database['public']['Tables']['news_items']['Update']
export type FilingUpdate = Database['public']['Tables']['filings']['Update']

export type ReportStatus = Report['status']