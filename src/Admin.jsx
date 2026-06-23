import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LayoutDashboard, UploadCloud, FolderOpen, CreditCard, Users,
  Heart, MessageCircle, DollarSign, Trash2, LogOut,
  Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  CheckCircle2, Clock, Image, X, Eye
} from "lucide-react";
const SUPABASE_URL = "https://mzhccgxxbznvinqyvust.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aGNjZ3h4YnpudmlucXl2dXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzkwMTAsImV4cCI6MjA5NzgxNTAxMH0.z-KNumdmNKaXyYYgWGFo1ZIxNMPc31rNvGqvdIlMbFU";

const sb = {
  from: (table) => ({
    select: async (cols = "*") => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=created_at.desc`, {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
      });
      const data = await res.json();
      return { data, error: !res.ok ? data : null };
    },
    insert: async (row) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(row)
      });
      const data = await res.json();
      return { data, error: !res.ok ? data : null };
    },
    delete: async (match) => {
      const [col, val] = Object.entries(match)[0];
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
      });
      return { error: !res.ok ? await res.json() : null };
    },
  })
};

/* ---------------------------------------------------------------
   FONTS — same as main site
--------------------------------------------------------------- */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
  return null;
};

/* ---------------------------------------------------------------
   TOKENS — matches main site
--------------------------------------------------------------- */
const C = {
  bg: "#07080C",
  surface: "#0E1015",
  surfaceHi: "#151820",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.14)",
  white: "white",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  fainter: "rgba(255,255,255,0.12)",
  emerald: "#3DD68C",
  gold: "#E8B23D",
  rose: "#E85D9E",
  violet: "#7C3AED",
  blue: "#2563EB",
  amber: "#F2944D",
  teal: "#38BDB0",
  good: "#3DD68C",
  warn: "#E8B23D",
  bad: "#E85D9E",
};

const ACCENT_COLORS = [C.violet, C.blue, C.emerald, C.bad, C.gold, C.amber, C.teal];

const ADMIN_PASSWORD = "John+2558";
const CLOUDINARY_CLOUD = "mm0gviif";
const CLOUDINARY_PRESET = "oliuwasogo Uploads";

async function uploadToCloudinary(file, folder = "gallery") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", folder);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", Icon: Mic, type: "audio", accent: C.teal },
  { id: "speaks", title: "Sogo Speaks", Icon: Video, type: "video", accent: C.gold },
  { id: "healingpen", title: "The Healing Pen", Icon: BookOpen, type: "book", accent: C.rose },
  { id: "poetry", title: "Poetry", Icon: PenTool, type: "poetry", accent: "#9B82F0" },
  { id: "preaches", title: "Sogo Preaches", Icon: Church, type: "video", accent: C.amber },
  { id: "presence", title: "In His Presence", Icon: Sparkles, type: "video", accent: "#F25C9C" },
  { id: "holyghost", title: "The Holy Ghost in Action", Icon: Hand, type: "video", accent: C.emerald },
];

const DEFAULT_CONTENT = [
  { id: "whispers-1", spaceId: "whispers", title: "On Starting Over (Again)", meta: "24 min · Episode 01" },
  { id: "whispers-2", spaceId: "whispers", title: "The Weight We Don't Talk About", meta: "31 min · Episode 02" },
  { id: "speaks-1", spaceId: "speaks", title: "Sogo Speaks — Vol. 1", meta: "Video · 18 min" },
  { id: "speaks-2", spaceId: "speaks", title: "Sogo Speaks — Vol. 2", meta: "Video · 22 min" },
  { id: "healingpen-1", spaceId: "healingpen", title: "Letters I Never Sent", meta: "142 pages", price: "₦3,500" },
  { id: "healingpen-2", spaceId: "healingpen", title: "Still Standing", meta: "210 pages", price: "₦4,200" },
  { id: "poetry-1", spaceId: "poetry", title: "Unfinished Prayer", meta: "Spoken · 3 min" },
  { id: "poetry-2", spaceId: "poetry", title: "Acoustic: What the River Knows", meta: "Acoustic · 4 min" },
  { id: "preaches-1", spaceId: "preaches", title: "Sogo Preaches — Vol. 1", meta: "Video · 18 min" },
  { id: "preaches-2", spaceId: "preaches", title: "Sogo Preaches — Vol. 2", meta: "Video · 22 min" },
  { id: "presence-1", spaceId: "presence", title: "In His Presence — Vol. 1", meta: "Video · 18 min" },
  { id: "presence-2", spaceId: "presence", title: "In His Presence — Vol. 2", meta: "Video · 22 min" },
  { id: "holyghost-1", spaceId: "holyghost", title: "The Holy Ghost in Action — Vol. 1", meta: "Video · 18 min" },
  { id: "holyghost-2", spaceId: "holyghost", title: "The Holy Ghost in Action — Vol. 2", meta: "Video · 22 min" },
];

const DEMO_PAYMENTS = [
  { id: 1, buyer: "Tobi A.", item: "Letters I Never Sent (PDF)", amount: "₦3,500", date: "Jun 18, 2026", status: "paid" },
  { id: 2, buyer: "Grace O.", item: "Still Standing (PDF)", amount: "₦4,200", date: "Jun 15, 2026", status: "paid" },
  { id: 3, buyer: "David E.", item: "Letters I Never Sent (PDF)", amount: "₦3,500", date: "Jun 10, 2026", status: "pending" },
];

const DEMO_AUDIENCE = [
  { name: "Tobi A.", email: "tobi***@gmail.com", joined: "Jun 18, 2026" },
  { name: "Grace O.", email: "grace***@gmail.com", joined: "Jun 15, 2026" },
  { name: "David E.", email: "david***@gmail.com", joined: "Jun 10, 2026" },
  { name: "Amaka N.", email: "amaka***@gmail.com", joined: "Jun 3, 2026" },
];

/* ---------------------------------------------------------------
   STORAGE
--------------------------------------------------------------- */
function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

/* ---------------------------------------------------------------
   LOGIN
--------------------------------------------------------------- */
const AdminLogin = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      onSuccess();
      return;
    }
    setError(true);
    setTimeout(() => setError(false), 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo / header */}
        <div className="mb-10 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${C.violet}22`, border: `1px solid ${C.violet}33` }}
          >
            <Lock size={20} color={C.violet} />
          </div>
          <h1 className="font-fraunces font-bold text-2xl mb-1" style={{ color: C.white }}>
            Admin Login
          </h1>
          <p className="font-body text-[13px]" style={{ color: C.faint }}>
            Enter your password to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              autoFocus
              className="w-full bg-transparent outline-none font-body text-[14px] px-4 py-3.5 rounded-2xl pr-11"
              style={{
                border: `1px solid ${error ? C.bad : C.border}`,
                color: C.white,
                background: C.surface,
                transition: "border-color 0.2s",
              }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: C.faint, background: "none", border: "none", cursor: "pointer" }}
            >
              <Eye size={15} />
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-[12.5px]"
              style={{ color: C.bad }}
            >
              Incorrect password. Try again.
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-body text-[14px] font-semibold"
            style={{
              background: `linear-gradient(135deg, ${C.violet}, ${C.blue})`,
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </motion.div>
    </div>
  );
};
/* ---------------------------------------------------------------
   STAT CARD
--------------------------------------------------------------- */
const StatCard = ({ label, value, Icon, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
    className="p-5 rounded-2xl"
    style={{ background: C.surface, border: `1px solid ${C.border}` }}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="font-body text-[11px] tracking-[0.15em] uppercase" style={{ color: C.faint }}>{label}</span>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
        <Icon size={14} color={accent} />
      </div>
    </div>
    <p className="font-fraunces font-black text-3xl" style={{ color: C.white }}>{value}</p>
  </motion.div>
);

/* ---------------------------------------------------------------
   OVERVIEW
--------------------------------------------------------------- */
const Overview = ({ allContent, engagement }) => {
  const totalLikes = Object.values(engagement).reduce((s, e) => s + (e?.likes || 0), 0);
  const totalComments = Object.values(engagement).reduce((s, e) => s + (e?.comments?.length || 0), 0);
  const revenue = DEMO_PAYMENTS.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount.replace(/[₦,]/g, "")), 0);

  return (
    <div>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Overview</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>A snapshot of everything happening across your world.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Likes" value={totalLikes} Icon={Heart} accent={C.rose} delay={0} />
        <StatCard label="Comments" value={totalComments} Icon={MessageCircle} accent={C.violet} delay={0.06} />
        <StatCard label="Audience" value={DEMO_AUDIENCE.length} Icon={Users} accent={C.teal} delay={0.12} />
        <StatCard label="Revenue" value={`₦${revenue.toLocaleString()}`} Icon={DollarSign} accent={C.gold} delay={0.18} />
      </div>

      <h3 className="font-body text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: C.faint }}>By Space</h3>
      <div className="space-y-1">
        {SPACES.map((s, i) => {
          const items = allContent.filter(c => c.spaceId === s.id);
          const likes = items.reduce((sum, it) => sum + (engagement[it.id]?.likes || 0), 0);
          const comments = items.reduce((sum, it) => sum + (engagement[it.id]?.comments?.length || 0), 0);
          return (
            <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between py-3.5 px-4 rounded-xl"
              style={{ background: i % 2 === 0 ? "transparent" : C.fainter }}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.accent}22` }}>
                  <s.Icon size={13} color={s.accent} />
                </div>
                <span className="font-body text-[13px]" style={{ color: C.dim }}>{s.title}</span>
              </div>
              <div className="flex items-center gap-5 font-body text-[12px]" style={{ color: C.faint }}>
                <span className="flex items-center gap-1"><Heart size={12} /> {likes}</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} /> {comments}</span>
                <span>{items.length} uploads</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   PHOTOS — new section to manage gallery photos
--------------------------------------------------------------- */
const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    sb.from("photos").select("*").then(({ data }) => {
      if (data) setPhotos(data);
    });
  }, []);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const { url, publicId } = await uploadToCloudinary(files[i], "gallery");
        const { data } = await sb.from("photos").insert({
          url,
          public_id: publicId,
          name: files[i].name,
        });
        if (data) setPhotos(prev => [...prev, data[0]]);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  const deletePhoto = async (id) => {
    await sb.from("photos").delete({ id });
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Gallery Photos</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
        Upload your photos — they go straight to Cloudinary and appear in the homepage gallery.
      </p>

      <label
        className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl cursor-pointer mb-7"
        style={{ border: `2px dashed ${C.border}`, background: C.fainter }}
        onDragOver={e => e.preventDefault()}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${C.violet}22` }}>
          <Image size={20} color={C.violet} />
        </div>
        <div className="text-center">
          <p className="font-body text-[14px] font-medium" style={{ color: C.dim }}>
            {uploading ? "Uploading..." : "Click to upload photos"}
          </p>
          <p className="font-body text-[12px] mt-1" style={{ color: C.faint }}>JPG, PNG, WEBP — multiple at once</p>
        </div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>

      {photos.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-body text-[13px]" style={{ color: C.faint }}>No photos yet — upload your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="relative group rounded-2xl overflow-hidden"
              style={{ aspectRatio: "3/4", background: C.surface }}
            >
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                <button onClick={() => deletePhoto(photo.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${C.bad}22`, border: `1px solid ${C.bad}44` }}>
                  <Trash2 size={14} color={C.bad} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p className="font-body text-[9.5px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{photo.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
/* ---------------------------------------------------------------
   UPLOAD CONTENT
--------------------------------------------------------------- */
const UploadContent = ({ onUpload }) => {
  const [spaceId, setSpaceId] = useState(SPACES[0].id);
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [price, setPrice] = useState("");
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const space = SPACES.find(s => s.id === spaceId);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem = { id: `${spaceId}-custom-${Date.now()}`, spaceId, title: title.trim(), meta: meta.trim() || "New content", price: space.type === "book" ? price : undefined, fileName: fileName || "No file attached yet" };
    await onUpload(newItem);
    setTitle(""); setMeta(""); setPrice(""); setFileName("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Upload Content</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
        Add a new piece to one of your spaces. Real file storage connects when we deploy.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Space</label>
          <select value={spaceId} onChange={e => setSpaceId(e.target.value)} className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl appearance-none" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }}>
            {SPACES.map(s => <option key={s.id} value={s.id} style={{ background: C.surface }}>{s.title}</option>)}
          </select>
        </div>

        {[["Title", title, setTitle, "e.g. Episode 03 — Finding Peace"],
          ["Description / Duration", meta, setMeta, "e.g. 24 min · Episode 03"]
        ].map(([label, val, setter, placeholder]) => (
          <div key={label}>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>{label}</label>
            <input value={val} onChange={e => setter(e.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
          </div>
        ))}

        {space.type === "book" && (
          <div>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. ₦3,500" className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
          </div>
        )}

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>File</label>
          <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl cursor-pointer" style={{ border: `2px dashed ${C.border}`, background: C.fainter }}>
            <UploadCloud size={20} color={space.accent} />
            <span className="font-body text-[12.5px]" style={{ color: C.dim }}>{fileName || `Choose a ${space.type === "audio" ? "audio" : space.type === "book" ? "PDF" : "video"} file`}</span>
            <input type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
          </label>
          <p className="font-body text-[10.5px] mt-2" style={{ color: C.faint }}>Real upload connects to Cloudinary at deploy.</p>
        </div>

        <button type="submit" className="px-7 py-3.5 rounded-2xl font-body text-[13.5px] font-semibold" style={{ background: `linear-gradient(135deg, ${space.accent}, ${ACCENT_COLORS[(ACCENT_COLORS.indexOf(space.accent) + 2) % ACCENT_COLORS.length] || C.blue})`, color: "white" }}>
          Save Content
        </button>
        {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-[12.5px]" style={{ color: C.good }}>✓ Saved — visible in Manage Content.</motion.p>}
      </form>
    </div>
  );
};

/* ---------------------------------------------------------------
   MANAGE CONTENT
--------------------------------------------------------------- */
const ManageContent = ({ allContent, engagement, onDelete }) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allContent : allContent.filter(c => c.spaceId === filter);

  return (
    <div>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Manage Content</h2>
      <p className="font-body text-[13px] mb-6" style={{ color: C.faint }}>Everything you've published, with live engagement numbers.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")} className="px-3.5 py-1.5 rounded-full font-body text-[12px]" style={{ border: `1px solid ${filter === "all" ? C.violet : C.border}`, color: filter === "all" ? C.violet : C.faint, background: filter === "all" ? `${C.violet}14` : "transparent" }}>All</button>
        {SPACES.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} className="px-3.5 py-1.5 rounded-full font-body text-[12px]" style={{ border: `1px solid ${filter === s.id ? s.accent : C.border}`, color: filter === s.id ? s.accent : C.faint, background: filter === s.id ? `${s.accent}14` : "transparent" }}>
            {s.title}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map((item, i) => {
          const e = engagement[item.id] || { likes: 0, comments: [] };
          const space = SPACES.find(s => s.id === item.spaceId);
          const isCustom = item.id.includes("-custom-");
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between py-4 px-4 rounded-xl"
              style={{ background: i % 2 === 0 ? "transparent" : C.fainter }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${space.accent}22` }}>
                  <space.Icon size={13} color={space.accent} />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-[13.5px] truncate" style={{ color: C.white }}>{item.title}</p>
                  <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{space.title} · {item.meta}{item.price ? ` · ${item.price}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden sm:flex items-center gap-1 font-body text-[12px]" style={{ color: C.faint }}><Heart size={12} /> {e.likes}</span>
                <span className="hidden sm:flex items-center gap-1 font-body text-[12px]" style={{ color: C.faint }}><MessageCircle size={12} /> {e.comments.length}</span>
                {isCustom && (
                  <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${C.bad}14` }}>
                    <Trash2 size={13} color={C.bad} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   PAYMENTS
--------------------------------------------------------------- */
const Payments = () => {
  const revenue = DEMO_PAYMENTS.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount.replace(/[₦,]/g, "")), 0);
  return (
    <div>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Payments</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>Demo data — real transactions appear once Paystack is connected.</p>

      <div className="p-6 rounded-2xl mb-7" style={{ background: `linear-gradient(135deg, ${C.violet}22, ${C.blue}14)`, border: `1px solid ${C.violet}33` }}>
        <p className="font-body text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: C.faint }}>Total Revenue</p>
        <p className="font-fraunces font-black text-4xl" style={{ color: C.white }}>₦{revenue.toLocaleString()}</p>
      </div>

      <div className="space-y-1">
        {DEMO_PAYMENTS.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="flex items-center justify-between py-4 px-4 rounded-xl"
            style={{ background: i % 2 === 0 ? "transparent" : C.fainter }}
          >
            <div>
              <p className="font-body text-[13.5px]" style={{ color: C.white }}>{p.buyer}</p>
              <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{p.item} · {p.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-fraunces font-bold text-[15px]" style={{ color: C.white }}>{p.amount}</span>
              <span className="flex items-center gap-1.5 font-body text-[11.5px] px-3 py-1 rounded-full" style={{ color: p.status === "paid" ? C.good : C.warn, background: p.status === "paid" ? `${C.good}14` : `${C.warn}14`, border: `1px solid ${p.status === "paid" ? C.good : C.warn}33` }}>
                {p.status === "paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                {p.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   AUDIENCE
--------------------------------------------------------------- */
const Audience = () => (
  <div>
    <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Audience</h2>
    <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>Demo data — real list populates once Supabase is connected.</p>
    <div className="space-y-1">
      {DEMO_AUDIENCE.map((u, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="flex items-center justify-between py-4 px-4 rounded-xl"
          style={{ background: i % 2 === 0 ? "transparent" : C.fainter }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-fraunces font-bold text-[13px]" style={{ background: `${ACCENT_COLORS[i % ACCENT_COLORS.length]}22`, color: ACCENT_COLORS[i % ACCENT_COLORS.length] }}>
              {u.name[0]}
            </div>
            <div>
              <p className="font-body text-[13.5px]" style={{ color: C.white }}>{u.name}</p>
              <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{u.email}</p>
            </div>
          </div>
          <span className="font-body text-[12px]" style={{ color: C.faint }}>Joined {u.joined}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "photos", label: "Gallery Photos", Icon: Image },
  { id: "upload", label: "Upload Content", Icon: UploadCloud },
  { id: "manage", label: "Manage Content", Icon: FolderOpen },
  { id: "payments", label: "Payments", Icon: CreditCard },
  { id: "audience", label: "Audience", Icon: Users },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [booted, setBooted] = useState(false);
  const [tab, setTab] = useState("overview");
  const [customContent, setCustomContent] = useState([]);
  const [engagement, setEngagement] = useState({});

  useEffect(() => {
    const session = lsGet("admin-session");
    if (session === "true") setAuthed(true);
    const stored = lsGet("admin_content");
    if (stored) setCustomContent(JSON.parse(stored));
    setBooted(true);
  }, []);

  const allContent = [...DEFAULT_CONTENT, ...customContent];

  useEffect(() => {
    if (!authed) return;
    const results = {};
    allContent.forEach(item => {
      const raw = lsGet(`engage_${item.id}`);
      results[item.id] = raw ? JSON.parse(raw) : { likes: 0, comments: [] };
    });
    setEngagement(results);
  }, [authed, customContent.length]);

  const handleLogin = () => { setAuthed(true); lsSet("admin-session", "true"); };
  const handleLogout = () => { setAuthed(false); lsSet("admin-session", ""); };

  const handleUpload = useCallback(async (item) => {
    setCustomContent(prev => {
      const next = [...prev, item];
      lsSet("admin_content", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleDelete = useCallback(async (id) => {
    setCustomContent(prev => {
      const next = prev.filter(c => c.id !== id);
      lsSet("admin_content", JSON.stringify(next));
      return next;
    });
  }, []);

  if (!booted) return <div style={{ background: C.bg, minHeight: "100vh" }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <FontLoader />
      <style>{`
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(124,58,237,0.4); }
      `}</style>

      {!authed ? (
        <AdminLogin onSuccess={handleLogin} />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* SIDEBAR */}
          <aside className="md:w-[220px] shrink-0 md:min-h-screen p-5 flex flex-col" style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}>
            <div className="mb-8">
              <p className="font-fraunces font-bold text-[17px]" style={{ color: C.white }}>Oluwasogo Dosunmu</p>
              <p className="font-body text-[10.5px] tracking-[0.2em] uppercase mt-1" style={{ color: C.violet }}>Admin Panel</p>
            </div>

            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible flex-1">
              {NAV_ITEMS.map(n => (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-body text-[13px] whitespace-nowrap transition-all"
                  style={{
                    color: tab === n.id ? C.white : C.faint,
                    background: tab === n.id ? `${C.violet}22` : "transparent",
                    border: tab === n.id ? `1px solid ${C.violet}33` : "1px solid transparent",
                  }}
                >
                  <n.Icon size={15} color={tab === n.id ? C.violet : C.faint} />
                  {n.label}
                </button>
              ))}
            </nav>

            <button onClick={handleLogout} className="flex items-center gap-2 font-body text-[12px] mt-6 px-3 py-2.5 rounded-xl" style={{ color: C.faint, background: "transparent" }}>
              <LogOut size={13} /> Log out
            </button>
          </aside>

          {/* MAIN */}
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                {tab === "overview" && <Overview allContent={allContent} engagement={engagement} />}
                {tab === "photos" && <Photos />}
                {tab === "upload" && <UploadContent onUpload={handleUpload} />}
                {tab === "manage" && <ManageContent allContent={allContent} engagement={engagement} onDelete={handleDelete} />}
                {tab === "payments" && <Payments />}
                {tab === "audience" && <Audience />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
