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

let hasNext = true;
let endCursor = "";
let page = 1;
let totalChecked = 0;
const matched = [];

console.log(`Starting deep scan of all posts/reels for @${username}...`);

// Let's first check user info & total media count
const infoUrl = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${username}`;
const res = await fetch(infoUrl, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const data = await res.json();
const user = data.data;
const totalMedia = user?.edge_owner_to_timeline_media?.count || 0;
console.log(`User has ${totalMedia} total posts.`);

const edges = user?.edge_owner_to_timeline_media?.edges || [];
totalChecked += edges.length;

for (const edge of edges) {
  const node = edge.node;
  const cap = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  const lower = cap.toLowerCase();
  if (lower.includes("#shitet") || lower.includes("#episod") || lower.includes("shitet") || lower.includes("episod")) {
    matched.push({
      id: node.id,
      shortcode: node.shortcode,
      caption: cap,
      is_video: node.is_video,
      video_url: node.video_url,
      display_url: node.display_url,
      timestamp: node.taken_at_timestamp
    });
  }
}

console.log(`First batch: checked ${edges.length}, matches: ${matched.length}`);

// If there are more pages, let's see how this RapidAPI handles pagination or posts endpoint
console.log("Page info:", JSON.stringify(user?.edge_owner_to_timeline_media?.page_info));

