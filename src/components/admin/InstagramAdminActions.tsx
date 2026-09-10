"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, Archive } from "lucide-react";

interface Post {
  id: string;
  category: string;
  status: string;
  isVisible: boolean;
}

export function InstagramAdminActions({ post }: { post: Post }) {
  const [status, setStatus] = useState(post.status);
  const [visible, setVisible] = useState(post.isVisible);
  const [loading, setLoading] = useState(false);

  async function updatePost(updates: { status?: string; isVisible?: boolean }) {
    setLoading(true);
    try {
      const res = await fetch(`/api/instagram-webhook/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, ...updates }),
      });
      if (res.ok) {
        if (updates.status) setStatus(updates.status);
        if (updates.isVisible !== undefined) setVisible(updates.isVisible);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 flex-shrink-0">
      {post.category === "SHITET" && (
        <button
          onClick={() => updatePost({ status: status === "SOLD" ? "FOR_SALE" : "SOLD" })}
          disabled={loading}
          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
            status === "SOLD"
              ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              : "bg-pink-500/20 border-pink-500/40 text-pink-400 hover:bg-pink-500/30"
          }`}
        >
          {status === "SOLD" ? (
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Rishit</span>
          ) : (
            <span className="flex items-center gap-1"><Archive className="w-3 h-3" />Mark Shitur</span>
          )}
        </button>
      )}

      <button
        onClick={() => updatePost({ isVisible: !visible })}
        disabled={loading}
        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
      >
        {visible ? (
          <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" />Fshih</span>
        ) : (
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />Shfaq</span>
        )}
      </button>
    </div>
  );
}
