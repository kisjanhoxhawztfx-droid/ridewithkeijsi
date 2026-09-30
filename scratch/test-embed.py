import httpx
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
}

for sc in ['DdcFLKgR9ef', 'DdUcoevRRcx']:
    url = f"https://www.instagram.com/p/{sc}/embed/captioned/"
    r = httpx.get(url, headers=headers, follow_redirects=True)
    print(f"=== {sc} Embed Status: {r.status_code} ===")
    print("Length:", len(r.text))
    # Extract caption from embed
    # Embed HTML usually contains class "Caption" or class "Feedback" or caption text
    caption_matches = re.findall(r'<div class="Caption"[^>]*>(.*?)</div>', r.text, re.DOTALL)
    print("Caption div matches:", len(caption_matches))
    if caption_matches:
        clean = re.sub(r'<[^>]+>', '', caption_matches[0])
        print("Caption:", clean.strip()[:300])
    # Extract image
    img_matches = re.findall(r'<img[^>]+class="EmbeddedMediaImage"[^>]+src="([^"]+)"', r.text)
    print("Image matches:", img_matches)
