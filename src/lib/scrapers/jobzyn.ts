import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription } from "../scraper-utils";

export const JobzynProvider: ScraperProvider = {
  name: "Jobzyn",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.jobzyn.com/fr/search?q=stage
      const searchUrl = `https://www.jobzyn.com/fr/search?q=stage&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a[href*="/jobs/"]').each((i, el) => {
        const title = $(el).find('h3').text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const company = $(el).find('p').first().text().trim() || "Entreprise Confidentielle";
        const dateStr = $(el).find('span').first().text().trim() || "Aujourd'hui";
        
        // Location is sometimes in the title like (City)
        const locationMatch = title.match(/\(([^)]+)\)/);
        const location = locationMatch ? locationMatch[1] : "Maroc";

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `jobzyn-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.jobzyn.com${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Jobzyn.com",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title),
          description: cleanDescription($(el).text().replace(title, "").replace(company, "").trim())
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Jobzyn failed", e);
      return []; 
    }
  }
}
