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

for tab in ["reels", "tagged"]:
    url = f"https://www.instagram.com/ridewithkeijsi/{tab}/"
    r = httpx.get(url, headers=headers, follow_redirects=True)
    print(f"=== Tab {tab} (len {len(r.text)}) ===")
    codes = set(re.findall(r'"code":"([A-Za-z0-9_-]+)"', r.text))
    print(f"Codes found in {tab}: {len(codes)}", codes)
    
    # Also find edges
    matches = [m.start() for m in re.finditer(r'"edges":\s*\[\{"node":', r.text)]
    print(f"Edges matches: {len(matches)}")
    if matches:
        # Extract snippet
        start = r.text.find('[', matches[0])
        depth = 0
        end = start
        for i in range(start, min(len(r.text), start + 500000)):
            if r.text[i] == '[':
                depth += 1
            elif r.text[i] == ']':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        try:
            items = json.loads(r.text[start:end])
            print(f"Parsed {len(items)} items from {tab}")
            with open(f"scratch/tab_{tab}.json", "w", encoding="utf-8") as f:
                json.dump(items, f, indent=2)
        except Exception as e:
            print("Parse error:", e)
