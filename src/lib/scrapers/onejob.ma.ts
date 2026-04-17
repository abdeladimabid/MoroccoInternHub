import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, cleanDescription } from "../scraper-utils";

export const OneJobProvider: ScraperProvider = {
  name: "OneJob",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.onejob.ma/offres-emploi?keywords=stage&location=&placetype=&placeid=&subcat=65&filter=&sort=id&order=desc&salary_min=&salary_max=&custom%5B2%5D=&sort=newest
      const searchUrl = `https://www.onejob.ma/offres-emploi?keywords=stage&subcat=65&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a[href*="/job/"]').each((i, el) => {
        const title = $(el).find('h2').text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const location = $(el).find('li:has(i.la-map-marker)').text().trim() || "Maroc";
        const dateStr = $(el).find('li:has(i.la-clock)').text().trim() || "Récemment";
        const company = "Société"; 

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `onejob-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.onejob.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "OneJob.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: [],
          description: cleanDescription($(el).find('p').text().trim() || $(el).text().replace(title, "").trim().substring(0, 150))
        });
      });
      
      return results;
    } catch(e) {
      console.warn("OneJob failed", e);
      return []; 
    }
  }
}
