export type ContractType = "remote" | "onsite" | "hybrid" | "unknown";
export type Language = "fr" | "en" | "unknown";
export type Source =
  | "Stage.ma"
  | "Rekrute"
  | "Khdma.ma"
  | "Emploi.ma"
  | "Indeed"
  | "MarocAnnonces"
  | "M-Job"
  | "OptionCarriere"
  | "Demo Data";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: ContractType;
  postedAt: string; // ISO string
  description: string;
  url: string;
  source: Source;
  language: Language;
  stack: string[];
  isNew: boolean; // posted within 48h
}

export interface ScrapeResult {
  jobs: JobListing[];
  meta: {
    sources: string[];
    total: number;
    cached: boolean;
    scrapedAt: string;
    errors: string[];
  };
}

export interface FilterParams {
  city?: string;
  lang?: string;
  contract?: string;
  stack?: string;
  query?: string;
}
