# Stock Report Engine MVP

**Input ticker → Output PDF**

A modern web application that generates comprehensive stock analysis reports using AI and delivers them as downloadable PDF files.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Supabase (Database & Authentication)
- **AI**: Google Gemini API for report generation
- **PDF Generation**: jsPDF
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/gstazure/stock-report-engine.git
cd stock-report-engine
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual API keys:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GEMINI_API_KEY`: Your Google Gemini API key

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-report/
│   │       └── route.ts        # API endpoint for report generation
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── index.ts                # Component exports
├── lib/
│   ├── gemini.ts               # Gemini AI integration
│   └── supabase.ts             # Supabase client
├── types/
│   └── index.ts                # TypeScript type definitions
└── utils/
    └── format.ts               # Utility functions
```

## 🔧 Features

- ✅ Stock ticker input validation
- ✅ AI-powered report generation using Gemini
- ✅ PDF export functionality
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Modern Next.js App Router
- 🔄 Supabase integration (ready for database storage)

## 🚀 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gstazure/stock-report-engine)

Or deploy manually:

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 📝 API Endpoints

### POST `/api/generate-report`
Generates a stock analysis report and returns a PDF file.

**Request Body:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
- Success: PDF file download
- Error: JSON error message

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
