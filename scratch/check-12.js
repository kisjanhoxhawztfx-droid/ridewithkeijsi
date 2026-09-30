const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const shortcodes = ['DdWqMhRqlc6', 'DdUcoevRRcx', 'DdYZBO4C6fm', 'DdcFLKgR9ef', 'DdYtm_RiICZ', 'DdbYn4QAbwH', 'DdWNZ66g0Od', 'DdZEbhHq40p', 'DdeXKZEgIwH', 'DdV8e-hxR0E', 'DdUL8U5OjpQ', 'Ddd3Pv_uGdP'];

async function check() {
  for (const sc of shortcodes) {
    const post = await db.instagramPost.findFirst({
      where: {
        OR: [
          { permalink: { contains: sc } },
          { id: sc }
        ]
      }
    });
    if (post) {
      console.log(`[IN DB] ${sc} -> category: ${post.category}, status: ${post.status}, title: "${post.title}"`);
    } else {
      console.log(`[MISSING] ${sc}`);
    }
  }
}

check().then(() => db.$disconnect());
