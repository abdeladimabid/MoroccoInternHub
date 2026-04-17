export interface InternshipOffer {
  id: string; // unique hash or url
  title: string;
  company: string;
  location: string;
  url: string;
  dateStr: string;
  ageInDays: number;
  source: string;
  language: "FR" | "EN";
  contract: "Stage" | "Télétravail" | "Sur site";
  tags: string[]; // e.g. React, Laravel
  description?: string;
}

export interface FilterOptions {
  q?: string;
  region?: string;
  contract?: "Stage" | "Télétravail" | "Sur site" | "All" | string;
}

export interface ScraperProvider {
  name: string;
  fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]>;
}
