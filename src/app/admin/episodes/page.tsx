"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tv,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Star,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from "lucide-react";

interface Episode {
  id: string;
  youtubeVideoId: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  duration?: string | null;
  viewCount?: number | null;
  publishedAt: string;
  isFeatured: boolean;
  isVisible: boolean;
}

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add modal state
  const [newVideoId, setNewVideoId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("15:00");
  const [isFeaturedNew, setIsFeaturedNew] = useState(false);

  const fetchEpisodesAndStatus = async () => {
    try {
      const [epRes, syncRes] = await Promise.all([
        fetch("/api/episodes?admin=true"),
        fetch("/api/sync/youtube"),
      ]);

      const epData = await epRes.json();
      const syncData = await syncRes.json();

      if (epData.episodes) setEpisodes(epData.episodes);
      if (syncData.channelId) setChannelId(syncData.channelId);
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ngarkimit të të dhënave." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodesAndStatus();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/sync/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", channelId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `U lidh me sukses me kanalin '${data.channelTitle}' (${data.subscriberCount || 0} abonentë, ${data.videoCount || 0} video).`,
        });
      } else {
        setStatusMessage({ type: "error", text: data.message || "Lidhja dështoi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë testimit të lidhjes." });
    } finally {
      setTesting(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/sync/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message });
        await fetchEpisodesAndStatus();
      } else {
        setStatusMessage({ type: "error", text: data.message });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Sinkronizimi dështoi." });
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try {
      await fetch("/api/episodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      setEpisodes(episodes.map((e) => (e.id === id ? { ...e, isVisible: !current } : e)));
    } catch {
      alert("Nuk mund të ndryshohej dukshmëria.");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch("/api/episodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      setEpisodes(episodes.map((e) => (e.id === id ? { ...e, isFeatured: !current } : e)));
    } catch {
      alert("Nuk mund të ndryshohej statusi i zgjedhur.");
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë episod nga faqja? (Kjo nuk do ta fshijë videon nga YouTube)")) {
      return;
    }
    try {
      await fetch(`/api/episodes?id=${id}`, { method: "DELETE" });
      setEpisodes(episodes.filter((e) => e.id !== id));
      setStatusMessage({ type: "success", text: "Referenca e episodit u hoq nga faqja." });
    } catch {
      alert("Nuk mund të fshihej episodi.");
    }
  };

  const handleCreateManualEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeVideoId: newVideoId,
          title: newTitle,
          description: newDescription,
          duration: newDuration,
          isFeatured: isFeaturedNew,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewVideoId("");
        setNewTitle("");
        setNewDescription("");
        setStatusMessage({ type: "success", text: "Episodi u shtua me sukses!" });
        await fetchEpisodesAndStatus();
      } else {
        alert(data.error || "Dështoi shtimi i episodit.");
      }
    } catch {
      alert("Ndodhi një gabim gjatë shtimit.");
    }
  };

  const filteredEpisodes = episodes.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.youtubeVideoId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-['Outfit']">
              MENAXHIMI I EMISIONIT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            YouTube & Episodet
          </h1>
          <p className="text-xs text-gray-400">
            Lidhni kanalin zyrtar të YouTube dhe menaxhoni episodet që shfaqen në platformë.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="btn-primary !py-2 !px-4 text-xs font-bold shadow-[0_0_15px_rgba(0,178,254,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Po sinkronizohet..." : "Sinkronizo Tani"}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-secondary !py-2 !px-4 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Shto Episod me ID</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            statusMessage.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* YouTube Connection Config Card */}
      <div className="surface-card p-6 border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
          <Tv className="w-4 h-4 text-red-500" />
          <span>Konfigurimi i Kanalit YouTube</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
              ID ose Handle i Kanalit YouTube (@handle ose UC...)
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="p.sh. @ridewithkeijsi ose UCxxxxxxxxxxxx"
              className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full btn-secondary text-xs font-bold !py-2.5"
            >
              {testing ? "Po testohet..." : "Testo Lidhjen"}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white/5 text-[11px] text-gray-400 border border-white/5">
          💡 <strong>Shënim:</strong> Kur shtoni çelësin e YouTube API në <code>.env</code> ose në Cilësimet, emisionet e reja shkarkohen automatikisht çdo 30 minuta pa ngarkuar asnjë video në server.
        </div>
      </div>

      {/* Episode Listing & Search */}
      <div className="surface-card border border-white/10 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Episodet e Importuara ({episodes.length})
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko në episode..."
              className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen episodet...</div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Nuk u gjet asnjë episod. Klikoni &quot;Sinkronizo Tani&quot; ose &quot;Shto Episod me ID&quot;.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredEpisodes.map((ep) => (
              <div
                key={ep.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                    <Image src={ep.thumbnailUrl} alt={ep.title} fill sizes="120px" className="object-cover" />
                    {ep.duration && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                        {ep.duration}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {ep.isFeatured && (
                        <span className="px-2 py-0.5 rounded bg-[#00b2fe] text-black font-extrabold text-[9px] uppercase tracking-wider">
                          I ZGJEDHUR
                        </span>
                      )}
                      {!ep.isVisible && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-extrabold text-[9px] uppercase tracking-wider">
                          I FSHEHUR
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">
                        {new Date(ep.publishedAt).toLocaleDateString("sq-AL")}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate font-['Outfit']">
                      {ep.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                      <span>ID: {ep.youtubeVideoId}</span>
                      {typeof ep.viewCount === "number" && ep.viewCount > 0 && (
                        <span>• {ep.viewCount.toLocaleString()} shikime</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleFeatured(ep.id, ep.isFeatured)}
                    title={ep.isFeatured ? "Hiq nga të zgjedhurit" : "Bëje të zgjedhur"}
                    className={`p-2 rounded-lg border transition-colors ${
                      ep.isFeatured
                        ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(ep.id, ep.isVisible)}
                    title={ep.isVisible ? "Fshih nga faqja" : "Bëje të dukshëm"}
                    className={`p-2 rounded-lg border transition-colors ${
                      ep.isVisible
                        ? "bg-[#00b2fe]/15 border-[#00b2fe]/30 text-[#00b2fe]"
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {ep.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${ep.youtubeVideoId.replace(/_demo\d+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Shiko në YouTube"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDeleteEpisode(ep.id)}
                    title="Fshij referencën nga faqja"
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Manual Episode Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Shto Episod me YouTube Video ID
            </h3>

            <form onSubmit={handleCreateManualEpisode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  YouTube Video ID ose URL *
                </label>
                <input
                  type="text"
                  required
                  value={newVideoId}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    const match = val.match(/(?:youtu\.be\/|v=|\/embed\/|\/v\/)([^#&?]+)/);
                    setNewVideoId(match ? match[1] : val);
                  }}
                  placeholder="p.sh. dQw4w9WgXcQ ose linku i plotë"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Titulli i Episodit *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="p.sh. EP. 13 — Test Ride Yamaha MT-09"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Kohëzgjatja (min:sek)
                </label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="24:18"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Përshkrimi
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Përshkrim i shkurtër i episodit..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeaturedNew}
                  onChange={(e) => setIsFeaturedNew(e.target.checked)}
                  className="rounded border-white/20 bg-black text-[#00b2fe]"
                />
                <label htmlFor="isFeatured" className="text-xs text-gray-300">
                  Vendose si Episod të Zgjedhur në Ballinë (Hero)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary !py-2 text-xs"
                >
                  Anulo
                </button>
                <button type="submit" className="btn-primary !py-2 text-xs font-bold">
                  Shto Episodin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
