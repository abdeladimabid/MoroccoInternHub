import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/cache";
import { scrapeBatch } from "@/lib/scrapers";
import { JobListing, FilterParams } from "@/lib/types";

const CACHE_KEY = "jobs:all";

function filterJobs(jobs: JobListing[], params: FilterParams): JobListing[] {
  let filtered = jobs;

  if (params.city && params.city !== "all") {
    const city = params.city.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.location.toLowerCase().includes(city) ||
        city === "maroc" // show all if "maroc" selected
    );
  }

  if (params.lang && params.lang !== "all") {
    filtered = filtered.filter((j) => j.language === params.lang);
  }

  if (params.contract && params.contract !== "all") {
    filtered = filtered.filter((j) => j.contractType === params.contract);
  }

  if (params.stack && params.stack !== "all") {
    const stackFilter = params.stack.toLowerCase();
    filtered = filtered.filter((j) =>
      j.stack.some((s) => s.toLowerCase().includes(stackFilter))
    );
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const batch = parseInt(searchParams.get("batch") || "0");
  const params: FilterParams = {
    city: searchParams.get("city") || "all",
    lang: searchParams.get("lang") || "all",
    contract: searchParams.get("contract") || "all",
    stack: searchParams.get("stack") || "all",
    query: searchParams.get("query") || "",
  };

  const batchCacheKey = `${CACHE_KEY}:batch:${batch}`;

  // Check fresh cache
  const cached = cache.get<JobListing[]>(batchCacheKey);
  if (cached) {
    const filtered = filterJobs(cached, params);
    return NextResponse.json(
      {
        jobs: filtered,
        meta: {
          sources: ["cache"],
          total: filtered.length,
          cached: true,
          scrapedAt: new Date(Date.now() - cache.getAge(batchCacheKey)).toISOString(),
          errors: [],
          hasNextBatch: batch < 2, // We have 3 batches (0, 1, 2)
        },
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }

  // No cache — scrape live
  try {
    const { jobs, sources, errors, hasNextBatch } = await scrapeBatch(batch);
    cache.set(batchCacheKey, jobs);
    const filtered = filterJobs(jobs, params);

    return NextResponse.json(
      {
        jobs: filtered,
        meta: {
          sources,
          total: filtered.length,
          cached: false,
          scrapedAt: new Date().toISOString(),
          errors,
          hasNextBatch,
        },
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("[API] Scrape error:", err);
    return NextResponse.json(
      { error: "Failed to scrape job boards", jobs: [], meta: { total: 0 } },
      { status: 500 }
    );
  }
}
