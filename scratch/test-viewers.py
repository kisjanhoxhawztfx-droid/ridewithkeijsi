import httpx
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

urls = [
    "https://www.picuki.com/profile/ridewithkeijsi",
    "https://imginn.com/ridewithkeijsi/",
    "https://dumpoir.com/v/ridewithkeijsi",
    "https://insta-stories-viewer.com/ridewithkeijsi/",
    "https://storiesig.info/en/ridewithkeijsi/",
    "https://anonyig.com/en/profile/ridewithkeijsi/"
]

for url in urls:
    try:
        r = httpx.get(url, headers=headers, follow_redirects=True, timeout=10.0)
        scs = set(re.findall(r'/(?:p|reel|media)/([A-Za-z0-9_-]{10,12})', r.text))
        print(f"{url} -> status: {r.status_code}, len: {len(r.text)}, shortcodes: {len(scs)}")
        if scs:
            print("   Sample:", list(scs)[:5])
    except Exception as e:
        print(f"{url} -> error: {e}")
