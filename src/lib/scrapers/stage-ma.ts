import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://www.stage.ma";

export async function scrapeStage(): Promise<JobListing[]> {
  try {
    const response = await axios.get(`${BASE_URL}/offres-de-stage`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    // Try multiple selectors for Stage.ma listing structure
    const selectors = [".offre-item", ".job-item", ".offer-card", "article", ".list-item"];
    
    let items = $();
    for (const sel of selectors) {
      items = $(sel);
      if (items.length > 0) break;
    }

    // If no structured items found, try generic link-based parsing
    if (items.length === 0) {
      $("a[href*='stage']").each((_, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const url = $el.attr("href") || "";
        if (title.length > 10 && url) {
          const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
          const text = title;
          const lang = detectLanguage(text);
          const stack = detectStack(text);
          const postedAt = new Date().toISOString();
          
          jobs.push({
            id: `stage-${Buffer.from(fullUrl).toString("base64").slice(0, 16)}`,
            title,
            company: "N/A",
            location: "Maroc",
            contractType: "onsite",
            postedAt,
            description: text,
            url: fullUrl,
            source: "Stage.ma",
            language: lang,
            stack,
            isNew: true,
          });
        }
      });
      return jobs.slice(0, 20);
    }

    items.each((idx, el) => {
      if (idx >= 30) return false;
      const $el = $(el);

      const title =
        $el.find("h2, h3, h4, .title, .offre-title").first().text().trim() ||
        $el.find("a").first().text().trim();
      const company =
        $el.find(".company, .entreprise, .societe").first().text().trim() || "N/A";
      const location =
        $el.find(".location, .ville, .localisation").first().text().trim() || "Maroc";
      const dateText =
        $el.find(".date, .posted, time").first().text().trim() || "";
      const href =
        $el.find("a").first().attr("href") || $el.attr("href") || "";
      const description = $el.find(".description, p").first().text().trim();

      if (!title || title.length < 3) return;

      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
      const lang = detectLanguage(`${title} ${description}`);
      const stack = detectStack(`${title} ${description}`);

      jobs.push({
        id: `stage-${idx}-${Date.now()}`,
        title,
        company,
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description,
        url: fullUrl,
        source: "Stage.ma",
        language: lang,
        stack,
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[Stage.ma] Scrape failed:", (err as Error).message);
    return [];
  }
}
