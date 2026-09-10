"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Bike,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Star,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Search,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

interface Motorcycle {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  thumbnailUrl: string;
  caption: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  engine?: string | null;
  status: string;
  isFeatured: boolean;
  isVisible: boolean;
  publishedAt: string;
}

export default function AdminMotorraPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [accountName, setAccountName] = useState("ridewithkeijsi");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New motorcycle form state
  const [permalink, setPermalink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [brand, setBrand] = useState("Yamaha");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [price, setPrice] = useState("");
  const [engine, setEngine] = useState("");
  const [status, setStatus] = useState("FOR_SALE");
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchMotorcycles = async () => {
    try {
      const res = await fetch("/api/motorra?admin=true");
      const data = await res.json();
      if (data.motorcycles) setMotorcycles(data.motorcycles);
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ngarkimit të motorrave." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/sync/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `U lidh me profilin Instagram @${data.username} (${data.mediaCount || 0} postime).`,
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Lidhja me Instagram Graph API kërkon access token.",
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Testimi i lidhjes dështoi." });
    } finally {
      setTesting(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/sync/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message });
        await fetchMotorcycles();
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
      await fetch("/api/motorra", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      setMotorcycles(motorcycles.map((m) => (m.id === id ? { ...m, isVisible: !current } : m)));
    } catch {
      alert("Nuk mund të ndryshohej dukshmëria.");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch("/api/motorra", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      setMotorcycles(motorcycles.map((m) => (m.id === id ? { ...m, isFeatured: !current } : m)));
    } catch {
      alert("Nuk mund të ndryshohej statusi.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/motorra", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setMotorcycles(motorcycles.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
    } catch {
      alert("Nuk mund të përditësohej statusi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë motorr nga faqja?")) {
      return;
    }
    try {
      await fetch(`/api/motorra?id=${id}`, { method: "DELETE" });
      setMotorcycles(motorcycles.filter((m) => m.id !== id));
      setStatusMessage({ type: "success", text: "Motorri u fshi nga sistemi." });
    } catch {
      alert("Nuk mund të fshihej motorri.");
    }
  };

  const handleCreateMotorcycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/motorra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permalink,
          thumbnailUrl,
          caption,
          brand,
          model,
          year,
          price,
          engine,
          status,
          isFeatured,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setPermalink("");
        setThumbnailUrl("");
        setCaption("");
        setModel("");
        setPrice("");
        setEngine("");
        setStatusMessage({ type: "success", text: "Motorri u shtua me sukses!" });
        await fetchMotorcycles();
      } else {
        alert(data.error || "Dështoi shtimi i motorrit.");
      }
    } catch {
      alert("Ndodhi një gabim gjatë shtimit.");
    }
  };

  const filteredMotorcycles = motorcycles.filter((m) => {
    const fullText = `${m.brand || ""} ${m.model || ""} ${m.caption}`.toLowerCase();
    return fullText.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-['Outfit']">
              MARKETPLACE & MOTORRA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Motorra në Shitje (Instagram)
          </h1>
          <p className="text-xs text-gray-400">
            Sinkronizoni postimet nga Instagrami ose shtoni manualisht motorra me specifikat e tyre.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="btn-primary !py-2 !px-4 text-xs font-bold shadow-[0_0_15px_rgba(0,178,254,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Po sinkronizohet..." : "Sinkronizo Instagram"}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-secondary !py-2 !px-4 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Shto Motorr</span>
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

      {/* Instagram Config Card */}
      <div className="surface-card p-6 border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
          <InstagramIcon className="w-4 h-4 text-pink-500" />
          <span>Konfigurimi i Instagramit</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
              Emri i Përdoruesit në Instagram (@username)
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="ridewithkeijsi"
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
      </div>

      {/* Motorcycle Listing Table */}
      <div className="surface-card border border-white/10 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Motorrat në Sistem ({motorcycles.length})
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko motorra..."
              className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen motorrat...</div>
        ) : filteredMotorcycles.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Nuk u gjet asnjë motorr. Shtoni një motorr me butonin &quot;Shto Motorr&quot;.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredMotorcycles.map((moto) => (
              <div
                key={moto.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Thumbnail & Specs */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                    <Image src={moto.thumbnailUrl} alt={moto.brand || "Motorr"} fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white font-['Outfit']">
                        {moto.brand} {moto.model}
                      </span>
                      {moto.year && (
                        <span className="text-xs text-gray-400">({moto.year})</span>
                      )}
                      {moto.isFeatured && (
                        <span className="px-2 py-0.5 rounded bg-[#00b2fe] text-black font-extrabold text-[9px] uppercase tracking-wider">
                          I ZGJEDHUR
                        </span>
                      )}
                      {!moto.isVisible && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-extrabold text-[9px] uppercase tracking-wider">
                          I FSHEHUR
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="text-[#00b2fe] font-bold">
                        {moto.price ? `${moto.price.toLocaleString()} €` : "Me Marrëveshje"}
                      </span>
                      {moto.engine && <span>• {moto.engine}</span>}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 max-w-lg">
                      {moto.caption}
                    </p>
                  </div>
                </div>

                {/* Status selector & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={moto.status}
                    onChange={(e) => handleStatusChange(moto.id, e.target.value)}
                    className="bg-[#06080d] border border-white/15 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="FOR_SALE">Në Shitje</option>
                    <option value="RESERVED">E Rezervuar</option>
                    <option value="SOLD">E Shitur</option>
                  </select>

                  <button
                    onClick={() => handleToggleFeatured(moto.id, moto.isFeatured)}
                    title={moto.isFeatured ? "Hiq nga të zgjedhurit" : "Bëje të zgjedhur"}
                    className={`p-2 rounded-lg border transition-colors ${
                      moto.isFeatured
                        ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(moto.id, moto.isVisible)}
                    title={moto.isVisible ? "Fshih nga faqja" : "Bëje të dukshëm"}
                    className={`p-2 rounded-lg border transition-colors ${
                      moto.isVisible
                        ? "bg-[#00b2fe]/15 border-[#00b2fe]/30 text-[#00b2fe]"
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {moto.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={moto.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Shiko në Instagram"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(moto.id)}
                    title="Fshij motorrin"
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

      {/* Add Motorcycle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-white/15 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Shto Motorr të Ri në Shitje
            </h3>

            <form onSubmit={handleCreateMotorcycle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Linku i Postimit në Instagram *
                </label>
                <input
                  type="url"
                  required
                  value={permalink}
                  onChange={(e) => setPermalink(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Fotoja / Thumbnail URL *
                </label>
                <input
                  type="url"
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... ose linku i fotos"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Marka *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Yamaha, BMW, Ducati..."
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Modeli *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="YZF-R6, GS 1250..."
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Viti
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2022"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Çmimi (€)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="12000"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Kubikazhi
                  </label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="600cc"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Përshkrimi / Caption nga Instagrami
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Detaje të motorrit, km, gjendja, aksesorët..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeaturedMoto"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black text-[#00b2fe]"
                />
                <label htmlFor="isFeaturedMoto" className="text-xs text-gray-300">
                  Vendose si Motorr të Zgjedhur në Ballinë
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
                  Ruaj Motorrin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
