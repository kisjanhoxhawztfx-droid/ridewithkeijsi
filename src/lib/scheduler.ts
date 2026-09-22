import cron from "node-cron";
import { syncYouTubeEpisodes } from "./youtube";
import { syncInstagramMotorcycles, syncInstagramFromRapidApi } from "./instagram";
import db from "./db";

let isSchedulerRunning = false;

export function initBackgroundSyncScheduler() {
  if (isSchedulerRunning) return;
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_CRON === "true") {
    // Run sync job twice daily (13:00 and 20:00) = max 62 requests/month, well under 100 free limit
    cron.schedule("0 13,20 * * *", async () => {
      console.log("[CRON] Running twice-daily scheduled synchronization...");
      try {
        const ytAuto = await db.siteSetting.findUnique({ where: { key: "youtube_auto_sync" } });
        if (ytAuto?.value === "true") {
          console.log("[CRON] Running YouTube sync...");
          await syncYouTubeEpisodes();
        }

        const igAuto = await db.siteSetting.findUnique({ where: { key: "instagram_auto_sync" } });
        if (igAuto?.value === "true" || igAuto === null) {
          console.log("[CRON] Running Instagram sync (twice daily)...");
          if (process.env.RAPIDAPI_KEY) {
            await syncInstagramFromRapidApi();
          } else {
            await syncInstagramMotorcycles();
          }
        }
      } catch (err) {
        console.error("[CRON] Error during background sync:", err);
      }
    });

    isSchedulerRunning = true;
    console.log("✓ Background sync scheduler initialized (twice daily: 13:00 & 20:00)");
  }
}
