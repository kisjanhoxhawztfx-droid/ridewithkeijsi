import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

async function testCursor() {
  const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=ridewithkeijsi`;
  console.log('Fetching user_posts...');
  const res = await fetch(url, {
    headers: {
      'x-rapidapi-host': 'instagram-public-bulk-scraper.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
    }
  });
  console.log('Status:', res.status);
  const j = await res.json();
  const edges = j.data?.edges || j.data?.items || j.data?.edge_owner_to_timeline_media?.edges || [];
  console.log('Items returned:', edges.length, 'Keys in data:', j.data ? Object.keys(j.data) : null);
}

testCursor().catch(console.error);
