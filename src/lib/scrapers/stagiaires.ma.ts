import * as cheerio from "cheerio";
import { ScraperProvider, InternshipOffer, FilterOptions } from "./types";
import { fetchHtmlCode, detectLanguage, isRelevantITOffer, parseDateAge, extractTechTags, cleanDescription, detectCity, cleanCompany } from "../scraper-utils";

export const StagiairesProvider: ScraperProvider = {
  name: "Stagiaires.ma",
  async fetch(page: number, filters: FilterOptions): Promise<InternshipOffer[]> {
    try {
      const query = filters.q ? encodeURIComponent(filters.q) : "Stage en développement informatique";
      const searchUrl = `https://www.stagiaires.ma/stage-emploi-maroc?q=${query}&page=${page}`;
      const html = await fetchHtmlCode(searchUrl, false);
      const $ = cheerio.load(html);
      
      const results: InternshipOffer[] = [];
      
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const json = JSON.parse($(el).html() || "");
          if (json["@type"] === "JobPosting") {
            const description = cleanDescription(json.description || "");
            results.push({
              id: `stagiaires-json-${i}-${Date.now()}`,
              title: json.title,
              company: cleanCompany(json.hiringOrganization?.name),
              location: detectCity(json.title, description, json.jobLocation?.address?.addressLocality),
              url: json.url || searchUrl,
              dateStr: json.datePosted || "Récemment",
              ageInDays: parseDateAge(json.datePosted || "0"),
              source: "Stagiaires.ma",
              language: detectLanguage(json.title),
              contract: "Stage",
              tags: extractTechTags(json.title, description),
              description: description
            });
          }
        } catch (e) { }
      });

      $('div[role="link"]').each((i, el) => {
        const title = $(el).find('h3').first().text().trim();
        if (!title) return;
        if (results.some(r => r.title === title)) return;

        const rawCompany = $(el).find('button.text-muted-foreground').first().text().trim();
        const rawLocation = $(el).find('span').first().text().trim();
        const description = cleanDescription($(el).text().replace(title, "").replace(rawCompany, "").trim());
        
        let dateStr = "Récemment";
        $(el).find('span').each((_, span) => {
           if($(span).text().includes("Il y a")) dateStr = $(span).text().trim();
        });

        if (!isRelevantITOffer(title, false)) return;
        if (filters.q && !title.toLowerCase().includes(filters.q.toLowerCase())) return;

        results.push({
          id: `stagiaires-dom-${i}-${Date.now()}`,
          title,
          company: cleanCompany(rawCompany),
          location: detectCity(title, description, rawLocation),
          url: `https://www.stagiaires.ma/stage-emploi-maroc?q=${encodeURIComponent(title)}`,
          dateStr,
          ageInDays: parseDateAge(dateStr),
          source: "Stagiaires.ma",
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
