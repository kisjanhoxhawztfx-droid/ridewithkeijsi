"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kredencialet janë të pasakta.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Ndodhi një gabim gjatë lidhjes me serverin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00b2fe]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#00b2fe] bg-black shadow-[0_0_30px_rgba(0,178,254,0.4)]">
            <Image src="/logo.png" alt="Ride with Keijsi" fill sizes="80px" className="object-cover" priority />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wider font-['Outfit'] uppercase">
              RIDE WITH <span className="text-[#00b2fe]">KEIJSI</span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-0.5">
              Hyrja në Panelin e Administrimit
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="surface-card p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-['Outfit']">
                Përdoruesi ose Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-['Outfit']">
                Fjalëkalimi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 text-xs font-bold mt-2 shadow-[0_0_20px_rgba(0,178,254,0.4)] disabled:opacity-50"
            >
              {loading ? (
                <span>Po verifikohet...</span>
              ) : (
                <>
                  <span>Kyçu në Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00b2fe]" />
              Sistem i sigurt i autorizuar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
