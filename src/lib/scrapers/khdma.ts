import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge } from "../scraper-utils";

export const KhdmaProvider: ScraperProvider = {
  name: "Khdma.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://khdma.ma/offres-emploi-maroc?term=stage+developpement+informatique
      const searchUrl = `https://khdma.ma/offres-emploi-maroc?term=stage+developpement+informatique&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a.listing').each((i, el) => {
        const title = $(el).find('h4').text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const company = $(el).find('li:has(i.fa-briefcase)').text().trim() || "Entreprise";
        const location = $(el).find('p').text().trim() || "Maroc";
        const dateStr = $(el).find('li div').text().trim() || "Aujourd'hui";

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `khdma-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://khdma.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Khdma.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: []
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Khdma failed", e);
      return []; 
    }
  }
}
