import httpx
import re
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
}

r = httpx.get("https://www.instagram.com/keijsi09/", headers=headers, follow_redirects=True)
text = r.text

matches = [m.start() for m in re.finditer(r'"edges":\s*\[\{"node":', text)]

for idx in matches:
    depth = 0
    start = text.find('[', idx)
    end = start
    for i in range(start, min(len(text), start + 500000)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    snippet = text[start:end]
    data = json.loads(snippet)
    with open("scratch/edges_keijsi09.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Saved {len(data)} items to scratch/edges_keijsi09.json")
