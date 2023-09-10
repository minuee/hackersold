// Change YOUR_API_KEY_HERE to your apiKey
const url =
  "https://newsapi.org/v2/top-headlines?country=kr&apiKey=eaa216e4445a406989cd2137cf06cd62";

export async function getNews() {
  let result = await fetch(url).then(response => response.json());
  return result.articles;
}