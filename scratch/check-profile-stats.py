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
r = httpx.get('https://www.instagram.com/ridewithkeijsi/', headers=headers, follow_redirects=True)
desc = re.findall(r'<meta property="og:description" content="([^"]+)"', r.text)
print('OG description:', desc)
title = re.findall(r'<title>(.*?)</title>', r.text)
print('Title:', title)
