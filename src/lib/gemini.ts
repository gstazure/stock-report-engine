import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(apiKey)

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function generateStockReport(ticker: string): Promise<string> {
  const prompt = `Generate a comprehensive stock analysis report for ${ticker}. Include:
  1. Company Overview
  2. Financial Performance Analysis
  3. Market Position and Competitive Analysis
  4. Risk Assessment
  5. Investment Recommendation
  
  Format the report in a professional, structured manner suitable for PDF generation.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating stock report:', error)
    throw new Error('Failed to generate stock report')
  }
}