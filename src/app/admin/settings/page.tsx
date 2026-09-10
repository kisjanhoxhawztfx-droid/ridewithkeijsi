"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  Share2,
  Mail,
  Sliders,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.socialLinks) setSocialLinks(data.socialLinks);
    } catch {
      setStatusMessage({ type: "error", text: "Dështoi ngarkimi i cilësimeve." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSocialLinkChange = (id: string, field: string, value: any) => {
    setSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, socialLinks }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Cilësimet u ruajtën me sukses!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Dështoi ruajtja." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ruajtjes." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-400">Po ngarkohen cilësimet...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00b2fe]" />
            <span className="text-xs font-bold text-[#00b2fe] uppercase tracking-wider font-['Outfit']">
              KONFIGURIMI I PLATFORMËS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Cilësimet & Branding
          </h1>
          <p className="text-xs text-gray-400">
            Përshtatni identitetin vizual, tekstet e ballinës, rrjetet sociale dhe SEO-në e faqes.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold shadow-[0_0_20px_rgba(0,178,254,0.4)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Po ruhen..." : "Ruaj të Gjitha"}</span>
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Branding Section */}
        <div className="surface-card p-6 border border-white/10 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00b2fe]" />
            <span>Identiteti Vizual (Branding)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-3 text-center sm:text-left">
              <div className="relative w-24 h-24 mx-auto sm:mx-0 rounded-full overflow-hidden border-2 border-[#00b2fe] bg-black shadow-lg">
                <Image src="/logo.png" alt="Logo" fill sizes="96px" className="object-cover" />
              </div>
              <span className="text-[10px] text-gray-400 mt-2 block">Logoja Zyrtare</span>
            </div>

            <div className="sm:col-span-9 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Emri i Faqes
                </label>
                <input
                  type="text"
                  value={settings.site_name || ""}
                  onChange={(e) => handleSettingChange("site_name", e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Slogani i Faqes (Tagline)
                </label>
                <input
                  type="text"
                  value={settings.site_tagline || ""}
                  onChange={(e) => handleSettingChange("site_tagline", e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Homepage Hero Section Editor */}
        <div className="surface-card p-6 border border-white/10 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00b2fe]" />
            <span>Ballina & Hero Section</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Titulli Kryesor Hero
              </label>
              <input
                type="text"
                value={settings.hero_title || ""}
                onChange={(e) => handleSettingChange("hero_title", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Përshkrimi Nën Titull
              </label>
              <textarea
                rows={3}
                value={settings.hero_subtitle || ""}
                onChange={(e) => handleSettingChange("hero_subtitle", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Teksti i Butonit Primar
                </label>
                <input
                  type="text"
                  value={settings.hero_cta_text || ""}
                  onChange={(e) => handleSettingChange("hero_cta_text", e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Teksti i Butonit Sekondar
                </label>
                <input
                  type="text"
                  value={settings.hero_secondary_cta_text || ""}
                  onChange={(e) => handleSettingChange("hero_secondary_cta_text", e.target.value)}
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Social Media Channels */}
        <div className="surface-card p-6 border border-white/10 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#00b2fe]" />
            <span>Rrjetet Sociale & Linket</span>
          </h2>

          <div className="space-y-4">
            {socialLinks.map((s) => (
              <div key={s.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-lg bg-white/5">
                <div className="sm:col-span-3">
                  <span className="text-xs font-bold uppercase text-[#00b2fe] font-['Outfit']">
                    {s.label}
                  </span>
                </div>

                <div className="sm:col-span-7">
                  <input
                    type="url"
                    value={s.url}
                    onChange={(e) => handleSocialLinkChange(s.id, "url", e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.isVisible}
                      onChange={(e) => handleSocialLinkChange(s.id, "isVisible", e.target.checked)}
                      className="rounded border-white/20 bg-black text-[#00b2fe]"
                    />
                    <span>Dukshëm</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Contact Details */}
        <div className="surface-card p-6 border border-white/10 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00b2fe]" />
            <span>Të Dhënat e Kontaktit</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Email Zyrtar
              </label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => handleSettingChange("contact_email", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Numër Telefoni / WhatsApp
              </label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) => handleSettingChange("contact_phone", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Vendndodhja
              </label>
              <input
                type="text"
                value={settings.contact_address || ""}
                onChange={(e) => handleSettingChange("contact_address", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. SEO Configuration */}
        <div className="surface-card p-6 border border-white/10 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00b2fe]" />
            <span>Optimizimi për Motorët e Kërkimit (SEO)</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Titulli Kryesor SEO (Meta Title)
              </label>
              <input
                type="text"
                value={settings.seo_title || ""}
                onChange={(e) => handleSettingChange("seo_title", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Përshkrimi SEO (Meta Description)
              </label>
              <textarea
                rows={2}
                value={settings.seo_description || ""}
                onChange={(e) => handleSettingChange("seo_description", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Fjalët Kyçe (Keywords)
              </label>
              <input
                type="text"
                value={settings.seo_keywords || ""}
                onChange={(e) => handleSettingChange("seo_keywords", e.target.value)}
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !py-3 !px-8 text-xs font-bold shadow-[0_0_25px_rgba(0,178,254,0.4)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Po ruhen të gjitha..." : "Ruaj të Gjitha Cilësimet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
