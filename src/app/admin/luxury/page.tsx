"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Phone,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
  Star,
  Upload,
  X,
  Film,
  ImageIcon,
} from "lucide-react";
import { WhatsAppIcon, CrownIcon } from "@/components/ui/Icons";

interface LuxuryVehicle {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
  pricePerDay?: number | null;
  priceText?: string | null;
  features?: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  orderIndex: number;
}

export default function AdminLuxuryPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "vehicles">("vehicles");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state
  const [phone, setPhone] = useState("+355697738559");
  const [whatsapp, setWhatsapp] = useState("+355697738559");
  const [title, setTitle] = useState("LUXURY SERVICES");
  const [subtitle, setSubtitle] = useState("");

  // Vehicles state
  const [vehicles, setVehicles] = useState<LuxuryVehicle[]>([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New vehicle form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("ROLLS_ROYCE");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriceText, setNewPriceText] = useState("Me Rezervim / Ditë");
  const [newPricePerDay, setNewPricePerDay] = useState("");
  const [newFeatures, setNewFeatures] = useState("Shofer VIP me Kostum, Interior Lëkure, Minibar, Wi-Fi 5G");
  const [newFeatured, setNewFeatured] = useState(false);

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [settingsRes, vehiclesRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/luxury?admin=true"),
      ]);

      const settingsData = await settingsRes.json();
      const vehiclesData = await vehiclesRes.json();

      if (settingsData.settings) {
        setPhone(settingsData.settings.luxury_phone || "+355697738559");
        setWhatsapp(settingsData.settings.luxury_whatsapp || "+355697738559");
        setTitle(settingsData.settings.luxury_title || "LUXURY SERVICES");
        setSubtitle(settingsData.settings.luxury_subtitle || "");
      }

      if (vehiclesData.vehicles) {
        setVehicles(vehiclesData.vehicles);
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ngarkimit të të dhënave." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload dështoi");
    }
    const data = await res.json();
    return data.url as string;
  };

  const resetForm = () => {
    setNewName("");
    setNewTitle("");
    setNewDescription("");
    setNewPriceText("Me Rezervim / Ditë");
    setNewPricePerDay("");
    setNewFeatures("Shofer VIP me Kostum, Interior Lëkure, Minibar, Wi-Fi 5G");
    setNewFeatured(false);
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            luxury_phone: phone,
            luxury_whatsapp: whatsapp,
            luxury_title: title,
            luxury_subtitle: subtitle,
          },
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Cilësimet e Luxury Services u ruajtën me sukses!" });
      } else {
        setStatusMessage({ type: "error", text: "Dështoi ruajtja e cilësimeve." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ruajtjes." });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Ju lutem zgjidhni një foto për makinën.");
      return;
    }

    setUploading(true);
    try {
      // Upload image (required)
      const imageUrl = await uploadFile(imageFile, "luxury");

      // Upload video (optional)
      let videoUrl: string | null = null;
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, "luxury");
      }

      const res = await fetch("/api/luxury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName || newTitle,
          category: newCategory,
          title: newTitle,
          description: newDescription,
          imageUrl,
          videoUrl,
          priceText: newPriceText,
          pricePerDay: newPricePerDay ? parseFloat(newPricePerDay) : null,
          features: newFeatures,
          isFeatured: newFeatured,
        }),
      });

      if (res.ok) {
        setShowAddVehicleModal(false);
        resetForm();
        setStatusMessage({ type: "success", text: "Makina luksoze u shtua me sukses!" });
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Dështoi shtimi i makinës.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ndodhi një gabim";
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try {
      await fetch("/api/luxury", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      setVehicles(vehicles.map((v) => (v.id === id ? { ...v, isVisible: !current } : v)));
    } catch {
      alert("Nuk mund të ndryshohej dukshmëria.");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch("/api/luxury", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      setVehicles(vehicles.map((v) => (v.id === id ? { ...v, isFeatured: !current } : v)));
    } catch {
      alert("Nuk mund të ndryshohej statusi.");
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë mjet nga flota?")) return;
    try {
      await fetch(`/api/luxury?id=${id}`, { method: "DELETE" });
      setVehicles(vehicles.filter((v) => v.id !== id));
      setStatusMessage({ type: "success", text: "Mjeti u fshi nga flota." });
    } catch {
      alert("Dështoi fshirja.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CrownIcon className="w-4 h-4 text-[#ffd700]" />
            <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider font-['Outfit']">
              MENAXHIMI I MAKINA LUKSOZE &amp; LIMUZINA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <span>LUXURY</span>
            <span className="text-[#ffd700]">SERVICES</span>
          </h1>
          <p className="text-xs text-gray-400">
            Menaxhoni flotën luksoze (Rolls-Royce, Bentley, Maybach Van, Limuzina) dhe numrat e kontaktit (+355 69 773 8559).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/luxury"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 hover:!border-[#ffd700] hover:text-[#ffd700]"
          >
            <span>Shiko Faqen Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ffd700]" />
          </a>
        </div>
      </div>

      {/* Status Alert */}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "vehicles"
              ? "bg-[#ffd700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] font-black"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          <CrownIcon className="w-3.5 h-3.5" />
          <span>Flota e Makinave ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-[#ffd700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] font-black"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          ⚙️ Cilësimet &amp; Numrat e Kontaktit
        </button>
      </div>

      {/* TAB 1: Vehicles List */}
      {activeTab === "vehicles" && (
        <div className="surface-card border border-white/10 overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <CrownIcon className="w-4 h-4 text-[#ffd700]" />
                <span>Mjetet e Flotës Luksoze</span>
              </h3>
              <p className="text-xs text-gray-400">
                Makina, limuzina dhe furgona Maybach që shfaqen te /luxury dhe në faqen kryesore.
              </p>
            </div>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black font-extrabold !py-2 !px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 fill-black" />
              <span>Shto Makinë të Re</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400">Duke ngarkuar...</div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Nuk ka mjete në flotë. Shtoni një mjet me butonin lart.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-24 aspect-[16/10] rounded-lg overflow-hidden bg-black flex-shrink-0 border border-[#ffd700]/30">
                      <Image src={v.imageUrl} alt={v.title} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-['Outfit']">{v.title}</span>
                        <span className="px-2 py-0.5 rounded bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] text-[9px] font-black uppercase">
                          {v.category}
                        </span>
                        {v.videoUrl && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-bold flex items-center gap-0.5">
                            <Film className="w-2.5 h-2.5" /> VIDEO
                          </span>
                        )}
                        {v.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black">
                            VIP FEATURED
                          </span>
                        )}
                        {!v.isVisible && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
                            I FSHEHUR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{v.description}</p>
                      <div className="text-[11px] text-gray-500">
                        Çmimi: <strong className="text-gray-300">{v.priceText || (v.pricePerDay ? `€${v.pricePerDay}/ditë` : "Me Rezervim")}</strong> • Veçoritë: {v.features}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(v.id, v.isFeatured)}
                      className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                        v.isFeatured
                          ? "bg-amber-500/20 border-amber-500/40 text-[#ffd700]"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                      title={v.isFeatured ? "Hiqe nga të zgjedhurat" : "Bëje VIP të zgjedhur"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(v.id, v.isVisible)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      title={v.isVisible ? "Fshih" : "Bëje të dukshëm"}
                    >
                      {v.isVisible ? <Eye className="w-4 h-4 text-[#ffd700]" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400"
                      title="Fshij"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Settings Form */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="surface-card p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Numri i Telefonit për Luxury Services</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+355697738559"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Numri zyrtar i kontaktit për makinat me qira (p.sh. +355697738559).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 text-green-400" />
                <span>Numri i WhatsApp për Rezervime VIP</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+355697738559"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Numri ndërkombëtar i WhatsApp për porositë e menjëhershme.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit']">
              Përshkrimi i Shërbimit Luxury
            </label>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Shërbime me qira për makina luksoze, limuzina, furgona Maybach VIP, Rolls-Royce dhe Bentley me shofer personal 24/7 në Shqipëri..."
              className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black text-xs font-extrabold !py-2.5 !px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Po ruhet..." : "Ruaj Cilësimet"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal: Add Luxury Vehicle */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-[#ffd700]/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CrownIcon className="w-5 h-5 text-[#ffd700]" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Shto Makinë Luksoze në Flotë
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddVehicleModal(false); resetForm(); }}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Kategoria e Mjetit *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ROLLS_ROYCE">👑 Rolls-Royce</option>
                  <option value="BENTLEY">👑 Bentley</option>
                  <option value="MAYBACH_VAN">👑 Mercedes-Maybach VIP Van</option>
                  <option value="LIMOUSINE">👑 Limuzinë Ekzekutive / Stretch</option>
                  <option value="LUXURY_SUV">👑 SUV Presidencial (Escalade / Range Rover)</option>
                  <option value="SPORTS_CAR">👑 Supercar / Sportive</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Titulli / Modeli i Plotë *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="p.sh. Rolls-Royce Ghost Black Badge VIP"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                  Foto e Makinës *
                </label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-[#ffd700]/30 aspect-video">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); if (imageInputRef.current) imageInputRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 hover:border-[#ffd700]/50 rounded-lg p-6 flex flex-col items-center gap-2 text-gray-400 hover:text-[#ffd700] transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-bold">Zgjidh Foto nga Galeria</span>
                    <span className="text-[10px] text-gray-500">JPG, PNG, WebP • Maks 100MB</span>
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-blue-400" />
                  Video e Makinës (opsionale)
                </label>
                {videoPreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-blue-500/30">
                    <video src={videoPreview} controls className="w-full rounded-lg max-h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setVideoFile(null); setVideoPreview(null); if (videoInputRef.current) videoInputRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-lg p-5 flex flex-col items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Film className="w-6 h-6" />
                    <span className="text-xs font-bold">Zgjidh Video nga Galeria</span>
                    <span className="text-[10px] text-gray-500">MP4, WebM, MOV • Maks 100MB</span>
                  </button>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Teksti i Çmimit
                  </label>
                  <input
                    type="text"
                    value={newPriceText}
                    onChange={(e) => setNewPriceText(e.target.value)}
                    placeholder="p.sh. Me Rezervim / Ditë"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Çmimi për Ditë (€ opsionale)
                  </label>
                  <input
                    type="number"
                    value={newPricePerDay}
                    onChange={(e) => setNewPricePerDay(e.target.value)}
                    placeholder="1200"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Veçoritë VIP (të ndara me presje)
                </label>
                <input
                  type="text"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  placeholder="Shofer VIP me Kostum, Tavan me Yje, Minibar, Wi-Fi 5G"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Përshkrimi i Detajuar
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Përshkruani ambientin e brendshëm, komoditetin dhe rastet e përshtatshme (dasma, aeroport, delegacione)..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newFeaturedVehicle"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black text-[#ffd700]"
                />
                <label htmlFor="newFeaturedVehicle" className="text-xs text-gray-300">
                  Shfaqe si makinë kryesore VIP në ballinë
                </label>
              </div>

              {/* Upload progress indicator */}
              {uploading && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 text-xs text-[#ffd700]">
                  <div className="w-3 h-3 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span>Po ngarkohen skedarët... ju lutem prisni.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddVehicleModal(false); resetForm(); }}
                  className="btn-secondary !py-2 text-xs"
                  disabled={uploading}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={uploading || !imageFile}
                  className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black font-extrabold !py-2 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Po ngarkon...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      <span>Ngarko &amp; Ruaj</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
