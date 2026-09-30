import httpx
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "x-ig-app-id": "936619743392459",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
}

url = "https://www.instagram.com/api/v1/users/web_profile_info/?username=ridewithkeijsi"
try:
    with httpx.Client(follow_redirects=True, timeout=15.0) as client:
        r = client.get(url, headers=headers)
        print("Status code:", r.status_code)
        print("Response length:", len(r.text))
        if r.status_code == 200:
            data = r.json()
            user = data.get("data", {}).get("user", {})
            timeline = user.get("edge_owner_to_timeline_media", {})
            edges = timeline.get("edges", [])
            page_info = timeline.get("page_info", {})
            print("Edges count:", len(edges))
            print("Page info:", page_info)
            with open("scratch/web_profile_info.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        else:
            print("Response:", r.text[:200])
except Exception as e:
    print("Error:", e)
