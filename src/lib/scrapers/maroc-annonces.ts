import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, detectCity, cleanCompany, cleanDescription } from "../scraper-utils";

export const MarocAnnoncesProvider: ScraperProvider = {
  name: "MarocAnnonces",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const searchUrl = `https://www.marocannonces.com/maroc/offres-emploi-domaine-informatique-multimedia-b313.html?pge=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('h3').each((i, el) => {
        const titleEl = $(el).find('a');
        const title = titleEl.text().trim();
        if (!title) return;

        const url = titleEl.attr('href') || "";
        const container = $(el).closest('li, .clearing-box, div');
        const location = container.find('.city, span:contains("Casablanca"), span:contains("Rabat")').first().text().trim() || "Maroc";
        const dateStr = container.find('.date, time, .pub-date').text().trim() || "Récemment";
        
        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        const description = cleanDescription(container.find('.description, p, .snippet').text().trim());

        results.push({
          id: `maannonces-${i}-${Date.now()}`,
          title,
          company: cleanCompany("Société Confidentielle"),
          location: detectCity(title, description, location),
          url: url.startsWith('http') ? url : `https://www.marocannonces.com${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "MarocAnnonces",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title, description),
          description: description
        });
      });
      
      return results;
    } catch(e) {
      return []; 
    }
  }
}
