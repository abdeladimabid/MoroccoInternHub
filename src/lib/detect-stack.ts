const STACK_KEYWORDS: Record<string, string[]> = {
  React: ["react", "reactjs", "react.js"],
  Vue: ["vue", "vuejs", "vue.js"],
  Angular: ["angular", "angularjs"],
  "Next.js": ["next.js", "nextjs"],
  "Node.js": ["node.js", "nodejs", "node"],
  PHP: ["php"],
  Laravel: ["laravel"],
  Python: ["python", "django", "flask", "fastapi"],
  JavaScript: ["javascript", "js", "es6", "es2015"],
  TypeScript: ["typescript", "ts"],
  Java: ["java", "spring", "springboot"],
  ".NET": ["dotnet", ".net", "c#", "asp.net"],
  "SQL": ["sql", "mysql", "postgresql", "postgres", "sqlite"],
  MongoDB: ["mongodb", "mongo"],
  Docker: ["docker", "kubernetes", "k8s", "devops"],
  Flutter: ["flutter", "dart"],
  "React Native": ["react native", "reactnative"],
  WordPress: ["wordpress", "wp"],
  Symfony: ["symfony"],
};

export function detectStack(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [tech, keywords] of Object.entries(STACK_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(tech);
    }
  }

  return found;
}
