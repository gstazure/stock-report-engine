import { NextResponse } from 'next/server'
import { userOperations } from '../../../lib/database'

export async function POST() {
  try {
    // Create a test user for demonstration
    const testUser = await userOperations.createUser('test@example.com')
    
    if (!testUser) {
      return NextResponse.json(
        { error: 'Failed to create test user' },
        { status: 500 }
      )
    }

    // Generate a test report
    const reportRequest = {
      user_id: testUser.id,
      ticker: 'BIRLACORP.NS'
    }

    // Call the generate endpoint
    const generateResponse = await fetch('http://localhost:3001/api/reports/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportRequest)
    })

    const reportResult = await generateResponse.json()

    return NextResponse.json({
      message: 'Test completed',
      test_user: testUser,
      report_result: reportResult,
      status: generateResponse.status
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}