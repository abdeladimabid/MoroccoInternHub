import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, cleanDescription, detectCity, cleanCompany, extractTechTags } from "../scraper-utils";

export const PostuleProvider: ScraperProvider = {
  name: "Postule.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const query = filters.q ? `&q=${encodeURIComponent(filters.q)}` : "";
      const searchUrl = `https://www.postule.ma/jobs?page=${page}${query}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('a[href*="/job/"]').each((i, el) => {
        const title = $(el).find('h2').first().text().trim() || $(el).find('h3').first().text().trim();
        if (!title) return;

        const url = $(el).attr('href') || "";
        const rawCompany = $(el).find('h2 + div, h3 + div, .company, [class*="company"]').first().text().trim();
        
        let rawLocation = "Maroc";
        $(el).find('span').each((_, span) => {
          const txt = $(span).text().trim();
          if (txt.match(/Casablanca|Rabat|Marrakech|Fès|Agadir|Tanger|Kenitra|Oujda|Laayoune/i)) {
            rawLocation = txt;
          }
        });
        
        let dateStr = "Récemment";
        $(el).find('span, div, p').each((_, node) => {
          const txt = $(node).text().trim();
          if (txt.includes("Publié") || txt.includes("il y a") || txt.includes("jour") || txt.includes("semaine")) {
            dateStr = txt;
          }
        });

        const description = cleanDescription($(el).find('p').text().trim());

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `postule-${i}-${Date.now()}`,
          title,
          company: cleanCompany(rawCompany),
          location: detectCity(title, description, rawLocation),
          url: url.startsWith('http') ? url : `https://www.postule.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Postule.ma",
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
