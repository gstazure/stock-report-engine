import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const ticker = searchParams.get('ticker')
    
    let query = supabase
      .from('reports')
      .select(`
        id,
        user_id,
        ticker,
        status,
        generated_at,
        pdf_url,
        users!inner(email)
      `)
      .order('generated_at', { ascending: false })
      .limit(20)

    if (user_id) {
      query = query.eq('user_id', user_id)
    }
    
    if (ticker) {
      query = query.eq('ticker', ticker)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reports: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('List reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}