"use client";

import { useState, useCallback, useRef } from "react";
import { JobListing, ScrapeResult } from "@/lib/types";

export interface UseJobsState {
  jobs: JobListing[];
  meta: (ScrapeResult["meta"] & { hasNextBatch?: boolean }) | null;
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  batch: number;
}

export function useJobs() {
  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    meta: null,
    isLoading: false,
    error: null,
    hasLoaded: false,
    batch: 0,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchJobs = useCallback(
    async (
      params: {
        city?: string;
        lang?: string;
        contract?: string;
        stack?: string;
        query?: string;
        batch?: number;
      } = {},
      append = false
    ) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const batchToFetch = params.batch ?? 0;
        const qs = new URLSearchParams();
        if (params.city) qs.set("city", params.city);
        if (params.lang) qs.set("lang", params.lang);
        if (params.contract) qs.set("contract", params.contract);
        if (params.stack) qs.set("stack", params.stack);
        if (params.query) qs.set("query", params.query);
        qs.set("batch", batchToFetch.toString());

        const res = await fetch(`/api/scrape?${qs.toString()}`, {
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data: ScrapeResult & { meta: { hasNextBatch: boolean } } = await res.json();

        setState((prev) => ({
          jobs: append ? [...prev.jobs, ...(data.jobs || [])] : (data.jobs || []),
          meta: data.meta,
          isLoading: false,
          error: null,
          hasLoaded: true,
          batch: batchToFetch,
        }));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: (err as Error).message,
          hasLoaded: true,
        }));
      }
    },
    []
  );

  return { ...state, fetchJobs };
}
