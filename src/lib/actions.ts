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
  
  let allOffers: InternshipOffer[] = [];
  
  results.forEach(res => {
    if (res.status === "fulfilled") {
        allOffers.push(...res.value);
    } else {
        console.warn("A scraper failed with error:", res.reason);
    }
  });

  // --- REINFORCE FILTERING ---
  // Some scrapers might return irrelevant results (fuzzy search, etc.)
  if (filters.q || filters.region || filters.contract) {
    const q = filters.q?.toLowerCase();
    const region = filters.region?.toLowerCase();
    const contract = filters.contract?.toLowerCase();

    allOffers = allOffers.filter(offer => {
      // Search query check (Title, Description, or Company)
      if (q) {
        const matchesQ = 
          offer.title.toLowerCase().includes(q) || 
          (offer.description?.toLowerCase().includes(q) ?? false) ||
          offer.company.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // Region check
      if (region && !offer.location.toLowerCase().includes(region)) {
        return false;
      }

      // Contract check
      if (contract && !offer.contract.toLowerCase().includes(contract)) {
        return false;
      }

      return true;
    });
  }
  
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
