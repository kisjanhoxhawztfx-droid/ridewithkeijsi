import httpx
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
}

r = httpx.get("https://www.instagram.com/ridewithkeijsi/", headers=headers, follow_redirects=True)
text = r.text

for sc in ['DdcFLKgR9ef', 'DdUcoevRRcx']:
    idx = text.find(f'"code":"{sc}"')
    if idx != -1:
        # find boundaries
        start = max(0, idx - 100)
        end = min(len(text), idx + 1000)
        print(f"=== {sc} ===")
        print(text[start:end])
