import httpx
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}
r = httpx.get('https://www.instagram.com/ridewithkeijsi/', headers=headers, follow_redirects=True)
json_matches = re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', r.text, re.DOTALL)
print(f"Total script tags: {len(json_matches)}")
for i, jm in enumerate(json_matches):
    for sc in ['DdUcoevRRcx', 'DdcFLKgR9ef']:
        if sc in jm:
            print(f"Script {i} contains {sc}! Length: {len(jm)}")
            with open(f"scratch/script_{i}.json", "w", encoding="utf-8") as f:
                f.write(jm)
