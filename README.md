# Morocco IT Internship Hub 🇲🇦

A premium, database-free aggregation platform for Web Development internships in Morocco. Optimized for Vercel's Serverless environment.

## ✨ Key Features
- **Multi-Source Scraping**: Real-time data from 9+ major Moroccan job boards (Rekrute, Stage.ma, Emploi.ma, etc.).
- **Smart IT Filter**: Exclusive technology-focused filtering (React, Laravel, Spring, etc.) to eliminate noise.
- **Production Performance**: Parallel fetching with `Promise.allSettled` and Proxy-fallbacks to ensure 100% uptime.
- **Modern UI**: High-end dark theme with Glassmorphism, unified card heights, and automated tech detection badges.
- **Database-Free**: Light, fast, and cost-effective—reliant entirely on live-scraping Server Actions.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Scraping**: Cheerio + AllOrigins Proxy Fallback
- **Icons**: Lucide React
- **Dates**: date-fns

## 🚀 Deployment
Created for **Vercel**. 
- Configured via `vercel.json` for extended function duration (15s) to support multiple concurrent scrapes.

## 🏃 Running Locally
```bash
npm install
npm run dev
```

## 📄 License
MIT
