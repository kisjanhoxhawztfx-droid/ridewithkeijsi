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

for user in ['ridewithkeijsi', 'keijsi09']:
    r = httpx.get(f"https://www.instagram.com/{user}/", headers=headers, follow_redirects=True)
    text = r.text
    print(f"=== {user} (len {len(text)}) ===")
    
    # find all "code":"..."
    codes = re.findall(r'"code":"([A-Za-z0-9_-]+)"', text)
    print("Codes found:", set(codes))
    
    # find all caption text
    # In Polaris, each item has "code":"...", and "caption":{"text":"..."} or accessibility_caption
    items = re.findall(r'"code":"([A-Za-z0-9_-]+)".*?"caption":(\{[^\}]*\}|null)', text)
    print("Items with caption:", len(items))
    for code, cap in items:
        print(f"  Code: {code} -> Cap: {cap[:100]}")
