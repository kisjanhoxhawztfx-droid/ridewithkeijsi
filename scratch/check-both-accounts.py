import httpx
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
}

for user in ['ridewithkeijsi', 'keijsi09']:
    try:
        r = httpx.get(f'https://www.instagram.com/{user}/', headers=headers, follow_redirects=True, timeout=10.0)
        desc = re.findall(r'<meta property="og:description" content="([^"]+)"', r.text)
        print(f"=== {user} ===")
        print("Status:", r.status_code)
        print("Desc:", desc)
        shortcodes = set(re.findall(r'/(?:p|reel)/([A-Za-z0-9_-]{10,12})/', r.text))
        print("Shortcodes found:", len(shortcodes), shortcodes)
    except Exception as e:
        print(f"Error {user}:", e)
