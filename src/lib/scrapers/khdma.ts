import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, cleanDescription, detectCity, cleanCompany, extractTechTags } from "../scraper-utils";

export const KhdmaProvider: ScraperProvider = {
  name: "Khdma.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const query = filters.q ? encodeURIComponent(filters.q) : "stage developpement informatique";
      const searchUrl = `https://khdma.ma/offres-emploi-maroc?term=${query}&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a.listing').each((i, el) => {
        const title = $(el).find('h4').text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const rawCompany = $(el).find('li:has(i.fa-briefcase)').text().trim();
        const rawLocation = $(el).find('li:has(i.fa-map-marker)').text().trim() || "Maroc";
        
        const dateStr = $(el).find('li div').text().trim() || "Aujourd'hui";
        const description = cleanDescription($(el).find('p').text().trim());

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `khdma-${i}-${Date.now()}`,
          title,
          company: cleanCompany(rawCompany),
          location: detectCity(title, description, rawLocation),
          url: url.startsWith('http') ? url : `https://khdma.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Khdma.ma",
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
