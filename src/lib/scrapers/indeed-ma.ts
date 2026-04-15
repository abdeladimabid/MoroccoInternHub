import axios from "axios";
import * as cheerio from "cheerio";
import { JobListing } from "@/lib/types";
import { detectLanguage } from "@/lib/detect-language";
import { detectStack } from "@/lib/detect-stack";
import { parseRelativeDate, isWithin30Days, isWithin48Hours } from "@/lib/scrapers/utils";

const BASE_URL = "https://ma.indeed.com";

export async function scrapeIndeed(): Promise<JobListing[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/jobs?q=stage+informatique&l=Maroc`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
        },
        timeout: 10000,
      }
    );

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    // Indeed uses data-jk attributes and .job_seen_beacon
    const items = $(".job_seen_beacon, .jobsearch-ResultsList > li, [data-jk]");

    items.each((idx, el) => {
      if (idx >= 20) return false;
      const $el = $(el);

      const title =
        $el.find(".jobTitle span, h2.jobTitle a span, [data-testid='jobTitle']")
          .first()
          .text()
          .trim() || $el.find("h2, h3").first().text().trim();
      const company =
        $el.find(".companyName, [data-testid='company-name'], .company")
          .first()
          .text()
          .trim() || "N/A";
      const location =
        $el.find(".companyLocation, [data-testid='text-location']")
          .first()
          .text()
          .trim() || "Maroc";
      const dateText =
        $el.find(".date, .result-link-bar-container span, [data-testid='myJobsStateDate']")
          .first()
          .text()
          .trim() || "";
      const jobKey = $el.attr("data-jk") || "";
      const href =
        $el.find("a").first().attr("href") ||
        (jobKey ? `/viewjob?jk=${jobKey}` : "");

      if (!title || title.length < 3) return;

      const postedAt = parseRelativeDate(dateText);
      if (!isWithin30Days(postedAt)) return;

      const fullUrl = href.startsWith("http")
        ? href
        : `${BASE_URL}${href}`;

      jobs.push({
        id: `indeed-${idx}-${Date.now()}`,
        title,
        company,
        location,
        contractType: "onsite",
        postedAt: postedAt.toISOString(),
        description: "",
        url: fullUrl,
        source: "Indeed",
        language: detectLanguage(`${title} ${company}`),
        stack: detectStack(`${title}`),
        isNew: isWithin48Hours(postedAt),
      });
    });

    return jobs;
  } catch (err) {
    console.error("[Indeed] Scrape failed:", (err as Error).message);
    return [];
  }
}
