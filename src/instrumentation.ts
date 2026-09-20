export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

    const runAutoSync = async () => {
      try {
        const { syncInstagramFromRapidApi } = await import("@/lib/instagram");
        console.log("[Auto-Sync] Nis kontrolli automatik i Instagramit (cdo 4 ore për #motorr)...");
        const res = await syncInstagramFromRapidApi();
        console.log("[Auto-Sync] Rezultati:", res.message);
      } catch (err) {
        console.error("[Auto-Sync] Gabim gjate sinkronizimit automatik:", err);
      }
    };

    // Nis sinkronizimin fillestar pas 5 sekondash nga ngritja e serverit
    setTimeout(runAutoSync, 5000);

    // Perserit kontrollin cdo 4 ore
    setInterval(runAutoSync, FOUR_HOURS_MS);
    console.log("[Auto-Sync] Sistemi i kontrollit automatik të Instagramit cdo 4 ore eshte aktivizuar me sukses.");
  }
}

