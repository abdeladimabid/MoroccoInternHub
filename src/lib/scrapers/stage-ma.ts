import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription } from "../scraper-utils";

export const StageMaProvider: ScraperProvider = {
  name: "Stage.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User provided link: https://www.stage.ma/offres-stage?salary=false&free_submissions_left=false&search=developpeur
      // Pagination usually works with &page=X
      const searchUrl = `https://www.stage.ma/offres-stage?salary=false&free_submissions_left=false&search=developpeur&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      // New selectors from analysis
      $('div.border-slate-300').each((i, el) => {
        const titleEl = $(el).find('a.text-blue-600').first();
        const title = titleEl.text().trim();
        const url = titleEl.attr('href') || "";
        const company = $(el).find('a.text-emerald-600').text().trim() || "Société Confidientielle";
        const location = "Maroc"; // Default as per analysis
        
        let dateStr = "Récemment";
        $(el).find('div').each((_, div) => {
           if($(div).text().includes("À partir du")) {
             dateStr = $(div).text().trim();
           }
        });

        if (!title) return;
        // Search query usually guarantees dev, but we double check title
        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `stagema-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.stage.ma${url}`,
          dateStr: dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Stage.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title),
          description: cleanDescription($(el).text().replace(title, "").replace(company, "").trim().substring(0, 200))
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Stage.ma failed", e);
      return []; 
    }
  }
}
