// News fetcher utility for stock tickers
// This module handles fetching news articles for stock analysis

/**
 * Fetches news articles for a given stock ticker using NewsAPI
 * @param {string} ticker - Stock ticker symbol (e.g., 'AAPL', 'BIRLACORP.NS')
 * @param {Object} options - Options for news fetching
 * @param {boolean} options.useMockData - Use mock data instead of real API (for testing)
 * @param {boolean} options.useDeterministicTimestamps - Use fixed timestamps for testing duplicates
 * @returns {Promise<Array>} Array of news articles
 */
export async function fetchNews(ticker, options = {}) {
  try {
    console.log(`Fetching news for ticker: ${ticker}`)
    
    const { useMockData = false, useDeterministicTimestamps = false } = options
    
    // If mock data is requested, return mock data
    if (useMockData) {
      return await fetchMockNews(ticker, { useDeterministicTimestamps })
    }
    
    // Fetch real news from NewsAPI
    return await fetchRealNews(ticker)
    
  } catch (error) {
    console.error(`Error fetching news for ticker ${ticker}:`, error)
    console.log('Falling back to mock data due to API error')
    // Fallback to mock data if real API fails
    return await fetchMockNews(ticker, options)
  }
}

/**
 * Fetches real news from NewsAPI.org
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<Array>} Array of news articles
 */
async function fetchRealNews(ticker) {
  const apiKey = process.env.NEWS_API_KEY
  
  if (!apiKey || apiKey === 'your_news_api_key_here') {
    throw new Error('NEWS_API_KEY not configured. Please add your NewsAPI key to .env.local')
  }
  
  // Clean the ticker for search (remove exchange suffixes like .NS, .BO)
  const cleanTicker = ticker.replace(/\.(NS|BO|L|TO|HK|SI)$/, '')
  
  // NewsAPI endpoint
  const baseUrl = 'https://newsapi.org/v2/everything'
  const params = new URLSearchParams({
    q: cleanTicker, // Search for the ticker symbol
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '10', // Limit to 10 articles
    apiKey: apiKey
  })
  
  const url = `${baseUrl}?${params}`
  
  console.log(`Calling NewsAPI: ${baseUrl}?q=${cleanTicker}&...`)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Stock-Report-Engine/1.0'
    }
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`NewsAPI request failed: ${response.status} ${response.statusText} - ${errorText}`)
  }
  
  const data = await response.json()
  
  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`)
  }
  
  console.log(`NewsAPI returned ${data.articles?.length || 0} articles`)
  
  // Transform NewsAPI response to our format
  const transformedArticles = (data.articles || []).map(article => ({
    headline: article.title || 'No title',
    summary: article.description || article.content?.substring(0, 200) + '...' || 'No summary available',
    published_at: article.publishedAt || new Date().toISOString(),
    url: article.url || '#',
    source: article.source?.name || 'Unknown',
    sentiment: 'neutral' // We could add sentiment analysis later
  })).filter(article => 
    // Filter out articles without proper content
    article.headline && 
    article.headline !== '[Removed]' && 
    article.summary && 
    article.summary !== '[Removed]'
  )
  
  console.log(`Filtered to ${transformedArticles.length} valid articles`)
  
  return transformedArticles
}

/**
 * Fetches mock news data (fallback or for testing)
 * @param {string} ticker - Stock ticker symbol
 * @param {Object} options - Options for mock data generation
 * @returns {Promise<Array>} Array of mock news articles
 */
async function fetchMockNews(ticker, options = {}) {
  const { useDeterministicTimestamps = false } = options
  
  // Base timestamp - use fixed time for deterministic testing or current time for realistic simulation
  const baseTime = useDeterministicTimestamps 
    ? new Date('2025-09-06T12:00:00.000Z').getTime()
    : Date.now()
  
  const mockNews = [
    {
      headline: `${ticker} Reports Strong Quarterly Earnings`,
      summary: `${ticker} exceeded expectations with strong quarterly results, showing robust growth in key business segments.`,
      published_at: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      url: `https://example.com/news/${ticker.toLowerCase()}-earnings`,
      source: 'Financial Times',
      sentiment: 'positive'
    },
    {
      headline: `Market Analysis: ${ticker} Shows Bullish Momentum`,
      summary: `Technical indicators suggest ${ticker} is positioned for continued growth with strong support levels.`,
      published_at: new Date(baseTime - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      url: `https://example.com/analysis/${ticker.toLowerCase()}-momentum`,
      source: 'MarketWatch',
      sentiment: 'positive'
    },
    {
      headline: `${ticker} Announces Strategic Partnership`,
      summary: `${ticker} has entered into a strategic partnership to expand its market presence and technological capabilities.`,
      published_at: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      url: `https://example.com/news/${ticker.toLowerCase()}-partnership`,
      source: 'Reuters',
      sentiment: 'positive'
    },
    {
      headline: `Industry Outlook: Challenges and Opportunities for ${ticker}`,
      summary: `Analysts discuss the current market conditions and their potential impact on ${ticker}'s future performance.`,
      published_at: new Date(baseTime - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      url: `https://example.com/outlook/${ticker.toLowerCase()}-industry`,
      source: 'Bloomberg',
      sentiment: 'neutral'
    }
  ]
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  console.log(`Generated ${mockNews.length} mock news articles for ${ticker}`)
  
  return mockNews
}

/**
 * Processes and filters news articles for relevance
 * @param {Array} newsArticles - Raw news articles
 * @param {string} ticker - Stock ticker for context
 * @returns {Array} Processed and filtered news articles
 */
export function processNews(newsArticles, ticker) {
  try {
    return newsArticles.map(article => ({
      ...article,
      ticker: ticker,
      fingerprint: `${ticker}-${article.headline.replace(/\s+/g, '-').toLowerCase()}-${Date.parse(article.published_at)}`,
      relevance_score: calculateRelevanceScore(article, ticker)
    })).filter(article => article.relevance_score > 0.3) // Filter out low relevance
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at)) // Sort by date
  } catch (error) {
    console.error('Error processing news articles:', error)
    return []
  }
}

/**
 * Calculates relevance score for a news article
 * @param {Object} article - News article object
 * @param {string} ticker - Stock ticker
 * @returns {number} Relevance score between 0 and 1
 */
function calculateRelevanceScore(article, ticker) {
  let score = 0.5 // Base score
  
  // Check if ticker is mentioned in headline
  if (article.headline.includes(ticker)) {
    score += 0.3
  }
  
  // Check if ticker is mentioned in summary
  if (article.summary.includes(ticker)) {
    score += 0.2
  }
  
  // Bonus for recent articles (last 24 hours)
  const articleAge = Date.now() - Date.parse(article.published_at)
  if (articleAge < 24 * 60 * 60 * 1000) {
    score += 0.1
  }
  
  return Math.min(score, 1.0) // Cap at 1.0
}