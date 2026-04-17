import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription, detectCity, cleanCompany } from "../scraper-utils";

export const StageMaProvider: ScraperProvider = {
  name: "Stage.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const query = filters.q ? encodeURIComponent(filters.q) : "developpeur";
      const searchUrl = `https://www.stage.ma/offres-stage?salary=false&free_submissions_left=false&search=${query}&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('div.border-slate-300').each((i, el) => {
        const titleEl = $(el).find('a.text-blue-600').first();
        const title = titleEl.text().trim();
        const url = titleEl.attr('href') || "";
        const rawCompany = $(el).find('a.text-emerald-600').text().trim();
        
        const description = cleanDescription($(el).text().replace(title, "").replace(rawCompany, "").trim().substring(0, 300));
        
        let dateStr = "Récemment";
        $(el).find('div').each((_, div) => {
           if($(div).text().includes("À partir du")) {
             dateStr = $(div).text().trim();
           }
        });

        if (!title) return;
        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `stagema-${i}-${Date.now()}`,
          title,
          company: cleanCompany(rawCompany),
          location: detectCity(title, description, "Maroc"),
          url: url.startsWith('http') ? url : `https://www.stage.ma${url}`,
          dateStr: dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Stage.ma",
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
