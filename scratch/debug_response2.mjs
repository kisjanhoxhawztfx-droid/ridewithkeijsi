import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
let apiKey = "";
for (const l of envFile.split("\n")) {
  if (l.startsWith("RAPIDAPI_KEY=")) apiKey = l.split("=")[1].replace(/["']/g, "").trim();
}

const r = await fetch("https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=keijsi09", {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const j = await r.json();
console.log("page_info:", j.data.page_info);
