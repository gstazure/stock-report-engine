import { NextRequest, NextResponse } from 'next/server'
import { fetchNews } from '../../../lib/newsFetcher.js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker') || 'AAPL'
    const useMock = searchParams.get('mock') === 'true'
    
    console.log(`Testing news fetch for ticker: ${ticker}, useMock: ${useMock}`)
    
    const articles = await fetchNews(ticker, { useMockData: useMock })
    
    return NextResponse.json({
      success: true,
      ticker: ticker,
      articles_count: articles.length,
      using_mock_data: useMock,
      articles: articles,
      message: useMock ? 'Using mock data' : 'Using real NewsAPI data'
    })
    
  } catch (error) {
    console.error('News fetch test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'News fetch test failed'
    }, { status: 500 })
  }
}