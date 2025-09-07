import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed',
          error: error.message 
        },
        { status: 500 }
      )
    }

    // Test each table exists
    const tables = ['users', 'reports', 'report_base', 'news_items', 'filings']
    const tableStatus = {}
    
    for (const table of tables) {
      try {
        await supabase.from(table).select('*').limit(1)
        tableStatus[table] = 'exists'
      } catch (tableError) {
        tableStatus[table] = 'missing'
      }
    }

    const allTablesExist = Object.values(tableStatus).every(status => status === 'exists')

    return NextResponse.json({
      success: true,
      message: allTablesExist 
        ? 'Database setup complete! All tables are ready.' 
        : 'Database connected but some tables are missing. Please apply the migration.',
      connection: 'connected',
      tables: tableStatus,
      needsMigration: !allTablesExist
    })
    
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Validation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}