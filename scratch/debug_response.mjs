import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
for (const line of envFile.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) {
    const val = v.join("=").replace(/^"|"$/g, "").trim();
    if (!process.env[k.trim()]) process.env[k.trim()] = val;
  }
}
const apiKey = process.env.RAPIDAPI_KEY;

const r = await fetch("https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username=keijsi09", {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const j = await r.json();
console.log(JSON.stringify(j).slice(0, 400));
