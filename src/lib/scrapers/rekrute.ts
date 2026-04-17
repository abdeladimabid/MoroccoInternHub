import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription } from "../scraper-utils";

export const RekruteProvider: ScraperProvider = {
  name: "Rekrute",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // Rekrute uses different structure. Adding "keyword=developpeur" ensures better base results
      const searchUrl = `https://www.rekrute.com/offres.html?p=${page}&s=3&keyword=developpeur`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('#post-data .post-id').each((i, el) => {
        const title = $(el).find('h2 a').text().trim();
        const url = $(el).find('h2 a').attr('href') || "";
        const rawDate = $(el).find('.date').text().trim().replace(/\n/g, '').replace(/\t/g, ''); 
        const company = $(el).find('.logo img').attr('alt') || $(el).find('h2').next().text().trim() || "Unknown Company";
        const locationPart = $(el).find('.info').text().trim();
        const location = locationPart.split('|')[0] || "Maroc";
        
        if (!title) return;
        if (!isRelevantITOffer(title)) return;
        
        if(filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `rekrute-${i}-${Date.now()}`,
          title,
          company,
          location: location.trim(),
          url: url.startsWith('http') ? url : `https://www.rekrute.com${url}`,
          dateStr: rawDate || "Aujourd'hui",
          ageInDays: parseDateAge(rawDate || "Aujourd'hui"),
          source: "Rekrute",
          language: detectLanguage(title),
          contract: locationPart.toLowerCase().includes('télétravail') ? "Télétravail" : "Stage",
          tags: extractTechTags(title),
          description: cleanDescription($(el).find('.details').text().trim() || $(el).find('p').text().trim())
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Rekrute failed", e);
      return []; 
    }
  }
}
