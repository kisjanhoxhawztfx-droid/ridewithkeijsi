import httpx
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
}
r = httpx.get("https://www.instagram.com/p/DdcFLKgR9ef/embed/captioned/", headers=headers, follow_redirects=True)
with open("scratch/embed_sample.html", "w", encoding="utf-8") as f:
    f.write(r.text)

print("Saved embed HTML, searching for keywords...")
for kw in ["caption", "display_url", "thumbnail", "shortcode", "accessibility", "BOOOOOOM"]:
    print(f"Keyword '{kw}': {r.text.count(kw)} times")
