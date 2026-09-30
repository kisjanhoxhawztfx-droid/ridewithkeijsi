async function testPixnoyApi() {
  const url = "https://pixnoy.com/api/posts?username=ridewithkeijsi&userid=40334434162&id2=17841440384861804&next=AQHTgfOsI96nwzhOJ_UOPNkK3RjPsniMsZAuEJBsmpeyveffjWIEyVMh9hzXfp9bdm8xrE9bjunN8zHH40jckVDfQg";
  console.log("Fetching:", url);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://pixnoy.com/profile/ridewithkeijsi/",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Has next:", data.posts?.has_next);
    console.log("Items count:", data.posts?.items?.length);
    if (data.posts?.items) {
      data.posts.items.forEach((item, idx) => {
        console.log(`\n[${idx + 1}] Shortcode: ${item.shortcode}`);
        console.log(`Caption: ${item.sum?.slice(0, 100)}...`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

testPixnoyApi();
