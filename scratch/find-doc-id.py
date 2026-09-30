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
for q in ['query_hash', 'doc_id', 'PolarisProfilePostsQuery', 'PolarisProfilePostsTabQuery']:
    pattern = rf'{q}["\'\s:=]+([A-Za-z0-9_]+)'
    matches = re.findall(pattern, r.text)
    print(q, matches[:5])

# Find all script src
scripts = re.findall(r'<script[^>]+src="([^"]+)"', r.text)
print(f"Found {len(scripts)} external scripts")
for s in scripts:
    if "Polaris" in s or "Consumer" in s or "Profile" in s:
        print("Relevant script:", s)
