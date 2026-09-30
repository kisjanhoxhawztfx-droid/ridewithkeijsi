import { readFileSync, writeFileSync } from "fs";

const envFile = readFileSync(".env", "utf8");
let API_KEY = "";
for (const line of envFile.split("\n")) {
  if (line.startsWith("YOUTUBE_API_KEY=")) {
    API_KEY = line.split("=")[1].replace(/["']/g, "").trim();
  }
}

const playlistId = "UUx5563_qwsdQapLoVhRdrqg"; // Uploads playlist for @RideWithkeijsi
let nextPageToken = "";
const allVideos = [];

do {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.items) {
    for (const it of data.items) {
      allVideos.push({
        id: it.contentDetails.videoId,
        title: it.snippet.title,
        description: it.snippet.description,
        publishedAt: it.snippet.publishedAt,
        thumbnails: it.snippet.thumbnails,
      });
    }
  }

  nextPageToken = data.nextPageToken;
} while (nextPageToken);

console.log(`Fetched ${allVideos.length} total videos from YouTube!`);
writeFileSync("scratch/all_youtube_videos.json", JSON.stringify(allVideos, null, 2));

allVideos.forEach((v, i) => {
  console.log(`${i + 1}. [${v.id}] ${v.title} (${v.publishedAt})`);
  if (v.description) {
    console.log(`   Desc: ${v.description.slice(0, 100).replace(/\n/g, ' ')}`);
  }
});
