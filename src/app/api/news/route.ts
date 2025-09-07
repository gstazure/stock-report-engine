import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')
    
    let query = supabase
      .from('news_items')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20)

    if (ticker) {
      query = query.eq('ticker', ticker)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news items' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      news_items: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('List news error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}