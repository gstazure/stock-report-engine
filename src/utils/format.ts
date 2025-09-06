export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function validateTicker(ticker: string): boolean {
  // Basic ticker validation (1-5 uppercase letters)
  const tickerRegex = /^[A-Z]{1,5}$/
  return tickerRegex.test(ticker.trim())
}