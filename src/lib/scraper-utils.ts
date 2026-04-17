import { differenceInDays, parse } from "date-fns";

export function detectLanguage(text: string): "FR" | "EN" {
  const frenchKeywords = ["nous recherchons", "profil", "compétences", "stage", "candidature", "développeur", "offre", "mission", "exigences"];
  const englishKeywords = ["we are looking for", "requirements", "skills", "internship", "apply", "developer", "offer", "mission"];
  
  const lower = text.toLowerCase();
  const frCount = frenchKeywords.filter(k => lower.includes(k)).length;
  const enCount = englishKeywords.filter(k => lower.includes(k)).length;
  
  return enCount > frCount ? "EN" : "FR";
}

export function slugify(str: string) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, '-');
}

/** Strictly filter for tech/web-dev internships */
export function isRelevantITOffer(title: string, requiresInternKeyword: boolean = true): boolean {
  const devKeywords = [
    "développeur", "developpeur", "developer", "dev", "web", "react", "laravel", 
    "informatique", "software", "ingénieur", "ingenieur", "fullstack", "frontend", 
    "backend", "data", "ai", "machine learning", "ui/ux", "devops", "cloud", 
    "angular", "vue", "javascript", "python", "java", "php", "nodejs", "node", "it",
    "mobile", "ios", "android", "flutter", "react native", "technologie", "cyber", "programmer"
  ];
  const internKeywords = ["stage", "internship", "stagiaire", "pfe", "intern", "apprentissage"];
  
  const lowerTitle = title.toLowerCase();
  
  const isIT = devKeywords.some(keyword => lowerTitle.includes(keyword));
  
  if (!requiresInternKeyword) return isIT;
  
  const isIntern = internKeywords.some(keyword => lowerTitle.includes(keyword));
  return isIT && isIntern;
}

/** Parses natural language string into approximate age in days */
export function parseDateAge(dateStr: string): number {
  const lower = dateStr.toLowerCase();
  if (lower.includes("heure") || lower.includes("hour") || lower.includes("aujourd'hui") || lower.includes("min")) return 0;
  if (lower.includes("hier") || lower.includes("yesterday")) return 1;
  if (lower.includes("jour") || lower.includes("day")) {
    const match = lower.match(/(\d+)/);
    if (match) return parseInt(match[1]);
  }
  if (lower.includes("semaine") || lower.includes("week")) {
    const match = lower.match(/(\d+)/);
    if (match) return parseInt(match[1]) * 7;
    return 7;
  }
  if (lower.includes("mois") || lower.includes("month")) {
    const match = lower.match(/(\d+)/);
    if (match) return parseInt(match[1]) * 30;
    return 30;
  }
  return 30; // fallback to 30 days if unknown
}

/** Extracts technology tags from text */
export function extractTechTags(text: string): string[] {
  const commonTech = [
    "React", "Angular", "Vue", "Node", "PHP", "Laravel", "Python", "Django", "Flask", 
    "Java", "Spring", "C#", ".NET", "Flutter", "Swift", "Kotlin", "Android", "iOS",
    "SQL", "MongoDB", "PostgreSQL", "JavaScript", "TypeScript", "HTML", "CSS",
    "Docker", "Kubernetes", "AWS", "Azure", "Cloud", "DevOps", "Cybersecurity",
    "Machine Learning", "AI", "Data", "Go", "Rust", "Ruby", "Rails", "WordPress"
  ];
  
  const tags: string[] = [];
  const lower = text.toLowerCase();
  
  commonTech.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(lower)) {
      tags.push(tech);
    }
  });
  
  return [...new Set(tags)];
}

/** Cleans description snippets from redundant meta-text */
export function cleanDescription(text: string): string {
  if (!text) return "";
  return text
    .replace(/(Publication|Postes\s*proposés|Anonyme)[\s\S]*/gi, '') 
    .replace(/\s+/g, ' ')
    .trim();
}

/** Fetch code with randomized user-agents, automatic AllOrigins proxy fallback for HTML */
export async function fetchHtmlCode(url: string, useProxy: boolean = false): Promise<string> {
  let targetUrl = useProxy ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;
  
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0"
  ];

  const headers = {
    "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s max per fetch
    
    let response = await fetch(targetUrl, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 } 
    });
    
    clearTimeout(timeoutId);
    
    // If blocked or forbidden, try falling back to Proxy (if not already tried)
    if (!response.ok && !useProxy) {
        console.warn(`Direct fetch failed for ${url} (Status: ${response.status}). Retrying with Proxy...`);
        return fetchHtmlCode(url, true);
    }

    if (!response.ok) {
        console.warn(`Failed to fetch from ${targetUrl} (Status: ${response.status})`);
        return "";
    }
    
    return await response.text();
  } catch (error) {
     if (!useProxy) {
         console.warn(`Network error fetching ${url}. Retrying with Proxy...`);
         return fetchHtmlCode(url, true);
     }
     console.warn(`Network error fetching from proxy ${targetUrl}:`, error);
     return "";
  }
}
