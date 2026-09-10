const url = "https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=keijsi09";
const res = await fetch(url, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": "f445af1383msh2d0396ce64777c4p142ed6jsn83232537dd13"
  }
});
const json = await res.json();
const edges = json.data?.edge_owner_to_timeline_media?.edges || [];
console.log(`Checking ${edges.length} posts for #shitet and #episod:`);
let shitetCount = 0, episodCount = 0;
edges.forEach((p, i) => {
  const cap = p.node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  const lower = cap.toLowerCase();
  const hasShitet = lower.includes("#shitet");
  const hasEpisod = lower.includes("#episod");
  if (hasShitet) {
    shitetCount++;
    console.log(`[#${i+1}] #shitet found: ${cap.slice(0, 60)}...`);
  }
  if (hasEpisod) {
    episodCount++;
    console.log(`[#${i+1}] #episod found: ${cap.slice(0, 60)}...`);
  }
});
console.log(`\nSummary: #shitet=${shitetCount}, #episod=${episodCount}`);
