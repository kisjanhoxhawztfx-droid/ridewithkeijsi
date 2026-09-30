import { readFileSync } from "fs";

const env = readFileSync(".env", "utf8");
let token = "";
for (const line of env.split("\n")) {
  if (line.startsWith("INSTAGRAM_ACCESS_TOKEN=")) {
    token = line.split("=")[1].replace(/["']/g, "").trim();
  }
}

console.log("Token length:", token.length);
if (token) {
  const res = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`);
  const data = await res.json();
  console.log("Response:", data);
}
