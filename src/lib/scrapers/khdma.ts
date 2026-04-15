import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://www.khdma.ma";

export async function scrapeKhdma(): Promise<JobListing[]> {
  try {
    const response = await axios.get(`${BASE_URL}/offres-emploi`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    const items = $(".job-item, .offer, article, .listing-item, .card");

    items.each((idx, el) => {
      if (idx >= 30) return false;
      const $el = $(el);

      const title =
        $el.find("h2, h3, h4, .title").first().text().trim() ||
        $el.find("a").first().text().trim();
      const company = $el.find(".company, .entreprise").first().text().trim() || "N/A";
      const location = $el.find(".location, .ville").first().text().trim() || "Maroc";
      const dateText = $el.find(".date, time").first().text().trim() || "";
      const href = $el.find("a").first().attr("href") || "";
      const description = $el.find("p, .desc").first().text().trim();

      if (!title || title.length < 3) return;

      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;

      jobs.push({
        id: `khdma-${idx}-${Date.now()}`,
        title,
        company,
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description,
        url: fullUrl,
        source: "Khdma.ma",
        language: detectLanguage(`${title} ${description}`),
        stack: detectStack(`${title} ${description}`),
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[Khdma.ma] Scrape failed:", (err as Error).message);
    return [];
  }
}
