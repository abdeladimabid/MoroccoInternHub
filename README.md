# 🇲🇦 Morocco Internship Hub (InternHub)

A modern, high-performance internship aggregator designed for Moroccan students. This platform scrapes **8 major Moroccan job boards** in real-time, providing a unified, student-first dashboard with advanced filtering and progressive loading.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cheerio](https://img.shields.io/badge/Cheerio-E88C1F?style=for-the-badge&logo=cheerio&logoColor=white)

## ✨ Features

- **🚀 Real-time Scraping:** No database required. Results are fetched live from 8 platforms on every visit.
- **⚡ Progressive Loading:** Optimized performance using a 3-batch scraping strategy that loads the fastest sites first.
- **🔍 Advanced Filtering:** Filter by City (Casa, Rabat, etc.), Tech Stack (React, PHP, Node.js), Contract Type (Hybrid, Remote), and Language (FR/EN).
- **📱 Premium UI:** Student-first dark mode with glassmorphism, gradient avatars, and smooth animations.
- **⚡ Instant Search:** Client-side debounced search with a powerful `/` keyboard shortcut.
- **♻️ SWR Caching:** In-memory Stale-While-Revalidate caching for lightning-fast repeat visits.

## 🌐 Integrated Platforms

The Hub aggregates data from:
1. **Stage.ma**
2. **Rekrute.com**
3. **MarocAnnonces**
4. **Khdma.ma**
5. **Emploi.ma**
6. **M-Job**
7. **Indeed Morocco**
8. **OptionCarriere**

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Vanilla CSS + Tailwind Utility Tokens
- **Logic:** TypeScript
- **Scraping:** Cheerio + Axios
- **Icons:** Lucide React
- **Hosting:** Optimized for Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdeladimabid/MoroccoInternHub.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Deployment

This project is ready for Vercel. 
Note: The scraping routes have a configured `maxDuration` of 30s in `vercel.json` to allow for concurrent scraping lattice.

## 📄 License

MIT
