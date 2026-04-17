"use server"

import { StageMaProvider } from "./scrapers/stage-ma";
import { RekruteProvider } from "./scrapers/rekrute";
import { EmploiMaProvider } from "./scrapers/emploi-ma";
import { JobzynProvider } from "./scrapers/jobzyn";
import { MarocAnnoncesProvider } from "./scrapers/maroc-annonces";
import { KhdmaProvider } from "./scrapers/khdma";
import { PostuleProvider } from "./scrapers/postule.ma";
import { OneJobProvider } from "./scrapers/onejob.ma";
import { StagiairesProvider } from "./scrapers/stagiaires.ma";
import { FilterOptions, InternshipOffer } from "./scrapers/types";

// Combine all our NEW providers (Only those requested by user)
const providers = [
  StageMaProvider, 
  RekruteProvider, 
  EmploiMaProvider, 
  JobzynProvider, 
  MarocAnnoncesProvider, 
  KhdmaProvider, 
  PostuleProvider, 
  OneJobProvider, 
  StagiairesProvider
]; 

export async function fetchInternshipsAction(page: number, filters: FilterOptions) {
  // Promise.allSettled to ensure that one failure doesn't break everything.
  const results = await Promise.allSettled(
    providers.map(p => p.fetch(page, filters))
  );
  
  const allOffers: InternshipOffer[] = [];
  
  results.forEach(res => {
    if (res.status === "fulfilled") {
        allOffers.push(...res.value);
    } else {
        console.warn("A scraper failed with error:", res.reason);
    }
  });
  
  // Sort by newest first
  allOffers.sort((a, b) => a.ageInDays - b.ageInDays);
  
  if (page === 1) {
    // Filter for last month if available, strictly for the first page
    const recentOffers = allOffers.filter(o => o.ageInDays <= 30);
    if (recentOffers.length > 0) {
       return recentOffers;
    }
  }
  
  return allOffers;
}
