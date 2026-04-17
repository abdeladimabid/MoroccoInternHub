import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription } from "../scraper-utils";

export const EmploiMaProvider: ScraperProvider = {
  name: "Emploi.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.emploi.ma/recherche-jobs-maroc/?f%5B0%5D=im_field_offre_metiers%3A31&f%5B1%5D=im_field_offre_contrat_type%3A45
      // Metiers 31 = IT, Contrat 45 = Stage
      const searchUrl = `https://www.emploi.ma/recherche-jobs-maroc/?f%5B0%5D=im_field_offre_metiers%3A31&f%5B1%5D=im_field_offre_contrat_type%3A45&page=${page-1}`; // Emploi.ma usually uses 0-indexed pages
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('.search-results > div:not(.clear)').each((i, el) => {
        const titleEl = $(el).find('h3 a');
        const title = titleEl.text().trim();
        if (!title) return;
        
        const url = titleEl.attr('href') || "";
        const company = $(el).find('a.company-name').text().trim() || "Entreprise Confidentielle";
        
        let location = "Maroc";
        $(el).find('li').each((_, li) => {
           if($(li).text().includes("Région de")) {
              location = $(li).find('strong').text().trim();
           }
        });

        const dateStr = $(el).find('time').text().trim() || "Récemment";

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `emploima-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: url.startsWith('http') ? url : `https://www.emploi.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Emploi.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title),
          description: cleanDescription($(el).find('.job-description').text().trim() || $(el).find('p').text().trim())
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Emploi.ma failed", e);
      return []; 
    }
  }
}
