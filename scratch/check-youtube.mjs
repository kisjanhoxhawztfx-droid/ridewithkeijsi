import { readFileSync } from "fs";

const env = readFileSync(".env", "utf8");
let key = "", ch = "";
for (const l of env.split("\n")) {
  if (l.startsWith("YOUTUBE_API_KEY=")) key = l.split("=")[1].replace(/["']/g, "").trim();
  if (l.startsWith("YOUTUBE_CHANNEL_ID=")) ch = l.split("=")[1].replace(/["']/g, "").trim();
}

console.log("Channel:", ch, "Key length:", key.length);
if (key && ch) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch}&maxResults=50&order=date&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("YouTube items:", data.items?.length);
  data.items?.forEach(it => {
    console.log(`- [${it.id.videoId || it.id.playlistId}] ${it.snippet?.title}`);
  });
}
