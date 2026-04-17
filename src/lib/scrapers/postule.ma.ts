import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge } from "../scraper-utils";

export const PostuleProvider: ScraperProvider = {
  name: "Postule.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.postule.ma/jobs?search=Développeur+Web+Stage&page=1
      const searchUrl = `https://www.postule.ma/jobs?search=D%C3%A9veloppeur+Web+Stage&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a.cursor-pointer').each((i, el) => {
        const title = $(el).find('h3').first().text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const company = $(el).find('h3 + div').text().trim() || "Entreprise";
        const location = $(el).find('i.pi-map-marker + span').text().trim() || "Maroc";
        
        let dateStr = "Aujourd'hui";
        $(el).find('div').each((_, div) => {
           if($(div).text().includes("Publié il y a")) {
              dateStr = $(div).text().trim();
           }
        });

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `postule-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.postule.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Postule.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: []
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Postule failed", e);
      return []; 
    }
  }
}
