import { TBookmark } from "../types";

const initialData: TBookmark[] = [
  { emoji: "📁", label: "Bookmarks", url: "" },
  { emoji: "🔍", label: "Google", url: "https://google.com" },
  { emoji: "💻", label: "GitHub", url: "https://github.com" },
  { emoji: "📚", label: "Resources", url: "" },
  { emoji: "📖", label: "MDN Web Docs", url: "https://developer.mozilla.org" },
];

export function getJsonData(): TBookmark[] {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const data = urlParams.get("data");
  if (data) {
    try {
      const parsed = JSON.parse(decodeURIComponent(data));
      // Support both old array format and new object format
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (Array.isArray(parsed[0])) {
          // Old format: [["label", "url"]]
          return parsed.map(([label, url]: [string, string]) => ({
            emoji: "",
            label: label || "",
            url: url || "",
          }));
        }
      }
      return parsed;
    } catch {
      return initialData;
    }
  }
  return initialData;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}

export function fuzzyIncludes(text: string, term: string): boolean {
  if (text.includes(term)) return true;
  if (term.length < 3) return false;
  const len = term.length;
  for (let winLen = len - 1; winLen <= len + 1; winLen++) {
    for (let i = 0; i <= text.length - winLen; i++) {
      if (levenshtein(text.substring(i, i + winLen), term) <= 1) return true;
    }
  }
  return false;
}

export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
