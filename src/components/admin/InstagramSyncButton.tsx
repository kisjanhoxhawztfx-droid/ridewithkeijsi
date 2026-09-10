"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function InstagramSyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const res = await fetch("/api/sync/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ridewithkeijsi" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          type: "success",
          text: data.message || "Sinkronizimi u krye me sukses!",
        });
        router.refresh();
      } else {
        setResult({
          type: "error",
          text: data.message || data.error || "Sinkronizimi dështoi",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gabim rrjeti gjatë sinkronizimit";
      setResult({ type: "error", text: msg });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
        <span>{syncing ? "Duke u sinkronizuar..." : "Sinkronizo nga Instagram (@ridewithkeijsi)"}</span>
      </button>

      {result && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            result.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{result.text}</span>
        </div>
      )}
    </div>
  );
}
