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