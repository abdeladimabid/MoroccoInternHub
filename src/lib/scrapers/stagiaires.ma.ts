import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription } from "../scraper-utils";

export const StagiairesProvider: ScraperProvider = {
  name: "Stagiaires.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      // User URL: https://www.stagiaires.ma/stage-emploi-maroc?q=Développeur+Web
      const searchUrl = `https://www.stagiaires.ma/stage-emploi-maroc?q=D%C3%A9veloppeur+Web&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('div[role="link"]').each((i, el) => {
        const title = $(el).find('h3').first().text().trim();
        if (!title) return;

        const urlPath = $(el).find('a').first().attr('href') || "";
        const company = $(el).find('.text-muted-foreground').first().text().trim() || "Entreprise";
        const location = $(el).find('span:has(img) + span').first().text().trim() || "Maroc";
        
        let dateStr = "Récemment";
        $(el).find('span').each((_, span) => {
           if($(span).text().includes("Il y a")) {
              dateStr = $(span).text().trim();
           }
        });

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `stagiaires-${i}-${Date.now()}`,
          title,
          company,
          location,
          url: urlPath.startsWith('http') ? urlPath : `https://www.stagiaires.ma${urlPath}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Stagiaires.ma",
          language: detectLanguage(title),
          contract: "Stage",
          tags: extractTechTags(title),
          description: cleanDescription($(el).find('.text-muted-foreground').first().parent().text().replace(title, "").trim())
        });
      });
      
      return results;
    } catch(e) {
      console.warn("Stagiaires failed", e);
      return []; 
    }
  }
}
