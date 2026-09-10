import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
let apiKey = "";
for (const l of envFile.split("\n")) {
  if (l.startsWith("RAPIDAPI_KEY=")) apiKey = l.split("=")[1].replace(/["']/g, "").trim();
}

const cursor = "QVFEY3h6aHZIOGlUOHN3SE50X19jdU9iM3hOXzNDc0ZwVl9DLW1tMGJPYjFJMTZTQXg1MFREZnJmN1l1elJNdFlRZTlPbzg4clBXYVBBU0ZYdlRRMHlHWA==";

for (const param of ["pagination_token", "end_cursor", "cursor", "after"]) {
  const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=keijsi09&${param}=${encodeURIComponent(cursor)}`;
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
      "x-rapidapi-key": apiKey
    }
  });
  const json = await res.json();
  const firstId = json.data?.edges?.[0]?.node?.id;
  console.log(`Param '${param}': returned ${json.data?.edges?.length || 0} items, first ID: ${firstId}`);
}
