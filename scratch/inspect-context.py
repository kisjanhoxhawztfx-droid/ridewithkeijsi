import httpx
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
}
r = httpx.get('https://www.instagram.com/ridewithkeijsi/', headers=headers, follow_redirects=True)
for sc in ['DdUcoevRRcx', 'DdcFLKgR9ef']:
    idx = r.text.find(sc)
    if idx != -1:
        print(f"Found {sc} at index {idx}:")
        print(r.text[max(0, idx-200):min(len(r.text), idx+300)])
        print("="*60)
