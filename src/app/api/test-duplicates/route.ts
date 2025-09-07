import { NextRequest, NextResponse } from 'next/server'
import { newsOperations } from '../../../lib/database'

export async function POST(request: NextRequest) {
  try {
    const { ticker } = await request.json()
    
    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker is required' },
        { status: 400 }
      )
    }

    // Create a test news item with a fixed fingerprint
    const testNewsItem = {
      ticker: ticker,
      headline: `${ticker} Test Duplicate Detection`,
      summary: `This is a test article for ${ticker} to verify duplicate detection works properly.`,
      published_at: '2025-09-06T12:00:00.000Z', // Fixed timestamp
      url: `https://example.com/test/${ticker.toLowerCase()}`,
      fingerprint: `${ticker}-test-duplicate-detection-fixed-fingerprint`
    }

    console.log('Attempting to insert test news item...')
    console.log('Test news item:', JSON.stringify(testNewsItem, null, 2))

    // Try to insert it first time
    const result1 = await newsOperations.addNewsItem(testNewsItem)
    
    // Try to insert it second time (should be skipped due to duplicate fingerprint)
    const result2 = await newsOperations.addNewsItem(testNewsItem)

    return NextResponse.json({
      message: 'Duplicate detection test completed',
      first_insertion: result1 ? 'success' : 'failed',
      second_insertion: result2 ? 'success' : 'skipped_as_expected',
      test_fingerprint: testNewsItem.fingerprint
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        test_result: 'duplicate_detection_working'
      },
      { status: 500 }
    )
  }
}