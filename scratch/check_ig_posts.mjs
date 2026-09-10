const url = "https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=keijsi09";
const res = await fetch(url, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": "f445af1383msh2d0396ce64777c4p142ed6jsn83232537dd13"
  }
});
const json = await res.json();
const d = json.data;
console.log("Top keys of data:", Object.keys(d));
const posts = d.edge_owner_to_timeline_media?.edges || [];
console.log("Found posts in edge_owner_to_timeline_media:", posts.length);
posts.slice(0, 10).forEach((p, idx) => {
  const node = p.node;
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  console.log(`\n--- Post #${idx + 1} ---`);
  console.log("ID:", node.id);
  console.log("Shortcode:", node.shortcode);
  console.log("Is Video:", node.is_video);
  console.log("Video URL:", node.video_url || "N/A");
  console.log("Display URL:", node.display_url?.slice(0, 60));
  console.log("Caption:", caption.replace(/\n/g, " ").slice(0, 100));
});
