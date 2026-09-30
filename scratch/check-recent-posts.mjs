import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

async function check() {
  const res = await fetch('https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=ridewithkeijsi', {
    headers: {
      'x-rapidapi-host': 'instagram-public-bulk-scraper.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
    }
  });

  const j = await res.json();
  const edges = j.data?.edge_owner_to_timeline_media?.edges || [];
  console.log('Total edges returned:', edges.length);
  edges.forEach((e, idx) => {
    const text = e.node?.edge_media_to_caption?.edges?.[0]?.node?.text || '';
    const isVideo = e.node?.is_video;
    const shortcode = e.node?.shortcode;
    const lower = text.toLowerCase();
    const isMotorr = lower.includes('#motorr') || lower.includes('#shitet') || lower.includes('shitet');
    const isEpisod = lower.includes('#episod') || lower.includes('episod');
    console.log(`${idx + 1}. [${isVideo ? 'VIDEO' : 'IMAGE'}] [${isMotorr ? 'MOTORR' : isEpisod ? 'EPISOD' : 'OTHER'}] - ${shortcode} - ${text.slice(0, 60).replace(/\n/g, ' ')}`);
  });
}

check().catch(console.error);
