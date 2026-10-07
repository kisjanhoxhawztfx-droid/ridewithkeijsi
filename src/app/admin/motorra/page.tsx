"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  Bike,
  Plus,
  Eye,
  EyeOff,
  Star,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Search,
  Archive,
  ShoppingBag,
  Upload,
  X,
  ImageIcon,
  Phone,
  Gauge,
  Calendar,
  ExternalLink,
  Pencil,
  Save,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import BrandAutocomplete from "@/components/admin/BrandAutocomplete";

interface MotorcycleItem {
  id: string;
  title?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  mileageKm?: number | null;
  mileageMi?: number | null;
  engine?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  imageUrl?: string | null;
  images?: string[];
  status: string;
  isFeatured: boolean;
  isVisible: boolean;
  publishedAt: string;
}



export default function AdminMotorraPage() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "FOR_SALE" | "SOLD">("ALL");

  // Form state
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Yamaha");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [price, setPrice] = useState("");
  const [mileageKm, setMileageKm] = useState("");
  const [mileageMi, setMileageMi] = useState("");
  const [engine, setEngine] = useState("");
  const [phone, setPhone] = useState("+355697738559");
  const [whatsapp, setWhatsapp] = useState("+355697738559");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("FOR_SALE");
  const [isFeatured, setIsFeatured] = useState(false);

  // Multiple files state for Create
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit motorcycle state
  const [editingMotorcycle, setEditingMotorcycle] = useState<MotorcycleItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBrand, setEditBrand] = useState("Yamaha");
  const [editModel, setEditModel] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editMileageKm, setEditMileageKm] = useState("");
  const [editMileageMi, setEditMileageMi] = useState("");
  const [editEngine, setEditEngine] = useState("");
  const [editPhone, setEditPhone] = useState("+355697738559");
  const [editWhatsapp, setEditWhatsapp] = useState("+355697738559");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("FOR_SALE");
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsVisible, setEditIsVisible] = useState(true);

  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editProgress, setEditProgress] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  // Auto-calculate miles when km is entered
  const handleKmChange = (val: string) => {
    setMileageKm(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setMileageMi(Math.round(num * 0.621371).toString());
    } else {
      setMileageMi("");
    }
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const makeCoverPhoto = (index: number) => {
    setSelectedFiles((prev) => {
      const copy = [...prev];
      const [file] = copy.splice(index, 1);
      return [file, ...copy];
    });
    setPreviews((prev) => {
      const copy = [...prev];
      const [src] = copy.splice(index, 1);
      return [src, ...copy];
    });
  };

  const resetForm = () => {
    setTitle("");
    setBrand("Yamaha");
    setModel("");
    setYear(new Date().getFullYear().toString());
    setPrice("");
    setMileageKm("");
    setMileageMi("");
    setEngine("");
    setPhone("+355697738559");
    setWhatsapp("+355697738559");
    setDescription("");
    setStatus("FOR_SALE");
    setIsFeatured(false);
    setSelectedFiles([]);
    setPreviews([]);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateMotorcycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Ju lutem ngarkoni të paktën 1 foto për motorrin.");
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(`Po ngarkohet fotoja ${i + 1} nga ${selectedFiles.length}...`);
        const file = selectedFiles[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`motorra/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploadedUrls.push(blob.url);
      }

      setUploadProgress("Po ruhet motorri në bazën e të dhënave...");

      const res = await fetch("/api/motorra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          brand: brand ? brand.trim() : null,
          model: model ? model.trim() : null,
          year: year ? parseInt(year, 10) : null,
          price: price ? parseFloat(price) : null,
          mileageKm: mileageKm ? parseInt(mileageKm, 10) : null,
          mileageMi: mileageMi ? parseInt(mileageMi, 10) : null,
          engine: engine ? engine.trim() : null,
          phone: phone ? phone.trim() : null,
          whatsapp: whatsapp ? whatsapp.trim() : null,
          description: description ? description.trim() : null,
          status,
          isFeatured,
          imageUrl: uploadedUrls[0],
          images: uploadedUrls,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Dështoi ruajtja e motorrit.");
      }

      setShowAddModal(false);
      resetForm();
      setStatusMessage({ type: "success", text: `Motorri "${title}" u shtua me sukses me ${uploadedUrls.length} foto!` });
      await fetchMotorcycles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ndodhi një gabim gjatë shtimit";
      alert(msg);
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (m: MotorcycleItem) => {
    setEditingMotorcycle(m);
    setEditTitle(m.title || "");
    setEditBrand(m.brand || "Yamaha");
    setEditModel(m.model || "");
    setEditYear(m.year ? String(m.year) : "");
    setEditPrice(m.price ? String(m.price) : "");
    setEditMileageKm(m.mileageKm !== null && m.mileageKm !== undefined ? String(m.mileageKm) : "");
    setEditMileageMi(m.mileageMi !== null && m.mileageMi !== undefined ? String(m.mileageMi) : "");
    setEditEngine(m.engine || "");
    setEditPhone(m.phone || "+355697738559");
    setEditWhatsapp(m.whatsapp || m.phone || "+355697738559");
    setEditDescription(m.description || "");
    setEditStatus(m.status || "FOR_SALE");
    setEditIsFeatured(Boolean(m.isFeatured));
    setEditIsVisible(Boolean(m.isVisible));

    let imgs: string[] = [];
    if (Array.isArray(m.images) && m.images.length > 0) {
      imgs = [...m.images];
    } else if (m.imageUrl) {
      imgs = [m.imageUrl];
    }
    setEditExistingImages(imgs);
    setEditNewFiles([]);
    setEditNewPreviews([]);
    setEditProgress("");
  };

  const handleEditKmChange = (val: string) => {
    setEditMileageKm(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setEditMileageMi(Math.round(num * 0.621371).toString());
    } else {
      setEditMileageMi("");
    }
  };

  const handleEditNewFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setEditNewFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setEditNewPreviews((prev) => [...prev, ...newPreviews]);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMotorcycle) return;

    if (editExistingImages.length === 0 && editNewFiles.length === 0) {
      alert("Motorri duhet të ketë të paktën 1 foto.");
      return;
    }

    setSavingEdit(true);
    try {
      const newUploadedUrls: string[] = [];
      for (let i = 0; i < editNewFiles.length; i++) {
        setEditProgress(`Po ngarkohet foto e re ${i + 1} nga ${editNewFiles.length}...`);
        const file = editNewFiles[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await upload(`motorra/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        newUploadedUrls.push(blob.url);
      }

      setEditProgress("Po ruhen ndryshimet e motorrit...");
      const finalImages = [...editExistingImages, ...newUploadedUrls];

      const res = await fetch("/api/motorra", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMotorcycle.id,
          title: editTitle.trim(),
          brand: editBrand ? editBrand.trim() : null,
          model: editModel ? editModel.trim() : null,
          year: editYear ? parseInt(editYear, 10) : null,
          price: editPrice ? parseFloat(editPrice) : null,
          mileageKm: editMileageKm ? parseInt(editMileageKm, 10) : null,
          mileageMi: editMileageMi ? parseInt(editMileageMi, 10) : null,
          engine: editEngine ? editEngine.trim() : null,
          phone: editPhone ? editPhone.trim() : null,
          whatsapp: editWhatsapp ? editWhatsapp.trim() : null,
          description: editDescription ? editDescription.trim() : null,
          status: editStatus,
          isFeatured: editIsFeatured,
          isVisible: editIsVisible,
          images: finalImages,
          imageUrl: finalImages[0] || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Dështoi përditësimi i motorrit.");
      }

      setEditingMotorcycle(null);
      setStatusMessage({
        type: "success",
        text: `Motorri "${editTitle}" u përditësua me sukses me ${finalImages.length} foto!`,
      });
      await fetchMotorcycles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ndodhi një gabim gjatë ruajtjes";
      alert(msg);
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setSavingEdit(false);
      setEditProgress("");
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

  const handleToggleStatus = async (id: string, current: string) => {
    const nextStatus = current === "FOR_SALE" ? "SOLD" : "FOR_SALE";
    try {
      await fetch("/api/motorra", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      setMotorcycles(motorcycles.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)));
      setStatusMessage({
        type: "success",
        text: `Statusi u ndryshua në: ${nextStatus === "SOLD" ? "E Shitur ❌" : "Në Shitje ✅"}`,
      });
    } catch {
      alert("Nuk mund të ndryshohej statusi.");
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
      alert("Nuk mund të ndryshohej statusi VIP.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë motorr?")) return;
    try {
      await fetch(`/api/motorra?id=${id}`, { method: "DELETE" });
      setMotorcycles(motorcycles.filter((m) => m.id !== id));
      setStatusMessage({ type: "success", text: "Motorri u fshi me sukses." });
    } catch {
      alert("Dështoi fshirja e motorrit.");
    }
  };

  const filteredMotorcycles = motorcycles
    .filter((m) => {
      if (statusFilter === "FOR_SALE") return m.status === "FOR_SALE";
      if (statusFilter === "SOLD") return m.status === "SOLD";
      return true;
    })
    .filter((m) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const t = (m.title || "").toLowerCase();
      const b = (m.brand || "").toLowerCase();
      const d = (m.description || "").toLowerCase();
      return t.includes(q) || b.includes(q) || d.includes(q);
    });

  const forSaleCount = motorcycles.filter((m) => m.status === "FOR_SALE").length;
  const soldCount = motorcycles.filter((m) => m.status === "SOLD").length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00b2fe]" />
            <span className="text-xs font-bold text-[#00b2fe] uppercase tracking-wider font-['Outfit']">
              MENAXHIMI I MOTORRAVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
            <Bike className="w-7 h-7 text-[#00b2fe]" />
            <span>Motorra në Shitje</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Postoni motorra direkt me foto nga telefoni me të gjitha të dhënat (çmimi, viti, kilometrat në km &amp; milje, kontakti).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/motorra"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <span>Shiko Faqen Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00b2fe]" />
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary !py-2.5 !px-5 text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,178,254,0.35)]"
          >
            <Plus className="w-4 h-4" />
            <span>Shto Motorr të Ri</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="surface-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Gjithsej Motorra</span>
            <p className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-0.5">{motorcycles.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Bike className="w-5 h-5 text-gray-300" />
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-green-500/20 bg-green-500/[0.02] flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs text-green-400 font-bold uppercase tracking-wider">Në Shitje</span>
            <p className="text-xl sm:text-2xl font-black text-green-400 font-['Outfit'] mt-0.5">{forSaleCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-zinc-700/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Të Shitura</span>
            <p className="text-xl sm:text-2xl font-black text-gray-400 font-['Outfit'] mt-0.5">{soldCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <Archive className="w-5 h-5 text-gray-400" />
          </div>
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

      {/* Filters and Search Bar */}
      <div className="surface-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kërko sipas titullit, markës..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "ALL" ? "bg-[#00b2fe] text-black" : "bg-white/5 text-gray-300 hover:text-white"
            }`}
          >
            Të Gjithë ({motorcycles.length})
          </button>
          <button
            onClick={() => setStatusFilter("FOR_SALE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "FOR_SALE" ? "bg-green-500 text-black font-extrabold" : "bg-white/5 text-gray-300 hover:text-white"
            }`}
          >
            Në Shitje ({forSaleCount})
          </button>
          <button
            onClick={() => setStatusFilter("SOLD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "SOLD" ? "bg-zinc-700 text-white" : "bg-white/5 text-gray-300 hover:text-white"
            }`}
          >
            Të Shitura ({soldCount})
          </button>
        </div>
      </div>

      {/* Motorcycle Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen motorrat...</div>
      ) : filteredMotorcycles.length === 0 ? (
        <div className="surface-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
          <Bike className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-sm font-bold text-white font-['Outfit']">Nuk u gjet asnjë motorr</h3>
          <p className="text-xs text-gray-400">Shtoni motorrin tuaj të parë duke klikuar butonin &quot;Shto Motorr të Ri&quot; lart.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMotorcycles.map((m) => {
            const photoCount = m.images && m.images.length > 0 ? m.images.length : (m.imageUrl ? 1 : 0);
            return (
              <div
                key={m.id}
                className="surface-card border border-white/10 rounded-2xl overflow-hidden hover:border-[#00b2fe]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo area with badges */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    {m.imageUrl ? (
                      <Image
                        src={m.imageUrl}
                        alt={m.title || "Motorr"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <Bike className="w-10 h-10 text-gray-600" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Status & Photos Count Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <button
                        onClick={() => handleToggleStatus(m.id, m.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md transition-transform active:scale-95 ${
                          m.status === "SOLD"
                            ? "bg-red-500/90 text-white border border-red-400/50"
                            : "bg-green-500 text-black font-extrabold"
                        }`}
                        title="Kliko për të ndryshuar statusin"
                      >
                        {m.status === "SOLD" ? "❌ E Shitur" : "✅ Në Shitje"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        {m.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[9px] font-black flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-black text-black" />
                            VIP
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-[#00b2fe]" />
                          <span>{photoCount} {photoCount === 1 ? "foto" : "foto"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Price Tag */}
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-[#00b2fe]/50 text-xs font-black text-[#00d2ff]">
                        {m.price ? `€${m.price.toLocaleString()}` : "Me Rezervim"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00b2fe] uppercase">
                        <span>{m.brand || "Motorr"}</span>
                        {m.model && <span>• {m.model}</span>}
                      </div>
                      <h3 className="text-sm font-extrabold text-white font-['Outfit'] mt-0.5 line-clamp-1">
                        {m.title || "Motorr pa titull"}
                      </h3>
                    </div>

                    {/* Specs chips */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                      {m.year && (
                        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5">
                          <Calendar className="w-3.5 h-3.5 text-[#00b2fe]" />
                          <span>Viti: <strong>{m.year}</strong></span>
                        </div>
                      )}

                      {m.engine && (
                        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5">
                          <Tag className="w-3.5 h-3.5 text-[#00b2fe]" />
                          <span>Motori: <strong>{m.engine}</strong></span>
                        </div>
                      )}

                      {(m.mileageKm !== null && m.mileageKm !== undefined) && (
                        <div className="col-span-2 flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-[#00b2fe]" />
                            <span>Kilometra:</span>
                          </div>
                          <span className="font-bold text-white">
                            {m.mileageKm.toLocaleString()} km
                            {m.mileageMi && <span className="text-gray-400 font-normal"> ({m.mileageMi.toLocaleString()} mi)</span>}
                          </span>
                        </div>
                      )}
                    </div>

                    {m.description && (
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(m.id, m.isFeatured)}
                      className={`p-2 rounded-lg border transition-all ${
                        m.isFeatured
                          ? "bg-yellow-400/15 border-yellow-400/40 text-yellow-400"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                      title={m.isFeatured ? "Hiq nga VIP" : "Bëje VIP"}
                    >
                      <Star className={`w-3.5 h-3.5 ${m.isFeatured ? "fill-yellow-400" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleToggleVisibility(m.id, m.isVisible)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                      title={m.isVisible ? "Fshih nga faqja" : "Bëje të dukshëm"}
                    >
                      {m.isVisible ? <Eye className="w-3.5 h-3.5 text-[#00b2fe]" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-2 rounded-lg bg-[#00b2fe]/10 hover:bg-[#00b2fe]/20 border border-[#00b2fe]/30 text-[#00b2fe] transition-all"
                      title="Ndrysho të dhënat e motorrit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                    title="Fshij motorrin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add New Motorcycle with Multiple Photos */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="surface-card max-w-2xl w-full p-5 sm:p-7 border border-white/15 rounded-3xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00b2fe]/20 border border-[#00b2fe]/40 flex items-center justify-center">
                  <Bike className="w-4 h-4 text-[#00b2fe]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-['Outfit']">
                    Shto Motorr të Ri
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Ngarkoni disa foto nga galeria dhe plotësoni specifikat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMotorcycle} className="space-y-4">
              {/* Photo Upload Area - Multi-select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-['Outfit'] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Fotot e Motorrit (Mund të zgjidhni sa të doni) *
                  </span>
                  {selectedFiles.length > 0 && (
                    <span className="text-[11px] text-[#00b2fe] font-bold">
                      {selectedFiles.length} foto të zgjedhura
                    </span>
                  )}
                </label>

                {/* Previews Grid */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                        <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                        {idx === 0 ? (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#00b2fe] text-black text-[9px] font-black uppercase">
                            Ballinë
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makeCoverPhoto(idx)}
                            className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 hover:bg-[#00b2fe] hover:text-black text-white text-[8px] font-bold uppercase transition-colors"
                            title="Vendos si foto kryesore (ballinë)"
                          >
                            Bëje Ballinë
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 rounded-full p-1 text-white transition-colors"
                          title="Hiq këtë foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add More Button inside grid */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-[#00b2fe]/60 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#00b2fe] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px] font-bold">+ Shto Foto</span>
                    </button>
                  </div>
                )}

                {/* Empty State Upload Button */}
                {previews.length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 hover:border-[#00b2fe]/60 rounded-xl p-6 sm:p-8 flex flex-col items-center gap-2.5 text-gray-400 hover:text-[#00b2fe] transition-all bg-white/[0.01]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#00b2fe]/10 border border-[#00b2fe]/30 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#00b2fe]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Zgjidh Foto nga Galeria e Telefonit / Kompjuterit
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Mund të zgjidhni disa foto njëherësh (JPG, PNG, WebP)
                    </span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </div>

              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Titulli i Plotë i Motorrit *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="p.sh. Yamaha TMAX 560 Tech Max"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Marka *
                  </label>
                  <BrandAutocomplete
                    value={brand}
                    onChange={setBrand}
                    required
                  />
                </div>
              </div>

              {/* Year, Price, Engine */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Viti
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Çmimi (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="12500"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Kubikazhi
                  </label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="560 cc"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Mileage in KM and Miles */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Kilometrat (KM)
                  </label>
                  <input
                    type="number"
                    value={mileageKm}
                    onChange={(e) => handleKmChange(e.target.value)}
                    placeholder="p.sh. 15000"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Në Milje (Miles)
                  </label>
                  <input
                    type="number"
                    value={mileageMi}
                    onChange={(e) => setMileageMi(e.target.value)}
                    placeholder="p.sh. 9320"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Numri i Telefonit
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+355697738559"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-green-400" />
                    Numri i WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+355697738559"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                  Përshkrimi i Motorrit
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Gjendje perfekte, me doganë të paguar, shërbimet e kryera me librezë..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
                />
              </div>

              {/* Status & Featured */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      name="postStatus"
                      checked={status === "FOR_SALE"}
                      onChange={() => setStatus("FOR_SALE")}
                      className="text-[#00b2fe]"
                    />
                    <span>Në Shitje ✅</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      name="postStatus"
                      checked={status === "SOLD"}
                      onChange={() => setStatus("SOLD")}
                      className="text-red-400"
                    />
                    <span>E Shitur ❌</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-yellow-400 font-bold">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-white/20 bg-black text-yellow-400"
                  />
                  <span>Vendose si Motorr VIP</span>
                </label>
              </div>

              {/* Upload Progress Info */}
              {uploading && (
                <div className="p-3 rounded-xl bg-[#00b2fe]/10 border border-[#00b2fe]/30 flex items-center gap-3 text-xs text-[#00d2ff]">
                  <div className="w-4 h-4 border-2 border-[#00b2fe] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span>{uploadProgress || "Po ngarkohen fotot..."}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="btn-secondary !py-2.5 !px-4 text-xs font-bold"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="btn-primary !py-2.5 !px-6 text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Po ngarkohet...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Ngarko &amp; Publiko Motorrin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Motorcycle */}
      {editingMotorcycle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="surface-card max-w-2xl w-full p-5 sm:p-7 border border-white/15 rounded-3xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00b2fe]/20 border border-[#00b2fe]/40 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-[#00b2fe]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-['Outfit']">
                    Ndrysho Motorrin: {editingMotorcycle.title || editingMotorcycle.model || "Motorr"}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Menaxhoni fotot, specifikat dhe çmimin e motorrit
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMotorcycle(null)}
                className="p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Management Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-['Outfit'] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Fotot e Motorrit ({editExistingImages.length + editNewFiles.length} gjithsej)
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Foto e parë shërben si Ballinë
                  </span>
                </label>

                {/* Existing Images */}
                {editExistingImages.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-gray-400 block">Fotot Aktuale:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      {editExistingImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                          <Image src={src} alt={`Foto ${idx + 1}`} fill className="object-cover" unoptimized />
                          {idx === 0 ? (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#00b2fe] text-black text-[9px] font-black uppercase">
                              Ballinë
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => makeCoverEditExistingImage(idx)}
                              className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 hover:bg-[#00b2fe] hover:text-black text-white text-[8px] font-bold uppercase transition-colors"
                              title="Vendos si foto kryesore (ballinë)"
                            >
                              Bëje Ballinë
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeEditExistingImage(idx)}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 rounded-full p-1 text-white transition-colors"
                            title="Hiq foton"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newly Added Images Previews */}
                {editNewPreviews.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#00b2fe] block">Foto të Reja për t&apos;u Ngarkuar:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#00b2fe]/5 border border-[#00b2fe]/20">
                      {editNewPreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#00b2fe]/40 group">
                          <Image src={src} alt={`E re ${idx + 1}`} fill className="object-cover" />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[8px] font-black uppercase">
                            E re
                          </span>
                          <button
                            type="button"
                            onClick={() => removeEditNewFile(idx)}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 rounded-full p-1 text-white transition-colors"
                            title="Hiq foton e re"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Photos Button */}
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/20 hover:border-[#00b2fe]/60 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-[#00b2fe] transition-all bg-white/[0.01]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">+ Shto Foto të Tjera</span>
                </button>

                <input
                  ref={editFileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleEditNewFilesSelect}
                  className="hidden"
                />
              </div>

              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Titulli i Plotë i Motorrit *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="p.sh. Yamaha TMAX 560 Tech Max"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Marka *
                  </label>
                  <BrandAutocomplete
                    value={editBrand}
                    onChange={setEditBrand}
                    required
                  />
                </div>
              </div>

              {/* Model, Year, Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Modeli
                  </label>
                  <input
                    type="text"
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    placeholder="TMAX 560"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Viti
                  </label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    placeholder="2024"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Çmimi (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="12500"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Engine & Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Kubikazhi
                  </label>
                  <input
                    type="text"
                    value={editEngine}
                    onChange={(e) => setEditEngine(e.target.value)}
                    placeholder="560 cc"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Kilometrat (KM)
                  </label>
                  <input
                    type="number"
                    value={editMileageKm}
                    onChange={(e) => handleEditKmChange(e.target.value)}
                    placeholder="15000"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                    Në Milje (Miles)
                  </label>
                  <input
                    type="number"
                    value={editMileageMi}
                    onChange={(e) => setEditMileageMi(e.target.value)}
                    placeholder="9320"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00b2fe]" />
                    Numri i Telefonit
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+355697738559"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit'] flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-green-400" />
                    Numri i WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="+355697738559"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 uppercase font-['Outfit']">
                  Përshkrimi i Motorrit
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Gjendje perfekte, me doganë të paguar, shërbimet e kryera me librezë..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
                />
              </div>

              {/* Status & Featured & Visibility */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      name="editPostStatus"
                      checked={editStatus === "FOR_SALE"}
                      onChange={() => setEditStatus("FOR_SALE")}
                      className="text-[#00b2fe]"
                    />
                    <span>Në Shitje ✅</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      name="editPostStatus"
                      checked={editStatus === "SOLD"}
                      onChange={() => setEditStatus("SOLD")}
                      className="text-red-400"
                    />
                    <span>E Shitur ❌</span>
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-yellow-400 font-bold">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="rounded border-white/20 bg-black text-yellow-400"
                    />
                    <span>Motorr VIP</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={editIsVisible}
                      onChange={(e) => setEditIsVisible(e.target.checked)}
                      className="rounded border-white/20 bg-black text-[#00b2fe]"
                    />
                    <span>I Dukshëm</span>
                  </label>
                </div>
              </div>

              {/* Edit Progress Info */}
              {savingEdit && (
                <div className="p-3 rounded-xl bg-[#00b2fe]/10 border border-[#00b2fe]/30 flex items-center gap-3 text-xs text-[#00d2ff]">
                  <div className="w-4 h-4 border-2 border-[#00b2fe] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span>{editProgress || "Po ruhen ndryshimet..."}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={() => setEditingMotorcycle(null)}
                  className="btn-secondary !py-2.5 !px-4 text-xs font-bold"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || (editExistingImages.length === 0 && editNewFiles.length === 0)}
                  className="btn-primary !py-2.5 !px-6 text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingEdit ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Po ruhet...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
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
