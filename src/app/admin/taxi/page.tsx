"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Car,
  Phone,
  Star,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { InstagramIcon, WhatsAppIcon, GoogleIcon } from "@/components/ui/Icons";

interface TaxiPost {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  thumbnailUrl: string;
  caption: string;
  isFeatured: boolean;
  isVisible: boolean;
  publishedAt: string;
}

interface TaxiReview {
  id: string;
  googleReviewId?: string | null;
  authorName: string;
  authorPhotoUrl?: string | null;
  rating: number;
  text: string;
  relativeTimeDescription?: string | null;
  source: string;
  isFeatured: boolean;
  isVisible: boolean;
  publishedAt: string;
}

export default function AdminTaxiPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "posts" | "reviews">("settings");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("taxi_keijsi");
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState("");
  const [description, setDescription] = useState("");

  // Posts and Reviews state
  const [posts, setPosts] = useState<TaxiPost[]>([]);
  const [reviews, setReviews] = useState<TaxiReview[]>([]);

  // Modals state
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New post state
  const [newPostPermalink, setNewPostPermalink] = useState("");
  const [newPostThumbnail, setNewPostThumbnail] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostFeatured, setNewPostFeatured] = useState(false);

  // New review state
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewPhoto, setNewReviewPhoto] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("5");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewTime, setNewReviewTime] = useState("para pak ditësh");
  const [newReviewFeatured, setNewReviewFeatured] = useState(false);

  const fetchData = async () => {
    try {
      const [settingsRes, postsRes, reviewsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/taxi/posts?admin=true"),
        fetch("/api/taxi/reviews?admin=true"),
      ]);

      const settingsData = await settingsRes.json();
      const postsData = await postsRes.json();
      const reviewsData = await reviewsRes.json();

      if (settingsData.settings) {
        setPhone(settingsData.settings.taxi_phone || "");
        setWhatsapp(settingsData.settings.taxi_whatsapp || "");
        setInstagram(settingsData.settings.taxi_instagram || "taxi_keijsi");
        setGoogleBusinessUrl(settingsData.settings.taxi_google_business_url || "");
        setDescription(settingsData.settings.taxi_description || "");
      }

      if (postsData.posts) setPosts(postsData.posts);
      if (reviewsData.reviews) setReviews(reviewsData.reviews);
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ngarkimit të të dhënave." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            taxi_phone: phone,
            taxi_whatsapp: whatsapp,
            taxi_instagram: instagram,
            taxi_google_business_url: googleBusinessUrl,
            taxi_description: description,
          },
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Cilësimet e Taxi Keijsi u ruajtën me sukses!" });
      } else {
        setStatusMessage({ type: "error", text: "Dështoi ruajtja e cilësimeve." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Ndodhi një gabim gjatë ruajtjes." });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/taxi/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permalink: newPostPermalink,
          thumbnailUrl: newPostThumbnail,
          caption: newPostCaption,
          isFeatured: newPostFeatured,
        }),
      });

      if (res.ok) {
        setShowAddPostModal(false);
        setNewPostPermalink("");
        setNewPostThumbnail("");
        setNewPostCaption("");
        setStatusMessage({ type: "success", text: "Postimi i @taxi_keijsi u shtua me sukses!" });
        await fetchData();
      } else {
        alert("Dështoi shtimi i postimit.");
      }
    } catch {
      alert("Ndodhi një gabim gjatë shtimit.");
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/taxi/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: newReviewAuthor,
          authorPhotoUrl: newReviewPhoto,
          rating: parseInt(newReviewRating, 10),
          text: newReviewText,
          relativeTimeDescription: newReviewTime,
          isFeatured: newReviewFeatured,
        }),
      });

      if (res.ok) {
        setShowAddReviewModal(false);
        setNewReviewAuthor("");
        setNewReviewPhoto("");
        setNewReviewText("");
        setStatusMessage({ type: "success", text: "Vlerësimi i Google Business u shtua me sukses!" });
        await fetchData();
      } else {
        alert("Dështoi shtimi i vlerësimit.");
      }
    } catch {
      alert("Ndodhi një gabim gjatë shtimit.");
    }
  };

  const handleTogglePostVisibility = async (id: string, current: boolean) => {
    try {
      await fetch("/api/taxi/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      setPosts(posts.map((p) => (p.id === id ? { ...p, isVisible: !current } : p)));
    } catch {
      alert("Nuk mund të ndryshohej dukshmëria.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë postim?")) return;
    try {
      await fetch(`/api/taxi/posts?id=${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p.id !== id));
      setStatusMessage({ type: "success", text: "Postimi u fshi." });
    } catch {
      alert("Dështoi fshirja.");
    }
  };

  const handleToggleReviewVisibility = async (id: string, current: boolean) => {
    try {
      await fetch("/api/taxi/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      setReviews(reviews.map((r) => (r.id === id ? { ...r, isVisible: !current } : r)));
    } catch {
      alert("Nuk mund të ndryshohej dukshmëria.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë vlerësim?")) return;
    try {
      await fetch(`/api/taxi/reviews?id=${id}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r.id !== id));
      setStatusMessage({ type: "success", text: "Vlerësimi u fshi." });
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
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-['Outfit']">
              MENAXHIMI I SHËRBIMIT TË TAKSISË
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Taxi Keijsi
          </h1>
          <p className="text-xs text-gray-400">
            Menaxhoni numrat e kontaktit (Telefon & WhatsApp), postimet nga Instagram @taxi_keijsi dhe recensionet e Google Business.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/taxi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <span>Shiko Faqen Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00b2fe]" />
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
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-[#00b2fe] text-black shadow-[0_0_15px_rgba(0,178,254,0.4)]"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          ⚙️ Cilësimet & Numrat e Kontaktit
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "posts"
              ? "bg-[#00b2fe] text-black shadow-[0_0_15px_rgba(0,178,254,0.4)]"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          📸 Postimet @taxi_keijsi ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "reviews"
              ? "bg-[#00b2fe] text-black shadow-[0_0_15px_rgba(0,178,254,0.4)]"
              : "bg-white/5 text-gray-300 hover:text-white"
          }`}
        >
          ⭐ Google Business Reviews ({reviews.length})
        </button>
      </div>

      {/* TAB 1: Settings Form */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="surface-card p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00b2fe]" />
                <span>Numri i Telefonit për Telefonata</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+355697777799"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Numri që thirret kur klienti shtyp &quot;Telefono Tani&quot;.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 text-green-400" />
                <span>Numri i WhatsApp për Porosi</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+355697777799"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Numri ndërkombëtar ku hapet biseda e WhatsApp.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Llogaria e Instagramit (@username)</span>
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="taxi_keijsi"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit'] flex items-center gap-1.5">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Linku i Google Business / Google Maps</span>
              </label>
              <input
                type="url"
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=Taxi+Keijsi"
                className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Linku ku dërgohen klientët kur shtypin &quot;Lini një Review në Google&quot;.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase font-['Outfit']">
              Përshkrimi i Shërbimit të Taksisë
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shërbim taksie i shpejtë, komod dhe profesional në Tiranë dhe në të gjithë Shqipërinë..."
              className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="btn-primary text-xs font-bold !py-2.5 !px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Po ruhet..." : "Ruaj Cilësimet"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Instagram Posts from @taxi_keijsi */}
      {activeTab === "posts" && (
        <div className="surface-card border border-white/10 overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Postimet e Veçanta nga @taxi_keijsi
              </h3>
              <p className="text-xs text-gray-400">
                Këto postime shfaqen vetëm në seksionin e Taxi Keijsi dhe jo te Motorrat.
              </p>
            </div>

            <button
              onClick={() => setShowAddPostModal(true)}
              className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Postim të Ri</span>
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Nuk ka ende postime për Taxi Keijsi. Shtoni një postim me butonin lart.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-20 aspect-[4/3] rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                      <Image src={post.thumbnailUrl} alt="Post Thumbnail" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">@taxi_keijsi</span>
                        {!post.isVisible && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
                            I FSHEHUR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2">{post.caption}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePostVisibility(post.id, post.isVisible)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      title={post.isVisible ? "Fshih" : "Bëje të dukshëm"}
                    >
                      {post.isVisible ? <Eye className="w-4 h-4 text-[#00b2fe]" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-pink-400 hover:text-pink-300"
                      title="Shiko në Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeletePost(post.id)}
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

      {/* TAB 3: Google Business Reviews */}
      {activeTab === "reviews" && (
        <div className="surface-card border border-white/10 overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Recensionet e Google Business
              </h3>
              <p className="text-xs text-gray-400">
                Vlerësimet dhe opinionet e klientëve që shfaqen te faqja e Taxi Keijsi.
              </p>
            </div>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Vlerësim Manual</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Nuk ka ende vlerësime të shtuara.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-['Outfit']">{rev.authorName}</span>
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">({rev.relativeTimeDescription || "Google"})</span>
                      {!rev.isVisible && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
                          I FSHEHUR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 italic">&ldquo;{rev.text}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReviewVisibility(rev.id, rev.isVisible)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      title={rev.isVisible ? "Fshih" : "Bëje të dukshëm"}
                    >
                      {rev.isVisible ? <Eye className="w-4 h-4 text-[#00b2fe]" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
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

      {/* Modal: Add Taxi Post */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Shto Postim të Ri nga @taxi_keijsi
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Linku i Postimit në Instagram *
                </label>
                <input
                  type="url"
                  required
                  value={newPostPermalink}
                  onChange={(e) => setNewPostPermalink(e.target.value)}
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
                  value={newPostThumbnail}
                  onChange={(e) => setNewPostThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/... ose linku i fotos"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Përshkrimi / Caption nga Instagrami
                </label>
                <textarea
                  rows={3}
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  placeholder="Detaje të shërbimit të taksisë, destinacionet..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newPostFeatured"
                  checked={newPostFeatured}
                  onChange={(e) => setNewPostFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black text-[#00b2fe]"
                />
                <label htmlFor="newPostFeatured" className="text-xs text-gray-300">
                  Vendose si postim të zgjedhur
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(false)}
                  className="btn-secondary !py-2 text-xs"
                >
                  Anulo
                </button>
                <button type="submit" className="btn-primary !py-2 text-xs font-bold">
                  Ruaj Postimin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Google Review */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card max-w-lg w-full p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Shto Vlerësim të Google Business
            </h3>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Emri i Klientit *
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="p.sh. Alban Berisha"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Vlerësimi me Yje (1 - 5) *
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(e.target.value)}
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Yje)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Yje)</option>
                    <option value="3">⭐⭐⭐ (3 Yje)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                    Koha Relative
                  </label>
                  <input
                    type="text"
                    value={newReviewTime}
                    onChange={(e) => setNewReviewTime(e.target.value)}
                    placeholder="p.sh. para 2 ditësh"
                    className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Fotoja e Klientit (Opsionale URL)
                </label>
                <input
                  type="url"
                  value={newReviewPhoto}
                  onChange={(e) => setNewReviewPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                  Teksti i Recensionit *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Përshkruani përvojën e klientit me Taxi Keijsi..."
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newReviewFeatured"
                  checked={newReviewFeatured}
                  onChange={(e) => setNewReviewFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black text-[#00b2fe]"
                />
                <label htmlFor="newReviewFeatured" className="text-xs text-gray-300">
                  Vendose si vlerësim të zgjedhur në ballinë
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="btn-secondary !py-2 text-xs"
                >
                  Anulo
                </button>
                <button type="submit" className="btn-primary !py-2 text-xs font-bold">
                  Ruaj Vlerësimin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
