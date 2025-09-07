// Stock price fetcher utility using Playwright
// This module handles fetching current stock prices from Yahoo Finance and Google Finance

import { chromium } from 'playwright'

/**
 * Fetches current stock price and changes from multiple sources
 * @param {string} ticker - Stock ticker symbol (e.g., 'AAPL', 'BIRLACORP.NS')
 * @returns {Promise<Object>} Object containing price data
 */
export async function fetchStockPrice(ticker) {
  let browser = null
  
  try {
    console.log(`Fetching stock price for ticker: ${ticker}`)
    
    // Launch browser in headless mode for production
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    })
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })
    
    const page = await context.newPage()
    
    // Set a reasonable timeout
    page.setDefaultTimeout(30000)
    
    let priceData = null
    
    // Try Yahoo Finance first (usually more reliable for scraping)
    try {
      console.log('Trying Yahoo Finance...')
      priceData = await fetchFromYahooFinance(page, ticker)
    } catch (yahooError) {
      console.log('Yahoo Finance failed:', yahooError.message)
      
      // Fallback to Google Finance
      try {
        console.log('Trying Google Finance fallback...')
        priceData = await fetchFromGoogleFinance(page, ticker)
      } catch (googleError) {
        console.log('Google Finance also failed:', googleError.message)
        throw new Error('Both Yahoo Finance and Google Finance failed')
      }
    }
    
    if (!priceData) {
      throw new Error('No price data could be extracted')
    }
    
    console.log(`Successfully fetched price data for ${ticker}:`, priceData)
    return priceData
    
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error)
    
    // Return mock data on error
    return {
      ticker,
      last_traded_price: 150.75,
      change_abs: '+2.35',
      change_pct: '+1.58%',
      currency: determineCurrency(ticker),
      timestamp: new Date().toISOString(),
      source: 'Mock Data (Error Fallback)',
      error: error.message,
      note: 'Price fetching encountered an error, using mock data'
    }
    
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Attempts to fetch price data from Yahoo Finance
 * @param {Object} page - Playwright page object
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<Object>} Price data object
 */
async function fetchFromYahooFinance(page, ticker) {
  const yahooUrl = `https://finance.yahoo.com/quote/${ticker}`
  
  console.log(`Navigating to Yahoo Finance: ${yahooUrl}`)
  await page.goto(yahooUrl, { waitUntil: 'networkidle' })
  
  // Wait for page to load and take screenshot for debugging
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'debug-yahoo-finance.png', fullPage: true })
  
  // Try multiple Yahoo Finance selectors
  const priceSelectors = [
    '[data-testid="qsp-price"]',
    '[data-field="regularMarketPrice"]',
    'fin-streamer[data-field="regularMarketPrice"]',
    '[data-symbol="' + ticker + '"] [data-field="regularMarketPrice"]'
  ]
  
  let priceElement = null
  let priceText = null
  
  for (const selector of priceSelectors) {
    try {
      console.log(`Trying Yahoo selector: ${selector}`)
      await page.waitForSelector(selector, { timeout: 5000 })
      priceElement = await page.$(selector)
      if (priceElement) {
        priceText = await priceElement.textContent()
        if (priceText && !isNaN(parseFloat(priceText.replace(/[^0-9.-]/g, '')))) {
          console.log(`Found price with selector ${selector}: ${priceText}`)
          break
        }
      }
    } catch (e) {
      console.log(`Yahoo selector ${selector} failed: ${e.message}`)
    }
  }
  
  if (!priceText) {
    throw new Error('Could not find price on Yahoo Finance')
  }
  
  // Extract numeric price
  const numericPrice = parseFloat(priceText.replace(/[^0-9.-]/g, ''))
  
  if (isNaN(numericPrice) || numericPrice <= 0) {
    throw new Error(`Invalid price extracted from Yahoo: ${priceText}`)
  }
  
  // Try to get change data
  let changeAbs = 'N/A'
  let changePct = 'N/A'
  
  try {
    const changeElement = await page.$('[data-field="regularMarketChange"]')
    const changePctElement = await page.$('[data-field="regularMarketChangePercent"]')
    
    if (changeElement) {
      changeAbs = await changeElement.textContent()
    }
    if (changePctElement) {
      changePct = await changePctElement.textContent()
    }
  } catch (e) {
    console.log('Could not extract change data from Yahoo Finance')
  }
  
  return {
    ticker,
    last_traded_price: numericPrice,
    change_abs: changeAbs || 'N/A',
    change_pct: changePct || 'N/A',
    currency: determineCurrency(ticker, priceText),
    timestamp: new Date().toISOString(),
    source: 'Yahoo Finance'
  }
}

/**
 * Attempts to fetch price data from Google Finance
 * @param {Object} page - Playwright page object
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<Object>} Price data object
 */
async function fetchFromGoogleFinance(page, ticker) {
  const query = `${ticker} share price`
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  
  console.log(`Navigating to Google Finance: ${searchUrl}`)
  await page.goto(searchUrl, { waitUntil: 'networkidle' })
  
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'debug-google-finance.png', fullPage: true })
  
  // Try Google Finance selectors
  const googleSelectors = [
    "[jsname='vWLAgc']",
    "[data-attrid='Price'] .notranslate",
    ".XcVN5d",
    ".IsqQVc"
  ]
  
  let priceText = null
  
  for (const selector of googleSelectors) {
    try {
      console.log(`Trying Google selector: ${selector}`)
      await page.waitForSelector(selector, { timeout: 5000 })
      const element = await page.$(selector)
      if (element) {
        priceText = await element.textContent()
        if (priceText && !isNaN(parseFloat(priceText.replace(/[^0-9.-]/g, '')))) {
          console.log(`Found price with Google selector ${selector}: ${priceText}`)
          break
        }
      }
    } catch (e) {
      console.log(`Google selector ${selector} failed: ${e.message}`)
    }
  }
  
  if (!priceText) {
    throw new Error('Could not find price on Google Finance')
  }
  
  const numericPrice = parseFloat(priceText.replace(/[^0-9.-]/g, ''))
  
  if (isNaN(numericPrice) || numericPrice <= 0) {
    throw new Error(`Invalid price extracted from Google: ${priceText}`)
  }
  
  return {
    ticker,
    last_traded_price: numericPrice,
    change_abs: 'N/A',
    change_pct: 'N/A',
    currency: determineCurrency(ticker, priceText),
    timestamp: new Date().toISOString(),
    source: 'Google Finance'
  }
}

/**
 * Determines the likely currency based on ticker symbol and price format
 * @param {string} ticker - Stock ticker symbol
 * @param {string} priceText - Price text from the page (optional)
 * @returns {string} Currency code
 */
function determineCurrency(ticker, priceText = '') {
  // Indian exchanges
  if (ticker.endsWith('.NS') || ticker.endsWith('.BO')) {
    return 'INR'
  }
  
  // Other common patterns
  if (ticker.endsWith('.L')) {
    return 'GBP' // London Stock Exchange
  }
  
  if (ticker.endsWith('.TO')) {
    return 'CAD' // Toronto Stock Exchange
  }
  
  if (ticker.endsWith('.HK')) {
    return 'HKD' // Hong Kong Stock Exchange
  }
  
  if (ticker.endsWith('.SI')) {
    return 'SGD' // Singapore Exchange
  }
  
  // Check price text for currency symbols
  if (priceText) {
    if (priceText.includes('₹')) return 'INR'
    if (priceText.includes('£')) return 'GBP'
    if (priceText.includes('€')) return 'EUR'
    if (priceText.includes('¥')) return 'JPY'
    if (priceText.includes('$') && ticker.endsWith('.TO')) return 'CAD'
    if (priceText.includes('$')) return 'USD'
  }
  
  // Default to USD for US stocks and unknown tickers
  return 'USD'
}

/**
 * Validates if the fetched price data seems reasonable
 * @param {Object} priceData - Price data object to validate
 * @returns {boolean} True if data seems valid
 */
export function validatePriceData(priceData) {
  if (!priceData || typeof priceData !== 'object') {
    return false
  }
  
  // Check required fields
  const requiredFields = ['ticker', 'last_traded_price', 'change_abs', 'change_pct', 'currency']
  for (const field of requiredFields) {
    if (!(field in priceData)) {
      return false
    }
  }
  
  // Validate price is a positive number
  if (typeof priceData.last_traded_price !== 'number' || priceData.last_traded_price <= 0) {
    return false
  }
  
  return true
}