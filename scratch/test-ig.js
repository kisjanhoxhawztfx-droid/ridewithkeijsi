async function testInstagram() {
  console.log("Testing direct Instagram fetch...");
  try {
    const res = await fetch("https://www.instagram.com/api/v1/users/web_profile_info/?username=ridewithkeijsi", {
      headers: {
        "x-ig-app-id": "936619743392459",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://www.instagram.com/ridewithkeijsi/",
      },
    });

    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Length:", text.length);
    if (res.ok) {
      const data = JSON.parse(text);
      const edges = data.data?.user?.edge_owner_to_timeline_media?.edges || [];
      console.log("Found edges:", edges.length);
      const pageInfo = data.data?.user?.edge_owner_to_timeline_media?.page_info;
      console.log("Page info:", pageInfo);
    } else {
      console.log("Preview response:", text.slice(0, 300));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testInstagram();
