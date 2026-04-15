/**
 * Parses relative date strings like "il y a 2 jours", "3 days ago", "aujourd'hui", "today"
 * Returns a Date object.
 */
export function parseRelativeDate(text: string): Date {
  const now = new Date();
  if (!text) return now;

  const lower = text.toLowerCase().trim();

  // Today / Aujourd'hui
  if (
    lower.includes("today") ||
    lower.includes("aujourd") ||
    lower.includes("ce jour") ||
    lower === "now" ||
    lower === "maintenant"
  ) {
    return now;
  }

  // Yesterday / Hier
  if (lower.includes("yesterday") || lower.includes("hier")) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d;
  }

  // N hours ago
  const hoursMatch = lower.match(/(\d+)\s*(hour|heure)/);
  if (hoursMatch) {
    const d = new Date(now);
    d.setHours(d.getHours() - parseInt(hoursMatch[1]));
    return d;
  }

  // N days ago
  const daysMatch = lower.match(/(\d+)\s*(day|jour)/);
  if (daysMatch) {
    const d = new Date(now);
    d.setDate(d.getDate() - parseInt(daysMatch[1]));
    return d;
  }

  // N weeks ago
  const weeksMatch = lower.match(/(\d+)\s*(week|semaine)/);
  if (weeksMatch) {
    const d = new Date(now);
    d.setDate(d.getDate() - parseInt(weeksMatch[1]) * 7);
    return d;
  }

  // N months ago
  const monthsMatch = lower.match(/(\d+)\s*(month|mois)/);
  if (monthsMatch) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - parseInt(monthsMatch[1]));
    return d;
  }

  // Try parsing as absolute date (dd/mm/yyyy or yyyy-mm-dd)
  const ddmmyyyy = lower.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyy) {
    return new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`);
  }

  const iso = lower.match(/\d{4}-\d{2}-\d{2}/);
  if (iso) {
    return new Date(iso[0]);
  }

  // Default: today
  return now;
}

export function isWithin30Days(date: Date): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return date >= thirtyDaysAgo;
}

export function isWithin48Hours(date: Date): boolean {
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
  return date >= fortyEightHoursAgo;
}
