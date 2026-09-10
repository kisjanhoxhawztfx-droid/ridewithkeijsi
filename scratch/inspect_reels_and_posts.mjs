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

// 1. Check user_reels
const reelsRes = await fetch("https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_reels?username=keijsi09", {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const reelsJson = await reelsRes.json();
console.log("=== USER_REELS ===");
console.log("Type of data:", typeof reelsJson.data, Array.isArray(reelsJson.data) ? `Array length ${reelsJson.data.length}` : Object.keys(reelsJson.data));

// 2. Check user_posts
const postsRes = await fetch("https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username=keijsi09", {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const postsJson = await postsRes.json();
console.log("\n=== USER_POSTS ===");
console.log("Type of data:", typeof postsJson.data, Array.isArray(postsJson.data) ? `Array length ${postsJson.data.length}` : Object.keys(postsJson.data));

if (Array.isArray(reelsJson.data) && reelsJson.data.length > 0) {
  console.log("\nReels sample item keys:", Object.keys(reelsJson.data[0]));
} else if (reelsJson.data?.items) {
  console.log("\nReels items count:", reelsJson.data.items.length);
}
