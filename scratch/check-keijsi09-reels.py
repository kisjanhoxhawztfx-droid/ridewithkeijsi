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

url = "https://www.instagram.com/keijsi09/reels/"
r = httpx.get(url, headers=headers, follow_redirects=True)
codes = set(re.findall(r'"code":"([A-Za-z0-9_-]+)"', r.text))
print("Codes in keijsi09 reels:", len(codes), codes)

matches = [m.start() for m in re.finditer(r'"edges":\s*\[\{"node":', r.text)]
if matches:
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
        print(f"Parsed {len(items)} items from keijsi09 reels")
        with open("scratch/tab_reels_keijsi09.json", "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2)
    except Exception as e:
        print("Parse error:", e)
