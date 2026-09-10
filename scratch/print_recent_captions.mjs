import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
let apiKey = "";
for (const l of envFile.split("\n")) {
  if (l.startsWith("RAPIDAPI_KEY=")) apiKey = l.split("=")[1].replace(/["']/g, "").trim();
}

const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=ridewithkeijsi`;
const res = await fetch(url, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const json = await res.json();
const edges = json.data?.edges || [];
console.log(`Latest 5 posts on @ridewithkeijsi:`);
edges.slice(0, 5).forEach((p, i) => {
  const cap = p.node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  console.log(`\n[${i+1}] https://instagram.com/p/${p.node.shortcode}/`);
  console.log(`Caption: ${cap.replace(/\n/g, " ").slice(0, 140)}`);
});
