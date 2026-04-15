import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://www.marocannonces.com";

export async function scrapeMarocAnnonces(): Promise<JobListing[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/maroc/offres-emploi-domaine-informatique-multimedia-b309-t4.html`,
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

    // Select each job listing item
    $("ul.list-products li").each((idx, el) => {
      if (idx >= 20) return false;
      const $el = $(el);

      const title = $el.find("p.title a").text().trim();
      const href = $el.find("p.title a").attr("href") || "";
      const location = $el.find("span.location").text().trim() || "Maroc";
      const dateText = $el.find("span.date").text().trim() || "";
      const description = $el.find("p.description").text().trim();

      if (!title || !href) return;

      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}/${href.replace(/^\//, "")}`;
      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const lang = detectLanguage(`${title} ${description}`);
      const stack = detectStack(`${title} ${description}`);

      jobs.push({
        id: `ma-${idx}-${Date.now()}`,
        title,
        company: "N/A",
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description,
        url: fullUrl,
        source: "MarocAnnonces",
        language: lang,
        stack,
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[MarocAnnonces] Scrape failed:", (err as Error).message);
    return [];
  }
}
