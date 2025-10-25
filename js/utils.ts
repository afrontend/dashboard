import { TBookmark } from "../types";

const initialData: TBookmark[] = [{ emoji: "🌤", label: "Daily", url: "" }];

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

export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
