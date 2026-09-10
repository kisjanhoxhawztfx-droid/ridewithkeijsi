import db from "./db";

// Helper to parse ISO 8601 YouTube duration to total seconds (e.g. PT45S -> 45, PT1M10S -> 70, PT24M18S -> 1458)
export function parseDurationToSeconds(isoDuration: string): number {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

// Helper to format ISO 8601 YouTube duration (e.g. PT24M18S -> 24:18)
export function formatYouTubeDuration(isoDuration: string): string {
  if (!isoDuration) return "00:00";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
}

// Check if a video is a YouTube Short via HTTP check, duration (<= 180s), or hashtags
export async function isYouTubeShort(
  videoId?: string,
  isoDuration?: string,
  title: string = "",
  description: string = ""
): Promise<boolean> {
  // Check tags / hashtags in title or description
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes("#shorts") ||
    text.includes("#short") ||
    text.includes("/shorts/") ||
    text.includes("#youtubeshorts")
  ) {
    return true;
  }

  // Check duration: YouTube Shorts are up to 3 minutes (180 seconds)
  if (isoDuration) {
    const durationSec = parseDurationToSeconds(isoDuration);
    if (durationSec > 0 && durationSec <= 180) {
      return true;
    }
  }

  // Definitive check: YouTube returns 200 for shorts, 303 redirect for normal videos
  if (videoId) {
    try {
      const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
        method: "HEAD",
        redirect: "manual",
      });
      if (res.status === 200) {
        return true;
      }
    } catch {
      // Ignore network errors and fallback to duration check
    }
  }

  return false;
}

// Generate URL slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .substring(0, 100);
}

export interface YouTubeSyncResult {
  success: boolean;
  message: string;
  itemsSynced: number;
  newEpisodesAdded: number;
  episodesUpdated: number;
  shortsExcluded?: number;
  error?: string;
}

export async function testYouTubeConnection(apiKey?: string, channelId?: string) {
  const key = apiKey || process.env.YOUTUBE_API_KEY;
  let chanId = channelId || process.env.YOUTUBE_CHANNEL_ID;

  if (!key) {
    return { success: false, message: "YouTube API Key is missing. Please provide a valid key." };
  }

  // Get channel ID from settings if not passed
  if (!chanId) {
    const setting = await db.siteSetting.findUnique({ where: { key: "youtube_channel_id" } });
    chanId = setting?.value || "@RideWithkeijsi";
  }

  if (!chanId) {
    return { success: false, message: "YouTube Channel ID or Handle is missing." };
  }

  try {
    let url = "";
    if (chanId.startsWith("@")) {
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=${encodeURIComponent(chanId)}&key=${key}`;
    } else if (chanId.startsWith("UC")) {
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(chanId)}&key=${key}`;
    } else {
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${encodeURIComponent(chanId)}&key=${key}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        message: data.error?.message || "Failed to connect to YouTube Data API",
      };
    }

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: `No YouTube channel found matching identifier '${chanId}'.`,
      };
    }

    const channel = data.items[0];
    return {
      success: true,
      channelTitle: channel.snippet?.title,
      channelDescription: channel.snippet?.description,
      subscriberCount: channel.statistics?.subscriberCount,
      videoCount: channel.statistics?.videoCount,
      thumbnail: channel.snippet?.thumbnails?.default?.url,
      uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error connecting to YouTube";
    return { success: false, message: errorMessage };
  }
}

export async function syncYouTubeEpisodes(): Promise<YouTubeSyncResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelSetting = await db.siteSetting.findUnique({ where: { key: "youtube_channel_id" } });
  const channelId = channelSetting?.value || process.env.YOUTUBE_CHANNEL_ID || "@RideWithkeijsi";

  if (!apiKey || !channelId) {
    return {
      success: false,
      message: "YouTube API Key or Channel ID is not configured. Go to Admin > YouTube to configure.",
      itemsSynced: 0,
      newEpisodesAdded: 0,
      episodesUpdated: 0,
    };
  }

  const syncLog = await db.syncLog.create({
    data: {
      platform: "YOUTUBE",
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  try {
    // 1. Get channel upload playlist ID
    let chanQueryUrl = "";
    if (channelId.startsWith("@")) {
      chanQueryUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(channelId)}&key=${apiKey}`;
    } else if (channelId.startsWith("UC")) {
      chanQueryUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${apiKey}`;
    } else {
      chanQueryUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${encodeURIComponent(channelId)}&key=${apiKey}`;
    }

    const chanRes = await fetch(chanQueryUrl);
    const chanData = await chanRes.json();

    if (!chanRes.ok || !chanData.items || chanData.items.length === 0) {
      throw new Error(chanData.error?.message || `YouTube channel '${channelId}' could not be found`);
    }

    const uploadsPlaylistId = chanData.items[0].contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error("Could not retrieve uploads playlist for the channel");
    }

    // 2. Fetch recent videos from uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}`;
    const playRes = await fetch(playlistUrl);
    const playData = await playRes.json();

    if (!playRes.ok) {
      throw new Error(playData.error?.message || "Failed to fetch playlist items");
    }

    const rawVideos = playData.items || [];
    if (rawVideos.length === 0) {
      await db.syncLog.update({
        where: { id: syncLog.id },
        data: { status: "SUCCESS", itemsSynced: 0, message: "No videos found in uploads playlist", completedAt: new Date() },
      });
      return {
        success: true,
        message: "No videos found to sync.",
        itemsSynced: 0,
        newEpisodesAdded: 0,
        episodesUpdated: 0,
        shortsExcluded: 0,
      };
    }

    const videoIds = rawVideos.map((v: { contentDetails: { videoId: string } }) => v.contentDetails.videoId).filter(Boolean);

    // 3. Fetch detailed metadata (durations, tags, view counts)
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${apiKey}`;
    const vidRes = await fetch(videoDetailsUrl);
    const vidData = await vidRes.json();

    const videoMap = new Map<string, { snippet: { title?: string; description?: string; thumbnails?: { maxres?: { url?: string }; standard?: { url?: string }; high?: { url?: string }; default?: { url?: string } }; tags?: string[]; publishedAt?: string }; contentDetails: { duration?: string }; statistics: { viewCount?: string } }>();
    if (vidData.items) {
      for (const item of vidData.items) {
        videoMap.set(item.id, item);
      }
    }

    let addedCount = 0;
    let updatedCount = 0;
    let shortsExcludedCount = 0;

    for (const vid of rawVideos) {
      const videoId = vid.contentDetails.videoId;
      const details = videoMap.get(videoId);

      const title = details?.snippet?.title || vid.snippet.title;
      const description = details?.snippet?.description || vid.snippet.description || "";
      const rawDuration = details?.contentDetails?.duration || "";

      // 4. STRICT FILTER: Exclude YouTube Shorts (duration <= 180s, #shorts tag, or /shorts/ endpoint)
      if (await isYouTubeShort(videoId, rawDuration, title, description)) {
        shortsExcludedCount++;
        continue; // DO NOT import YouTube Shorts as episodes
      }

      const publishedAt = new Date(details?.snippet?.publishedAt || vid.snippet.publishedAt);
      const rawThumbnail =
        details?.snippet?.thumbnails?.maxres?.url ||
        details?.snippet?.thumbnails?.standard?.url ||
        details?.snippet?.thumbnails?.high?.url ||
        vid.snippet.thumbnails?.high?.url ||
        vid.snippet.thumbnails?.default?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      const durationFormatted = rawDuration
        ? formatYouTubeDuration(rawDuration)
        : "15:00";

      const viewCount = details?.statistics?.viewCount ? parseInt(details.statistics.viewCount, 10) : 0;
      const tags = details?.snippet?.tags ? details.snippet.tags.join(", ") : "";

      const existing = await db.episode.findUnique({
        where: { youtubeVideoId: videoId },
      });

      let baseSlug = generateSlug(title);
      if (!baseSlug) baseSlug = `episode-${videoId}`;

      if (existing) {
        await db.episode.update({
          where: { youtubeVideoId: videoId },
          data: {
            title,
            description,
            thumbnailUrl: rawThumbnail,
            duration: durationFormatted,
            viewCount,
            publishedAt,
            tags,
          },
        });
        updatedCount++;
      } else {
        // Ensure slug is unique
        let slug = baseSlug;
        let counter = 1;
        while (await db.episode.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        await db.episode.create({
          data: {
            youtubeVideoId: videoId,
            title,
            slug,
            description,
            thumbnailUrl: rawThumbnail,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            duration: durationFormatted,
            viewCount,
            publishedAt,
            isFeatured: addedCount === 0 && (await db.episode.count()) === 0,
            isVisible: true,
            orderIndex: 0,
            tags,
          },
        });
        addedCount++;
      }
    }

    const totalSynced = addedCount + updatedCount;
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "SUCCESS",
        itemsSynced: totalSynced,
        message: `Successfully synchronized ${totalSynced} episodes (${addedCount} new, ${updatedCount} updated, ${shortsExcludedCount} shorts excluded).`,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Sync completed: ${addedCount} new episodes added, ${updatedCount} updated (${shortsExcludedCount} YouTube Shorts excluded).`,
      itemsSynced: totalSynced,
      newEpisodesAdded: addedCount,
      episodesUpdated: updatedCount,
      shortsExcluded: shortsExcludedCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "YouTube sync failed";
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "ERROR",
        errorDetail: errorMsg,
        message: "Synchronization failed",
        completedAt: new Date(),
      },
    });

    return {
      success: false,
      message: errorMsg,
      itemsSynced: 0,
      newEpisodesAdded: 0,
      episodesUpdated: 0,
      error: errorMsg,
    };
  }
}
