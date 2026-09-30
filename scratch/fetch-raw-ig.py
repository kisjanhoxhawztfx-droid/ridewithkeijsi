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

url = "https://www.instagram.com/ridewithkeijsi/"
with httpx.Client(follow_redirects=True, timeout=15.0) as client:
    r = client.get(url, headers=headers)
    text = r.text
    shortcodes = list(set(re.findall(r'/(?:p|reel)/([A-Za-z0-9_-]{10,12})/', text)))
    print("Found shortcodes:", len(shortcodes), shortcodes)
    for sc in shortcodes:
        idx = text.find(sc)
        print(f"\n--- Shortcode: {sc} ---")
        snippet = text[max(0, idx-100):min(len(text), idx+200)]
        print(snippet.replace('\n', ' '))
