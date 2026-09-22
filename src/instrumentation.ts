export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

    const runAutoSync = async () => {
      try {
        const { syncInstagramFromRapidApi } = await import("@/lib/instagram");
        console.log("[Auto-Sync] Nis kontrolli automatik i Instagramit (2 here ne dite)...");
        const res = await syncInstagramFromRapidApi();
        console.log("[Auto-Sync] Rezultati:", res.message);
      } catch (err) {
        console.error("[Auto-Sync] Gabim gjate sinkronizimit automatik:", err);
      }
    };

    // Nis sinkronizimin fillestar pas 10 sekondash nga ngritja e serverit
    setTimeout(runAutoSync, 10000);

    // Perserit kontrollin cdo 12 ore (2 here ne dite = max 62 kerkesa ne muaj)
    setInterval(runAutoSync, TWELVE_HOURS_MS);
    console.log("[Auto-Sync] Sistemi i kontrollit automatik te Instagramit 2 here ne dite eshte aktivizuar.");
  }
}

