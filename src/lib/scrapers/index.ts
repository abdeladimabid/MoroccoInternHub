import { JobListing } from "@/lib/types";
import { scrapeStage } from "./stage-ma";
import { scrapeRekrute } from "./rekrute";
import { scrapeKhdma } from "./khdma";
import { scrapeEmploi } from "./emploi-ma";
import { scrapeIndeed } from "./indeed-ma";
import { scrapeMarocAnnonces } from "./maroc-annonces";
import { scrapeMJob } from "./m-job";
import { scrapeOptionCarriere } from "./option-carriere";
import { MOCK_JOBS } from "./mock-data";

export interface ScraperResult {
  source: string;
  jobs: JobListing[];
  success: boolean;
  error?: string;
}

const BATCHES = [
  // Batch 1: Fast & Primary (Target 12)
  [
    { name: "Stage.ma", fn: scrapeStage },
    { name: "Rekrute", fn: scrapeRekrute },
    { name: "MarocAnnonces", fn: scrapeMarocAnnonces },
  ],
  // Batch 2: Intermediate (Target 12)
  [
    { name: "Khdma.ma", fn: scrapeKhdma },
    { name: "Emploi.ma", fn: scrapeEmploi },
    { name: "M-Job", fn: scrapeMJob },
  ],
  // Batch 3: Slow/Meta (Target 12)
  [
    { name: "Indeed", fn: scrapeIndeed },
    { name: "OptionCarriere", fn: scrapeOptionCarriere },
  ],
];

const ITEMS_PER_PAGE = 12;

export async function scrapeBatch(batchIndex: number): Promise<{
  jobs: JobListing[];
  sources: string[];
  errors: string[];
  hasNextBatch: boolean;
}> {
  const currentIndex = Math.max(0, Math.min(batchIndex, BATCHES.length - 1));
  const batch = BATCHES[currentIndex];

  const results = await Promise.allSettled(
    batch.map(async ({ name, fn }) => {
      try {
        const jobs = await fn();
        return { name, jobs };
      } catch (err) {
        throw new Error(`${name}: ${(err as Error).message}`);
      }
    })
  );

  let jobs: JobListing[] = [];
  const sources: string[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { name, jobs: scraperJobs } = result.value;
      if (scraperJobs.length > 0) {
        jobs.push(...scraperJobs);
        sources.push(name);
      } else {
        errors.push(`${name}: no results`);
      }
    } else {
      errors.push(result.reason.message || "Unknown scraper error");
    }
  }

  // ENFORCE 12 OFFERS PER PAGE
  // 1. Sort by date (newest first) if we have many
  jobs = jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  // 2. If we have less than 12 real results, fill the gap with UNIQUE mock data for this batch
  if (jobs.length < ITEMS_PER_PAGE) {
    const start = currentIndex * ITEMS_PER_PAGE;
    const mockPool = MOCK_JOBS.slice(start, start + ITEMS_PER_PAGE);
    
    // Supplement with mock items that aren't already represented by title/company
    for (const mock of mockPool) {
      if (jobs.length >= ITEMS_PER_PAGE) break;
      const alreadyExists = jobs.some(j => j.title === mock.title && j.company === mock.company);
      if (!alreadyExists) {
        jobs.push(mock);
        if (!sources.includes("Demo Data")) sources.push("Demo Data");
      }
    }
    
    // If still less than 12 (unlikely with 12 mock items pool), just take whatever we can from mock pool
    if (jobs.length < ITEMS_PER_PAGE) {
       const missing = ITEMS_PER_PAGE - jobs.length;
       const extras = mockPool.filter(m => !jobs.some(j => j.id === m.id)).slice(0, missing);
       jobs.push(...extras);
    }
  }

  // 3. Strict 12 items limit
  const finalJobs = jobs.slice(0, ITEMS_PER_PAGE);

  return { 
    jobs: finalJobs, 
    sources, 
    errors,
    hasNextBatch: currentIndex < BATCHES.length - 1 
  };
}

/** Legacy support for full scrape (not used in progressive UI) */
export async function scrapeAll(): Promise<{
  jobs: JobListing[];
  sources: string[];
  errors: string[];
}> {
  const { jobs: j1, sources: s1, errors: e1 } = await scrapeBatch(0);
  const { jobs: j2, sources: s2, errors: e2 } = await scrapeBatch(1);
  const { jobs: j3, sources: s3, errors: e3 } = await scrapeBatch(2);
  
  return {
    jobs: [...j1, ...j2, ...j3],
    sources: [...s1, ...s2, ...s3],
    errors: [...e1, ...e2, ...e3],
  };
}
