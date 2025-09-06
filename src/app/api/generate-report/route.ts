import { NextRequest, NextResponse } from 'next/server'
import { generateStockReport } from '@/lib/gemini'
import jsPDF from 'jspdf'

export async function POST(request: NextRequest) {
  try {
    const { ticker } = await request.json()

    if (!ticker) {
      return NextResponse.json(
        { error: 'Stock ticker is required' },
        { status: 400 }
      )
    }

    // Generate report using Gemini AI
    const reportContent = await generateStockReport(ticker.toUpperCase())

    // Create PDF
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxLineWidth = pageWidth - 2 * margin
    
    // Title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Stock Analysis Report: ${ticker.toUpperCase()}`, margin, 30)
    
    // Date
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 45)
    
    // Report content
    pdf.setFontSize(11)
    const lines = pdf.splitTextToSize(reportContent, maxLineWidth)
    let yPosition = 60
    
    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(lines[i], margin, yPosition)
      yPosition += 6
    }

    // Convert PDF to buffer
    const pdfBuffer = pdf.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${ticker.toUpperCase()}_report.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}