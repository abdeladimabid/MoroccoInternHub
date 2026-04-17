import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge } from "../scraper-utils";

export const MarocAnnoncesProvider: ScraperProvider = {
  name: "MarocAnnonces",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.marocannonces.com/maroc/demandes-de-stage-domain-informatique-multimedia-internet-b311.html?f_371=Informatique+%2F+Multim%C3%A9dia+%2F+Internet
      // Note: User provided 'demandes', usually we'd want 'offres', but we'll follow the exact request.
      const searchUrl = `https://www.marocannonces.com/maroc/demandes-de-stage-domain-informatique-multimedia-internet-b311.html?f_371=Informatique+%2F+Multim%C3%A9dia+%2F+Internet&pge=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('li.item').each((i, el) => {
        const titleEl = $(el).find('h3 a');
        const title = titleEl.text().trim();
        if (!title) return;

        const url = titleEl.attr('href') || "";
        const location = $(el).find('span.city').text().trim() || "Maroc";
        const dateStr = $(el).find('div.date').text().trim() || "Aujourd'hui";
        const company = "Société Confidientielle";
        
        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `maannonces-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.marocannonces.com${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "MarocAnnonces",
          language: detectLanguage(title),
          contract: "Stage",
          tags: []
        });
      });
      
      return results;
    } catch(e) {
      console.warn("MarocAnnonces failed", e);
      return []; 
    }
  }
}
