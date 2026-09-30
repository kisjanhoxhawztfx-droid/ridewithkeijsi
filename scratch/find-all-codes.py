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

url = "https://www.instagram.com/ridewithkeijsi/"
with httpx.Client(follow_redirects=True, timeout=15.0) as client:
    r = client.get(url, headers=headers)
    text = r.text

    # Search for all occurrences of "code":"..."
    codes = re.findall(r'"code":"([A-Za-z0-9_-]+)"', text)
    print("Found 'code' occurrences:", len(codes), set(codes))

    # Also search for "shortcode":"..."
    scodes = re.findall(r'"shortcode":"([A-Za-z0-9_-]+)"', text)
    print("Found 'shortcode' occurrences:", len(scodes), set(scodes))
