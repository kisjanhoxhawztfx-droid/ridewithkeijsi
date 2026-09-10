import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
let apiKey = "";
for (const l of envFile.split("\n")) {
  if (l.startsWith("RAPIDAPI_KEY=")) apiKey = l.split("=")[1].replace(/["']/g, "").trim();
}

const username = "keijsi09";
let cursor = "";
let page = 1;
const allHashtags = new Set();
const postsWithMotorcycleOrSale = [];

while (page <= 5) {
  let url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=${username}`;
  if (cursor) url += `&end_cursor=${encodeURIComponent(cursor)}`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
      "x-rapidapi-key": apiKey
    }
  });
  const json = await res.json();
  const edges = json.data?.edges || [];
  if (edges.length === 0) break;

  for (const edge of edges) {
    const node = edge.node;
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
    const tags = caption.match(/#[\w\u00C0-\u024F]+/gi) || [];
    tags.forEach(t => allHashtags.add(t.toLowerCase()));

    const lower = caption.toLowerCase();
    if (lower.includes("motorr") || lower.includes("yamaha") || lower.includes("honda") || lower.includes("tmax") || lower.includes("shit") || lower.includes("cmim") || lower.includes("euro") || lower.includes("episod")) {
      postsWithMotorcycleOrSale.push({
        shortcode: node.shortcode,
        caption: caption.replace(/\n/g, " ").slice(0, 100)
      });
    }
  }

  const pageInfo = json.data?.page_info;
  if (!pageInfo?.has_next_page || !pageInfo?.end_cursor) break;
  cursor = pageInfo.end_cursor;
  page++;
}

console.log("Common hashtags found on @keijsi09:");
console.log(Array.from(allHashtags).slice(0, 40).join(", "));
console.log(`\nPosts with keywords (motorr/shit/cmim/episod) [${postsWithMotorcycleOrSale.length} found]:`);
postsWithMotorcycleOrSale.slice(0, 10).forEach((p, i) => console.log(`${i+1}. [${p.shortcode}] ${p.caption}`));
