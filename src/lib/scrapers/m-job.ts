import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://www.m-job.ma";

export async function scrapeMJob(): Promise<JobListing[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/offre-emploi/informatique`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 10000,
      }
    );

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $(".offer-item").each((idx, el) => {
      if (idx >= 20) return false;
      const $el = $(el);

      const title = $el.find("h3 a").text().trim();
      const href = $el.find("h3 a").attr("href") || "";
      const company = $el.find(".company-name").text().trim() || "N/A";
      const location = $el.find(".location").text().trim() || "Maroc";
      const dateText = $el.find(".date-posted").text().trim() || "";
      const description = $el.find(".offer-summary").text().trim();

      if (!title || !href) return;

      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const lang = detectLanguage(`${title} ${description}`);
      const stack = detectStack(`${title} ${description}`);

      jobs.push({
        id: `mjob-${idx}-${Date.now()}`,
        title,
        company,
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description,
        url: fullUrl,
        source: "M-Job",
        language: lang,
        stack,
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[M-Job] Scrape failed:", (err as Error).message);
    return [];
  }
}
