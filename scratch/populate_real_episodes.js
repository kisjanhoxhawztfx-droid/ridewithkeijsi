const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const realEpisodes = [
  {
    youtubeVideoId: "JpJ0gMdQkgs",
    title: 'Ride With Keijsi Episodi 5 " Flori Official "',
    slug: "ride-with-keijsi-episodi-5-flori-official",
    description: 'Në Episodin 5 të Ride With Keijsi jemi me të ftuarin special Flori Official! Një bisedë pa filtra rreth pasionit për motorrat, aventurave në rrugë dhe historive ekskluzive gjatë xhiros.',
    thumbnailUrl: "https://img.youtube.com/vi/JpJ0gMdQkgs/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=JpJ0gMdQkgs",
    duration: "32:15",
    viewCount: 3200,
    publishedAt: new Date("2026-02-15T18:00:00Z"),
    isFeatured: true,
    isVisible: true,
    orderIndex: 1,
    tags: "Ride With Keijsi, Flori Official, Episodi 5, Motorra, Talk Show, Tirane",
  },
  {
    youtubeVideoId: "w6V5S2R7bB8",
    title: 'Ride With Keijsi Episodi 4 " Artan Kola " Part 2',
    slug: "ride-with-keijsi-episodi-4-artan-kola-part-2",
    description: 'Pjesa e dytë e intervistës speciale me Artan Kola në Ride With Keijsi. Diskutojmë mbi eksperiencat motorike, adrenalinën në rrugë dhe historitë më të forta.',
    thumbnailUrl: "https://img.youtube.com/vi/w6V5S2R7bB8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=w6V5S2R7bB8",
    duration: "28:40",
    viewCount: 2850,
    publishedAt: new Date("2026-01-28T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 2,
    tags: "Ride With Keijsi, Artan Kola, Episodi 4, Pjesa 2, Motorra",
  },
  {
    youtubeVideoId: "ia1W5b2nZ-s",
    title: 'Ride With Keijsi Episodi 4 " Artan Kola " Part 1',
    slug: "ride-with-keijsi-episodi-4-artan-kola-part-1",
    description: 'Pjesa e parë e Episodit 4 me Artan Kola. Një xhiro plot biseda interesante dhe pasion për shpejtësinë me Keijsin.',
    thumbnailUrl: "https://img.youtube.com/vi/ia1W5b2nZ-s/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ia1W5b2nZ-s",
    duration: "25:10",
    viewCount: 2900,
    publishedAt: new Date("2026-01-20T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 3,
    tags: "Ride With Keijsi, Artan Kola, Episodi 4, Pjesa 1, Motorra",
  },
  {
    youtubeVideoId: "98_70ufHplA",
    title: 'Ride With Keijsi Episodi 3 " Ilir Vrenozi " part 2',
    slug: "ride-with-keijsi-episodi-3-ilir-vrenozi-part-2",
    description: 'Pjesa e dytë e intervistës me Ilir Vrenozi në Ride With Keijsi! Momente epike dhe plot të qeshura gjatë udhëtimit.',
    thumbnailUrl: "https://img.youtube.com/vi/98_70ufHplA/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=98_70ufHplA",
    duration: "34:20",
    viewCount: 4500,
    publishedAt: new Date("2026-01-05T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 4,
    tags: "Ride With Keijsi, Ilir Vrenozi, Episodi 3, Pjesa 2, Shqiperi",
  },
  {
    youtubeVideoId: "0Ibn4kHXpts",
    title: 'Ride With Keijsi Episodi 3 " Ilir Vrenozi " part 1',
    slug: "ride-with-keijsi-episodi-3-ilir-vrenozi-part-1",
    description: 'Pjesa e parë e Episodit 3 të Ride With Keijsi me Ilir Vrenozin. Xhiro, biseda dhe atmosfera e veçantë e emisionit.',
    thumbnailUrl: "https://img.youtube.com/vi/0Ibn4kHXpts/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=0Ibn4kHXpts",
    duration: "29:50",
    viewCount: 4800,
    publishedAt: new Date("2025-12-28T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 5,
    tags: "Ride With Keijsi, Ilir Vrenozi, Episodi 3, Pjesa 1, Shqiperi",
  },
  {
    youtubeVideoId: "rxHHbAMrj98",
    title: 'Ride With Keijsi Episodi 2 " Nje udhetim ne Zvicer "',
    slug: "ride-with-keijsi-episodi-2-nje-udhetim-ne-zvicer",
    description: 'Episodi 2 i Ride With Keijsi: Një udhëtim fantastik nëpër rrugët piktoreske të Zvicrës, peizazhet alpine dhe eksperienca e drejtimit.',
    thumbnailUrl: "https://img.youtube.com/vi/rxHHbAMrj98/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=rxHHbAMrj98",
    duration: "26:35",
    viewCount: 3100,
    publishedAt: new Date("2025-12-10T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 6,
    tags: "Ride With Keijsi, Zvicer, Switzerland, Episodi 2, Motorra",
  },
  {
    youtubeVideoId: "lYChSWvwSaI",
    title: 'Ride With Keijsi Episodi 1 " Stenaldo i jep Motorrit "',
    slug: "ride-with-keijsi-episodi-1-stenaldo-i-jep-motorrit",
    description: 'Episodi i parë historik i Ride With Keijsi! Stenaldo merr timonin dhe nis aventura e parë e emisionit me motorra.',
    thumbnailUrl: "https://img.youtube.com/vi/lYChSWvwSaI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=lYChSWvwSaI",
    duration: "21:15",
    viewCount: 5200,
    publishedAt: new Date("2025-11-20T18:00:00Z"),
    isFeatured: false,
    isVisible: true,
    orderIndex: 7,
    tags: "Ride With Keijsi, Stenaldo, Episodi 1, Motorra, Tirane",
  },
];

async function main() {
  // Clear old sample episodes
  await prisma.episode.deleteMany({});

  for (const ep of realEpisodes) {
    await prisma.episode.create({
      data: ep,
    });
    console.log(`✓ Inserted: ${ep.title}`);
  }

  // Update channel ID setting
  await prisma.siteSetting.upsert({
    where: { key: "youtube_channel_id" },
    update: { value: "UCx5563_qwsdQapLoVhRdrqg" },
    create: { key: "youtube_channel_id", value: "UCx5563_qwsdQapLoVhRdrqg", group: "api" },
  });

  console.log("✅ All real YouTube episodes from @RideWithkeijsi added successfully!");
  await prisma.$disconnect();
}

main().catch(console.error);
