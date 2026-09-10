export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

    const runAutoSync = async () => {
      try {
        const { syncInstagramFromRapidApi } = await import("@/lib/instagram");
        console.log("[Auto-Sync] Nis sinkronizimi automatik me Instagram (cdo 8 ore)...");
        const res = await syncInstagramFromRapidApi();
        console.log("[Auto-Sync] Rezultati:", res.message);
      } catch (err) {
        console.error("[Auto-Sync] Gabim gjate sinkronizimit automatik:", err);
      }
    };

    // Nis intervalin cdo 8 ore
    setInterval(runAutoSync, EIGHT_HOURS_MS);
    console.log("[Auto-Sync] Sistemi i sinkronizimit automatik cdo 8 ore eshte aktivizuar me sukses.");
  }
}
