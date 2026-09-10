"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  MousePointerClick,
  Calendar,
  Upload,
  Play,
  Film,
  Sparkles,
} from "lucide-react";

interface Advertisement {
  id: string;
  businessName: string;
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaType: string;
  destinationUrl: string;
  position: string;
  ctaText: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  priority: number;
  totalImpressions: number;
  totalClicks: number;
  createdAt: string;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"VIDEO" | "IMAGE">("VIDEO");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [position, setPosition] = useState("HOMEPAGE_MIDDLE");
  const [ctaText, setCtaText] = useState("Shiko Ofertën");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("5");
  const [status, setStatus] = useState("ACTIVE");

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads?admin=true");
      const data = await res.json();
      if (data.ads) setAds(data.ads);
    } catch {
      setStatusMessage({ type: "error", text: "Dështoi ngarkimi i reklamave." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress("Po ngarkohet skedari...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ads");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ngarkimi dështoi.");
      } else {
        setMediaUrl(data.url);
        setMediaType(data.mediaType);
        setUploadProgress("Skedari u ngarkua me sukses!");
      }
    } catch {
      alert("Gabim gjatë lidhjes me serverin për ngarkim.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          title,
          description,
          mediaUrl,
          mediaType,
          destinationUrl,
          position,
          ctaText,
          startDate: startDate || null,
          endDate: endDate || null,
          priority: parseInt(priority, 10),
          status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        // Reset form
        setBusinessName("");
        setTitle("");
        setDescription("");
        setMediaUrl("");
        setDestinationUrl("");
        setStatusMessage({ type: "success", text: "Reklama u krijua me sukses!" });
        await fetchAds();
      } else {
        alert(data.error || "Dështoi krijimi i reklamës.");
      }
    } catch {
      alert("Ndodhi një gabim gjatë ruajtjes.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await fetch("/api/ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setAds(ads.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    } catch {
      alert("Nuk mund të ndryshohej statusi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë reklamë?")) return;
    try {
      await fetch(`/api/ads?id=${id}`, { method: "DELETE" });
      setAds(ads.filter((a) => a.id !== id));
      setStatusMessage({ type: "success", text: "Reklama u fshi me sukses." });
    } catch {
      alert("Nuk mund të fshihej reklama.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00b2fe]" />
            <span className="text-xs font-bold text-[#00b2fe] uppercase tracking-wider font-['Outfit']">
              SISTEMI I REKLAMAVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Menaxheri i Reklamave & Sponsorëve
          </h1>
          <p className="text-xs text-gray-400">
            Ngarkoni video/imazhe reklamash, caktoni hapësirat në faqe dhe monitoroni klikimet.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold shadow-[0_0_20px_rgba(0,178,254,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Krijo Reklamë të Re</span>
        </button>
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
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Ad Campaigns Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen reklamat...</div>
      ) : ads.length === 0 ? (
        <div className="surface-card p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#00b2fe]">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-['Outfit']">Nuk ka reklama aktive</h3>
          <p className="text-xs text-gray-400">
            Krijoni fushatën tuaj të parë duke ngarkuar një video ose imazh biznesi.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary !py-2 text-xs font-bold inline-flex"
          >
            Krijo Reklamë
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ads.map((ad) => {
            const ctr = ad.totalImpressions > 0
              ? ((ad.totalClicks / ad.totalImpressions) * 100).toFixed(1)
              : "0.0";

            return (
              <div
                key={ad.id}
                className="surface-card p-5 border border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-black border border-white/10">
                  {ad.mediaType === "VIDEO" ? (
                    <video
                      src={ad.mediaUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={ad.mediaUrl} alt={ad.title} fill sizes="400px" className="object-cover" />
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                        ad.status === "ACTIVE"
                          ? "bg-green-500/90 text-black"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {ad.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-gray-300 border border-white/10">
                      {ad.position}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#00b2fe]">
                      Prioriteti: {ad.priority}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-bold text-[#00b2fe] uppercase tracking-wider">
                    {ad.businessName}
                  </div>
                  <h3 className="text-base font-bold text-white font-['Outfit']">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{ad.description}</p>
                  )}
                  <div className="text-[11px] text-gray-500 truncate pt-1">
                    Link: <a href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:underline">{ad.destinationUrl}</a>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Eye className="w-3.5 h-3.5 text-[#00b2fe]" />
                      <span>{ad.totalImpressions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <MousePointerClick className="w-3.5 h-3.5 text-green-400" />
                      <span>{ad.totalClicks.toLocaleString()}</span>
                    </div>
                    <div className="text-green-400 font-bold">
                      CTR: {ctr}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(ad.id, ad.status)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                        ad.status === "ACTIVE"
                          ? "bg-white/5 border-white/15 text-gray-300 hover:text-white"
                          : "bg-green-500/20 border-green-500/30 text-green-400"
                      }`}
                    >
                      {ad.status === "ACTIVE" ? "Çaktivizo" : "Aktivizo"}
                    </button>

                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Fshij Reklamën"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Advertisement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-xl w-full p-6 border border-white/15 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Krijo / Ngarko Reklamë të Re
            </h3>

            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Emri i Biznesit *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="p.sh. Motoshop Tirana"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Titulli Promovues *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="p.sh. Pajisje & Pjesë Motorrash"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Media Section */}
              <div className="p-4 rounded-xl bg-[#06080d] border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-gray-300 uppercase">
                  Skedari i Videos ose Imazhit (Max 50MB) *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="btn-secondary text-xs !py-2 !px-3 font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Po ngarkohet..." : "Zgjidh Skedarin nga Pajisja"}</span>
                  </button>

                  <span className="text-[11px] text-gray-400">{uploadProgress}</span>
                </div>

                <div className="text-[11px] text-gray-500">
                  Ose vendosni URL direkte:
                </div>
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://.../video.mp4 ose /uploads/ads/..."
                  className="w-full bg-black border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Linku i Destinacionit (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://instagram.com/biznesi ose https://biznes.al"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Teksti i Butonit (CTA)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Shiko Ofertën"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Pozicioni në Faqe
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="HOMEPAGE_HERO_BELOW">Ballinë (Nën Hero)</option>
                    <option value="HOMEPAGE_MIDDLE">Ballinë (Në Mes)</option>
                    <option value="EPISODE_BOTTOM">Faqja e Episodit (Poshtë)</option>
                    <option value="MOTORRA_BANNER">Faqja e Motorrave (Poshtë)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Prioriteti (1 - 10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Përshkrimi i Reklamës
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Zbritje ekskluzive për ndjekësit e Ride with Keijsi..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary !py-2 text-xs"
                >
                  Anulo
                </button>
                <button type="submit" className="btn-primary !py-2 text-xs font-bold">
                  Publiko Reklamën
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
