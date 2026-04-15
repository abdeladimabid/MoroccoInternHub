import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://www.rekrute.com";

export async function scrapeRekrute(): Promise<JobListing[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/fr/offres-stage.html`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000,
      }
    );

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    // Rekrute uses .post or li.post for listings
    const items = $(".post, li.post, .job-post, .offer-item");

    if (items.length === 0) {
      // Fallback: parse any job-like anchors
      $("a[href*='offre'], a[href*='stage'], a[href*='emploi']").slice(0, 20).each((idx, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        if (title.length < 5) return;
        const href = $el.attr("href") || "";
        const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
        const postedAt = new Date();

        jobs.push({
          id: `rekrute-fallback-${idx}`,
          title,
          company: "N/A",
          location: "Maroc",
          contractType: "onsite",
          postedAt: postedAt.toISOString(),
          description: title,
          url: fullUrl,
          source: "Rekrute",
          language: detectLanguage(title),
          stack: detectStack(title),
          isNew: true,
        });
      });
      return jobs;
    }

    items.each((idx, el) => {
      if (idx >= 30) return false;
      const $el = $(el);

      const title =
        $el.find("h2 a, h3 a, .title a, .poste a").first().text().trim() ||
        $el.find("h2, h3, .title").first().text().trim();
      const company = $el.find(".company, .entreprise, em").first().text().trim() || "N/A";
      const location = $el.find(".location, .ville, .lieu").first().text().trim() || "Maroc";
      const dateText = $el.find(".date, time, .publie").first().text().trim() || "";
      const href =
        $el.find("h2 a, h3 a, .title a, a").first().attr("href") || "";
      const description = $el.find("p, .description").first().text().trim();

      if (!title || title.length < 3) return;

      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;

      jobs.push({
        id: `rekrute-${idx}-${Date.now()}`,
        title,
        company,
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description,
        url: fullUrl,
        source: "Rekrute",
        language: detectLanguage(`${title} ${description}`),
        stack: detectStack(`${title} ${description}`),
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[Rekrute] Scrape failed:", (err as Error).message);
    return [];
  }
}
