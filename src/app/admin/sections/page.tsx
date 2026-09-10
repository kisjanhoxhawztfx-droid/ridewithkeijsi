"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Home,
  Save,
} from "lucide-react";

interface Section {
  id: string;
  slug: string;
  name: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  isVisible: boolean;
  showOnHomepage: boolean;
  orderIndex: number;
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.sections) setSections(data.sections);
    } catch {
      setStatusMessage({ type: "error", text: "Dështoi ngarkimi i seksioneve." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleUpdateField = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Seksionet u ruajtën me sukses!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Dështoi ruajtja." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ruajtjes." });
    } finally {
      setSaving(false);
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
              STRUKTURA E FAQES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Seksionet e Faqes & Zgjerimi
          </h1>
          <p className="text-xs text-gray-400">
            Aktivizoni ose çaktivizoni seksione të faqes (Episodet, Motorra, Lajmet, Eventet, Guidat) dhe rregulloni titujt.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold shadow-[0_0_20px_rgba(0,178,254,0.4)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Po ruhet..." : "Ruaj Ndryshimet"}</span>
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
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Section List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen seksionet...</div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className={`surface-card p-6 border transition-all ${
                sec.isVisible ? "border-white/10" : "border-white/5 opacity-60"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Identification */}
                <div className="lg:col-span-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00b2fe]" />
                    <span className="font-extrabold text-sm text-white font-['Outfit']">
                      {sec.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono">
                    /{sec.slug}
                  </div>
                </div>

                {/* Edit Title & Description */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1 uppercase">
                      Titulli në Faqe
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateField(sec.id, "title", e.target.value)}
                      className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1 uppercase">
                      Përshkrimi
                    </label>
                    <input
                      type="text"
                      value={sec.description || ""}
                      onChange={(e) => handleUpdateField(sec.id, "description", e.target.value)}
                      className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sec.isVisible}
                      onChange={(e) => handleUpdateField(sec.id, "isVisible", e.target.checked)}
                      className="rounded border-white/20 bg-black text-[#00b2fe]"
                    />
                    <span>Aktivizuar në Faqe</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sec.showOnHomepage}
                      onChange={(e) => handleUpdateField(sec.id, "showOnHomepage", e.target.checked)}
                      className="rounded border-white/20 bg-black text-[#00b2fe]"
                    />
                    <span>Shfaq në Ballinë (Home)</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
