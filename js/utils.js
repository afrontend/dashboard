const initialData = [
  {
    name: "🌤 Daily",
    link: "",
  },
];

export function getJsonData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const data = urlParams.get("data");
  if (data) {
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch {
      return initialData;
    }
  }
  return initialData;
}

export function isJSON(str) {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
