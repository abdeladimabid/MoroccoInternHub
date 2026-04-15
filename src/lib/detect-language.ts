const FR_WORDS = [
  "stage", "emploi", "entreprise", "nous", "vous", "pour", "dans", "avec",
  "notre", "poste", "offre", "profil", "une", "des", "les", "est", "sont",
  "recherchons", "mission", "gestion", "développement", "travail", "équipe",
  "candidat", "formation", "compétences", "rejoindre", "salaire", "lieu",
];

const EN_WORDS = [
  "internship", "position", "company", "our", "you", "for", "with", "the",
  "and", "role", "offer", "profile", "job", "team", "skills", "develop",
  "candidate", "training", "management", "work", "salary", "location",
  "experience", "requirements", "responsibilities", "join", "apply",
];

export function detectLanguage(text: string): "fr" | "en" | "unknown" {
  if (!text || text.length < 20) return "unknown";
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let frScore = 0;
  let enScore = 0;

  for (const word of words) {
    if (FR_WORDS.includes(word)) frScore++;
    if (EN_WORDS.includes(word)) enScore++;
  }

  if (frScore === 0 && enScore === 0) return "unknown";
  if (frScore > enScore) return "fr";
  if (enScore > frScore) return "en";
  return "fr"; // default for Moroccan context
}
