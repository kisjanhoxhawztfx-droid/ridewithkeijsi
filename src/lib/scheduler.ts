import cron from "node-cron";
import { syncYouTubeEpisodes } from "./youtube";
import { syncInstagramMotorcycles } from "./instagram";
import db from "./db";

let isSchedulerRunning = false;

export function initBackgroundSyncScheduler() {
  if (isSchedulerRunning) return;
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_CRON === "true") {
    // Run sync job every 30 minutes
    cron.schedule("*/30 * * * *", async () => {
      console.log("[CRON] Running scheduled synchronization...");
      try {
        const ytAuto = await db.siteSetting.findUnique({ where: { key: "youtube_auto_sync" } });
        if (ytAuto?.value === "true") {
          console.log("[CRON] Running YouTube sync...");
          await syncYouTubeEpisodes();
        }

        const igAuto = await db.siteSetting.findUnique({ where: { key: "instagram_auto_sync" } });
        if (igAuto?.value === "true") {
          console.log("[CRON] Running Instagram sync...");
          await syncInstagramMotorcycles();
        }
      } catch (err) {
        console.error("[CRON] Error during background sync:", err);
      }
    });

    isSchedulerRunning = true;
    console.log("✓ Background sync scheduler initialized (every 30m)");
  }
}
