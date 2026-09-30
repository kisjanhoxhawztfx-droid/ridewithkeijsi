import dotenv from 'dotenv';
dotenv.config();

const apiKey = (process.env.RAPIDAPI_KEY || "f445af1383msh2d0396ce64777c4p142ed6jsn83232537dd13").replace(/[\uFEFF\s"]/g, "").trim();

async function testProfile() {
  const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=ridewithkeijsi`;
  console.log('Testing RapidAPI for @ridewithkeijsi...');
  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      }
    });
    console.log('Status:', res.status, res.statusText);
    const json = await res.json();
    console.log('Result status:', json.status);
    if (json.data) {
      console.log('User found:', json.data.username);
      console.log('Media count on IG profile:', json.data.edge_owner_to_timeline_media?.count);
      const edges = json.data.edge_owner_to_timeline_media?.edges || [];
      console.log('Edges returned in this call:', edges.length);
      edges.slice(0, 5).forEach((e, i) => {
        console.log(`${i+1}. id: ${e.node.id}, shortcode: ${e.node.shortcode}, is_video: ${e.node.is_video}`);
      });
    } else {
      console.log('No data:', json);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testProfile();
