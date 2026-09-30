const fs = require("fs");
const path = require("path");

const filePath = "C:\\Users\\AG\\.gemini\\antigravity\\brain\\50a69bb7-473d-44b7-9c43-c59f94d84eab\\.system_generated\\steps\\215\\content.md";
const html = fs.readFileSync(filePath, "utf8");

// Look for posts
const postMatches = html.matchAll(/<a href="\/post\/(\d+)\/" class="cover_link"[\s\S]*?<img alt="([^"]*)"[\s\S]*?data-src="([^"]*)"/g);
let count = 0;
for (const match of postMatches) {
  count++;
  console.log(`\n#${count} Post ID: ${match[1]}`);
  console.log(`Caption: ${match[2].slice(0, 80)}...`);
  console.log(`Image: ${match[3].slice(0, 60)}...`);
}
console.log(`\nTotal posts matched in HTML: ${count}`);
