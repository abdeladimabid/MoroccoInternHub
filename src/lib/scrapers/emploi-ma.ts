import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, detectCity, cleanCompany, cleanDescription } from "../scraper-utils";

export const EmploiMaProvider: ScraperProvider = {
  name: "Emploi.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.emploi.ma/recherche-jobs-maroc/?f%5B0%5D=im_field_offre_metiers%3A31&f%5B1%5D=im_field_offre_contrat_type%3A45
      // Metiers 31 = IT, Contrat 45 = Stage
      const query = filters.q ? `&q=${encodeURIComponent(filters.q)}` : "";
      const searchUrl = `https://www.emploi.ma/recherche-jobs-maroc/?f%5B0%5D=im_field_offre_metiers%3A31&f%5B1%5D=im_field_offre_contrat_type%3A45${query}&page=${page-1}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      // Broader selector to include various card structures
      $('.card-job, .search-results div.job-description-wrapper').each((i, el) => {
        const titleEl = $(el).find('h3 a');
        const title = titleEl.text().trim();
        if (!title) return;
        
        const url = titleEl.attr('href') || "";
        const company = $(el).find('.company-name').text().trim() || "Entreprise Confidentielle";
        
        // Location is usually in an li with a strong tag after "Région de :"
        let location = "Maroc";
        $(el).find('ul li').each((_, li) => {
          const text = $(li).text();
          if (text.includes('Région de')) {
            location = $(li).find('strong').text().trim();
          }
        });

        const dateStr = $(el).find('time').text().trim() || "Récemment";

        const description = cleanDescription($(el).find('.card-job-description').text().trim() || $(el).find('p').text().trim());

        results.push({
          id: `emploima-${i}-${Date.now()}`,
          title,
          company: cleanCompany(company),
          location: detectCity(title, description, location),
          url: url.startsWith('http') ? url : `https://www.emploi.ma${url}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Emploi.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title, description),
          description: description
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Emploi.ma failed", e);
      return []; 
    }
  }
}
