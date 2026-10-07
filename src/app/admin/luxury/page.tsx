"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
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
  Pencil,
} from "lucide-react";
import { WhatsAppIcon, CrownIcon } from "@/components/ui/Icons";

interface LuxuryVehicle {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  images?: string | null; // JSON array of image URLs
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

  // Multi-image state for create
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Edit vehicle state
  const [editingVehicle, setEditingVehicle] = useState<LuxuryVehicle | null>(null);
  const [editCategory, setEditCategory] = useState("ROLLS_ROYCE");
  const [editTitle, setEditTitle] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriceText, setEditPriceText] = useState("");
  const [editPricePerDay, setEditPricePerDay] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editVisible, setEditVisible] = useState(true);
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editVideoPreview, setEditVideoPreview] = useState<string | null>(null);
  const [editExistingVideoUrl, setEditExistingVideoUrl] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editProgress, setEditProgress] = useState("");
  const editImageInputRef = useRef<HTMLInputElement>(null);
  const editVideoInputRef = useRef<HTMLInputElement>(null);

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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeCreateImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setNewName("");
    setNewTitle("");
    setNewDescription("");
    setNewPriceText("Me Rezervim / Ditë");
    setNewPricePerDay("");
    setNewFeatures("Shofer VIP me Kostum, Interior Lëkure, Minibar, Wi-Fi 5G");
    setNewFeatured(false);
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFile(null);
    setVideoPreview(null);
    setUploadProgress("");
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

    if (imageFiles.length === 0) {
      alert("Ju lutem zgjidhni të paktën një foto për makinën.");
      return;
    }

    setUploading(true);
    try {
      // Upload all images directly to Vercel Blob
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgress(`Po ngarkohet foto ${i + 1} nga ${imageFiles.length}...`);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`luxury/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploadedImageUrls.push(blob.url);
      }

      // Upload video if selected
      let videoUrl: string | null = null;
      if (videoFile) {
        setUploadProgress("Po ngarkohet videoja...");
        const safeName = videoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`luxury/videos/${Date.now()}-${safeName}`, videoFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        videoUrl = blob.url;
      }

      setUploadProgress("Po ruhet makina...");
      const res = await fetch("/api/luxury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName || newTitle,
          category: newCategory,
          title: newTitle,
          description: newDescription,
          imageUrl: uploadedImageUrls[0],
          images: uploadedImageUrls,
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
        setStatusMessage({ type: "success", text: "Makina luksoze u shtua me sukses me të gjitha fotot!" });
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Dështoi shtimi i makinës.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Ndodhi një gabim gjatë ngarkimit.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (v: LuxuryVehicle) => {
    setEditingVehicle(v);
    setEditCategory(v.category || "ROLLS_ROYCE");
    setEditTitle(v.title || "");
    setEditName(v.name || v.title || "");
    setEditDescription(v.description || "");
    setEditPriceText(v.priceText || "Me Rezervim / Ditë");
    setEditPricePerDay(v.pricePerDay ? String(v.pricePerDay) : "");
    setEditFeatures(v.features || "Shofer VIP me Kostum, Interior Lëkure, Minibar, Wi-Fi 5G");
    setEditFeatured(Boolean(v.isFeatured));
    setEditVisible(Boolean(v.isVisible));

    let imgs: string[] = [];
    if (v.images) {
      try {
        const parsed = JSON.parse(v.images);
        if (Array.isArray(parsed)) imgs = parsed;
      } catch {}
    }
    if (imgs.length === 0 && v.imageUrl) {
      imgs = [v.imageUrl];
    }
    setEditExistingImages(imgs);
    setEditNewFiles([]);
    setEditNewPreviews([]);
    setEditExistingVideoUrl(v.videoUrl || null);
    setEditVideoFile(null);
    setEditVideoPreview(null);
    setEditProgress("");
  };

  const handleEditNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setEditNewFiles((prev) => [...prev, ...files]);
    setEditNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (editImageInputRef.current) editImageInputRef.current.value = "";
  };

  const removeEditExistingImage = (index: number) => {
    setEditExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const makeCoverEditExistingImage = (index: number) => {
    setEditExistingImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const removeEditNewFile = (index: number) => {
    setEditNewFiles((prev) => prev.filter((_, i) => i !== index));
    setEditNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditVideoFile(file);
    setEditVideoPreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    if (editExistingImages.length === 0 && editNewFiles.length === 0) {
      alert("Makina duhet të ketë të paktën një foto.");
      return;
    }

    setSavingEdit(true);
    try {
      // Upload new images
      const newUrls: string[] = [];
      for (let i = 0; i < editNewFiles.length; i++) {
        const file = editNewFiles[i];
        setEditProgress(`Po ngarkohet foto e re ${i + 1} nga ${editNewFiles.length}...`);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`luxury/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        newUrls.push(blob.url);
      }

      // Upload new video if selected
      let finalVideoUrl = editExistingVideoUrl;
      if (editVideoFile) {
        setEditProgress("Po ngarkohet videoja e re...");
        const safeName = editVideoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`luxury/videos/${Date.now()}-${safeName}`, editVideoFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        finalVideoUrl = blob.url;
      }

      setEditProgress("Po ruhen ndryshimet...");
      const finalImages = [...editExistingImages, ...newUrls];

      const res = await fetch("/api/luxury", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingVehicle.id,
          name: editName || editTitle,
          title: editTitle,
          category: editCategory,
          description: editDescription,
          priceText: editPriceText,
          pricePerDay: editPricePerDay ? parseFloat(editPricePerDay) : null,
          features: editFeatures,
          isFeatured: editFeatured,
          isVisible: editVisible,
          images: finalImages,
          imageUrl: finalImages[0] || editingVehicle.imageUrl,
          videoUrl: finalVideoUrl,
        }),
      });

      if (res.ok) {
        setEditingVehicle(null);
        setStatusMessage({ type: "success", text: "Makina luksoze u përditësua me sukses!" });
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Dështoi përditësimi i makinës.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Ndodhi një gabim gjatë përditësimit.");
    } finally {
      setSavingEdit(false);
      setEditProgress("");
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
      alert("Nuk mund të ndryshohej statusi i veçuar.");
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë mjet nga flota VIP?")) return;
    try {
      await fetch(`/api/luxury?id=${id}`, { method: "DELETE" });
      setVehicles(vehicles.filter((v) => v.id !== id));
      setStatusMessage({ type: "success", text: "Mjeti u fshi nga flota me sukses." });
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
            <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
            <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider font-['Outfit']">
              MENAXHIMI I FLOTËS SË MAKINAVE LUKSOZE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <CrownIcon className="w-7 h-7 text-[#ffd700]" />
            <span>Luxury Services &amp; Chauffeur</span>
          </h1>
          <p className="text-xs text-gray-400">
            Menaxhoni flotën VIP (Rolls-Royce, Bentley, Maybach, Limuzina) dhe numrat e kontaktit për qira me shofer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/luxury"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
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
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "vehicles"
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          👑 Flota e Makinave VIP ({vehicles.length})
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          ⚙️ Numrat &amp; Cilësimet
        </button>
      </div>

      {/* TAB 1: Vehicles Management */}
      {activeTab === "vehicles" && (
        <div className="surface-card border border-white/10 overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Makinat në Katalogun VIP
              </h3>
              <p className="text-xs text-gray-400">
                Shtoni modele të reja me foto të shumta, video, çmime dhe specifikime shoferi.
              </p>
            </div>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black font-extrabold !py-2 !px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Makinë të Re</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400">Po ngarkohet flota...</div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Nuk ka ende makina në flotën Luxury. Shtoni një mjet me butonin lart.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-24 aspect-[16/10] rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                      <Image src={v.imageUrl} alt={v.title} fill sizes="96px" className="object-cover" />
                      {v.videoUrl && (
                        <div className="absolute bottom-1 right-1 bg-black/80 rounded p-0.5">
                          <Film className="w-3 h-3 text-blue-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-['Outfit']">{v.title}</span>
                        <span className="px-2 py-0.5 rounded bg-[#ffd700]/15 text-[#ffd700] text-[9px] font-bold">
                          {v.category}
                        </span>
                        {v.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                            TOP VIP
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
                      onClick={() => handleOpenEdit(v)}
                      className="p-2 rounded-lg bg-[#ffd700]/10 hover:bg-[#ffd700]/20 border border-[#ffd700]/30 text-[#ffd700]"
                      title="Ndrysho Makinën (Edit)"
                    >
                      <Pencil className="w-4 h-4" />
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

              {/* Multi-Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                  Fotot e Makinës * ({imagePreviews.length} të zgjedhura)
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                        <Image src={src} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[8px] font-black bg-[#ffd700] text-black px-1 rounded">
                            COVER
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeCreateImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 rounded-full p-0.5 text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/20 hover:border-[#ffd700]/50 rounded-lg p-4 flex flex-col items-center gap-2 text-gray-400 hover:text-[#ffd700] transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-bold">
                    {imagePreviews.length === 0 ? "Zgjidh Foto nga Galeria" : "Shto Foto të Tjera"}
                  </span>
                  <span className="text-[10px] text-gray-500">JPG, PNG, WebP • Mund të zgjidhni shumë foto</span>
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
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
                    className="w-full border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-lg p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Film className="w-4 h-4" />
                    <span className="text-xs font-bold">Zgjidh Video nga Galeria</span>
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
                  <span>{uploadProgress || "Po ngarkohen skedarët... ju lutem prisni."}</span>
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
                  disabled={uploading || imageFiles.length === 0}
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

      {/* Modal: Edit Luxury Vehicle */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-[#ffd700]/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#ffd700]" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Ndrysho Makinën VIP (Edit)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Kategoria e Mjetit *
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
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
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Existing Images */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                    Fotot Aktuale ({editExistingImages.length})
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">Kliko &quot;Bëje Cover&quot; për foton kryesore</span>
                </label>

                {editExistingImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {editExistingImages.map((src, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-video rounded-lg overflow-hidden bg-black border ${
                          idx === 0 ? "border-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "border-white/10"
                        }`}
                      >
                        <Image src={src} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                        {idx === 0 ? (
                          <span className="absolute top-1 left-1 text-[8px] font-black bg-[#ffd700] text-black px-1.5 py-0.5 rounded shadow">
                            COVER
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makeCoverEditExistingImage(idx)}
                            className="absolute top-1 left-1 text-[8px] font-bold bg-black/80 hover:bg-[#ffd700] hover:text-black text-white px-1.5 py-0.5 rounded transition-colors"
                            title="Bëje këtë foto kryesore (Cover)"
                          >
                            Bëje Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeEditExistingImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 rounded-full p-0.5 text-white transition-colors"
                          title="Fshij foton"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-yellow-400/80 italic mb-2">Të gjitha fotot ekzistuese u fshinë. Duhet të shtoni të paktën një foto të re më poshtë.</p>
                )}
              </div>

              {/* Add New Images Section */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#ffd700]" />
                  Shto Foto të Tjera të Reja ({editNewPreviews.length} të zgjedhura)
                </label>

                {editNewPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {editNewPreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black border border-[#ffd700]/30">
                        <Image src={src} alt={`Foto e Re ${idx + 1}`} fill className="object-cover" />
                        <span className="absolute top-1 left-1 text-[8px] font-black bg-[#ffd700] text-black px-1 rounded">
                          E RE
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEditNewFile(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 rounded-full p-0.5 text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => editImageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/20 hover:border-[#ffd700]/50 rounded-lg p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-[#ffd700] transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-xs font-bold">Zgjidh Foto të Reja nga Pajisja</span>
                </button>
                <input
                  ref={editImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleEditNewImagesChange}
                  className="hidden"
                />
              </div>

              {/* Video in Edit */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-blue-400" />
                    Video e Makinës (opsionale)
                  </span>
                  {editExistingVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setEditExistingVideoUrl(null)}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Hiq videon aktuale
                    </button>
                  )}
                </label>

                {editVideoPreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-blue-500/30">
                    <video src={editVideoPreview} controls className="w-full rounded-lg max-h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setEditVideoFile(null); setEditVideoPreview(null); }}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : editExistingVideoUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/20 p-2 flex items-center justify-between bg-black/50">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Film className="w-4 h-4 text-blue-400" />
                      <span>Video është aktive</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => editVideoInputRef.current?.click()}
                      className="text-xs text-[#ffd700] hover:underline"
                    >
                      Zëvendëso
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editVideoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-lg p-2.5 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Film className="w-4 h-4" />
                    <span className="text-xs font-bold">Ngarko Video</span>
                  </button>
                )}
                <input
                  ref={editVideoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleEditVideoChange}
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
                    value={editPriceText}
                    onChange={(e) => setEditPriceText(e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Çmimi për Ditë (€ opsionale)
                  </label>
                  <input
                    type="number"
                    value={editPricePerDay}
                    onChange={(e) => setEditPricePerDay(e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Veçoritë VIP
                </label>
                <input
                  type="text"
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
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
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#ffd700] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Options */}
              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editFeaturedVehicle"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="rounded border-white/20 bg-black text-[#ffd700]"
                  />
                  <label htmlFor="editFeaturedVehicle" className="text-xs text-gray-300">
                    Makinë kryesore VIP në ballinë
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editVisibleVehicle"
                    checked={editVisible}
                    onChange={(e) => setEditVisible(e.target.checked)}
                    className="rounded border-white/20 bg-black text-[#ffd700]"
                  />
                  <label htmlFor="editVisibleVehicle" className="text-xs text-gray-300">
                    E dukshme në katalog
                  </label>
                </div>
              </div>

              {/* Progress message */}
              {savingEdit && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 text-xs text-[#ffd700]">
                  <div className="w-3 h-3 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span>{editProgress || "Po ruhen ndryshimet... ju lutem prisni."}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="btn-secondary !py-2 text-xs"
                  disabled={savingEdit}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || (editExistingImages.length === 0 && editNewFiles.length === 0)}
                  className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black font-extrabold !py-2 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingEdit ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Po ruan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Ruaj Ndryshimet</span>
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
