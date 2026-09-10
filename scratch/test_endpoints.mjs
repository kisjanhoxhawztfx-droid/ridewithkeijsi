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
const username = "keijsi09";

const endpointsToTest = [
  `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username=${username}`,
  `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_reels?username=${username}`,
  `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${username}&end_cursor=QVFBSmZST2VtbGlRSE9pVXRzSmRsanE0amNOT3I0YTZjLTBsZkJTRDg3Z0FqcEtxTk1VdGlLSDhoeF9MYm9HN19BcXMwVllqZlpsb2VybmVrbVloQTllMQ==`,
  `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/posts?username=${username}`
];

for (const ep of endpointsToTest) {
  try {
    const r = await fetch(ep, {
      headers: {
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
        "x-rapidapi-key": apiKey
      }
    });
    console.log(ep, "-> status:", r.status);
    const j = await r.json().catch(() => null);
    if (j) {
      console.log("   keys:", Object.keys(j));
      if (j.data) console.log("   data keys:", Object.keys(j.data).slice(0, 5));
    }
  } catch(e) {
    console.error(ep, "error:", e.message);
  }
}
