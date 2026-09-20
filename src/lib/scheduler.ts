import cron from "node-cron";
import { syncYouTubeEpisodes } from "./youtube";
import { syncInstagramMotorcycles, syncInstagramFromRapidApi } from "./instagram";
import db from "./db";

let isSchedulerRunning = false;

export function initBackgroundSyncScheduler() {
  if (isSchedulerRunning) return;
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_CRON === "true") {
    // Run sync job every 4 hours (e.g. 00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
    cron.schedule("0 */4 * * *", async () => {
      console.log("[CRON] Running 4-hour scheduled synchronization...");
      try {
        const ytAuto = await db.siteSetting.findUnique({ where: { key: "youtube_auto_sync" } });
        if (ytAuto?.value === "true") {
          console.log("[CRON] Running YouTube sync...");
          await syncYouTubeEpisodes();
        }

        const igAuto = await db.siteSetting.findUnique({ where: { key: "instagram_auto_sync" } });
        if (igAuto?.value === "true" || igAuto === null) {
          console.log("[CRON] Running Instagram sync (every 4 hours)...");
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
    console.log("✓ Background sync scheduler initialized (every 4 hours)");
  }
}
