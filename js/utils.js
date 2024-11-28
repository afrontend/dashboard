export function getJsonData(queryString) {
  const urlParams = new URLSearchParams(queryString);
  const data = urlParams.get("data");
  if (data) {
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch {
      return [];
    }
  }
  return [];
}
