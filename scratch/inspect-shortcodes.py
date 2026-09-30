import httpx
import re
import json

shortcodes = [
    'Ddd1Hm8R7ck', 'Ddd3Pv_uGdP', 'DdcFLKgR9ef', 'DdbYn4QAbwH', 
    'DdhFKXyA7UJ', 'DdbI5jiRZak', 'DdbOgwBAkhf', 'DdhNfiTx7m2', 
    'Ddgd_TWxXgY', 'DdeXKZEgIwH', 'Ddg6UqtgvNz', 'DdhS6lhRUt0',
    'DdUcoevRRcx'
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

for sc in shortcodes:
    url = f"https://www.instagram.com/p/{sc}/"
    try:
        r = httpx.get(url, headers=headers, follow_redirects=True, timeout=10.0)
        desc = re.findall(r'<meta property="og:description" content="([^"]*)"', r.text)
        title = re.findall(r'<meta property="og:title" content="([^"]*)"', r.text)
        # Check for caption or video
        video_url = re.findall(r'"video_url":"([^"]+)"', r.text)
        display_url = re.findall(r'"display_url":"([^"]+)"', r.text)
        
        # Caption extraction
        cap_match = re.search(r'"caption":\{"text":"(.*?)"\}', r.text)
        caption = cap_match.group(1).encode('utf-8').decode('unicode_escape') if cap_match else (desc[0] if desc else "")
        
        print(f"\n==================== {sc} ====================")
        print(f"Title: {title[0] if title else ''}")
        print(f"Caption: {caption[:120]}")
        print(f"Has video: {bool(video_url)}, Has img: {bool(display_url)}")
    except Exception as e:
        print(f"Error {sc}: {e}")
