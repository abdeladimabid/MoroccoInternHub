import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription, detectCity, cleanCompany } from "../scraper-utils";

export const RekruteProvider: ScraperProvider = {
  name: "Rekrute",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const query = filters.q ? encodeURIComponent(filters.q) : "developpeur";
      const searchUrl = `https://www.rekrute.com/offres.html?p=${page}&s=3&keyword=${query}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('#post-data .post-id').each((i, el) => {
        const fullTitle = $(el).find('h2 a').text().trim();
        const title = fullTitle.includes('|') ? fullTitle.split('|')[0].trim() : fullTitle;
        const locationFromTitle = fullTitle.includes('|') ? fullTitle.split('|')[1].trim() : "";
        
        const url = $(el).find('h2 a').attr('href') || "";
        const rawDate = $(el).find('.date').text().trim().replace(/\n/g, '').replace(/\t/g, ''); 
        const dateStr = cleanDescription(rawDate) || "Aujourd'hui";
        
        const rawCompany = $(el).find('.logo img').attr('alt') || $(el).find('h2').next().text().trim();
        const infoText = $(el).find('.info').text().trim();
        const rawLocation = locationFromTitle || (infoText.includes('|') ? infoText.split('|')[0].trim() : "Maroc");
        
        if (!title) return;
        if (!isRelevantITOffer(title)) return;
        
        if(filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        const description = cleanDescription(infoText);

        results.push({
          id: `rekrute-${i}-${Date.now()}`,
          title,
          company: cleanCompany(rawCompany),
          location: detectCity(title, description, rawLocation),
          url: url.startsWith('http') ? url : `https://www.rekrute.com${url}`,
          dateStr: dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Rekrute",
          language: detectLanguage(title),
          contract: infoText.toLowerCase().includes('télétravail') ? "Télétravail" : "Stage",
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
