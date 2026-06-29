import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LayoutDashboard, UploadCloud, FolderOpen, CreditCard, Users,
  Heart, MessageCircle, DollarSign, Trash2, LogOut,
  Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  CheckCircle2, Clock, Image, X, Eye, Edit, Plus
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mzhccgxxbznvinqyvust.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aGNjZ3h4YnpudmlucXl2dXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzkwMTAsImV4cCI6MjA5NzgxNTAxMH0.z-KNumdmNKaXyYYgWGFo1ZIxNMPc31rNvGqvdIlMbFU";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ---------------------------------------------------------------
   FONTS
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
   TOKENS
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
  
  // Detect if it's a video
  const isVideo = file.type.startsWith('video/');
  const uploadType = isVideo ? 'video' : 'auto';
  
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${uploadType}/upload`,
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

const DEFAULT_CONTENT = [];
const DEMO_PAYMENTS = [];
const DEMO_AUDIENCE = [];

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
   PHOTOS
--------------------------------------------------------------- */
const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const { data, error } = await sb
          .from("photos")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error loading photos:", error);
          return;
        }
        
        if (data) {
          setPhotos(data);
        }
      } catch (err) {
        console.error("Failed to load photos:", err);
      }
    };
    
    loadPhotos();
  }, []);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const { url, publicId } = await uploadToCloudinary(files[i], "gallery");
        const { data, error } = await sb
          .from("photos")
          .insert({
            url: url,
            public_id: publicId,
            name: files[i].name,
          })
          .select();
        
        if (error) {
          console.error("Supabase error:", error);
          continue;
        }
        
        if (data && data.length > 0) {
          setPhotos(prev => [...prev, data[0]]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  const deletePhoto = async (id) => {
    try {
      const { error } = await sb
        .from("photos")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Delete error:", error);
        return;
      }
      
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
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
   UPLOAD CONTENT - WITH AUDIO & VIDEO FILE UPLOAD
--------------------------------------------------------------- */
const UploadContent = ({ onUpload }) => {
  const [spaceId, setSpaceId] = useState(SPACES[0].id);
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [price, setPrice] = useState("");
  const [blurb, setBlurb] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadMethod, setUploadMethod] = useState("cloudinary");
  const [driveLink, setDriveLink] = useState("");
  const space = SPACES.find(s => s.id === spaceId);

  // 🔥 Handle Google Drive upload
  const handleDriveUpload = () => {
    if (!driveLink.trim()) {
      setError("Please paste a Google Drive link");
      return;
    }
    
    let directLink = driveLink.trim();
    const match = driveLink.match(/\/d\/([^\/]+)/);
    if (match) {
      const fileId = match[1];
      directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    } else if (driveLink.includes('drive.google.com')) {
      setError("Could not extract file ID. Make sure you're using the correct share link.");
      return;
    }
    
    setFileUrl(directLink);
    setFileName("Google Drive File");
    setError("");
    alert("✅ Google Drive file linked successfully!");
  };

  // 🔥 Handle file upload (AUDIO, VIDEO, PDF, IMAGES)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    
    try {
      // Determine resource type based on file type
      const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|avi|mkv)$/i);
      const isAudio = file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|aac|flac|m4a|ogg)$/i);
      const isImage = file.type.startsWith('image/');
      
      let uploadUrl;
      let resourceType = 'auto';
      
      if (isPDF) {
        uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/raw/upload`;
        resourceType = 'raw';
      } else if (isVideo) {
        uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`;
        resourceType = 'video';
      } else if (isAudio) {
        uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`;
        resourceType = 'video'; // Cloudinary handles audio as video/upload
      } else {
        uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`;
        resourceType = 'image';
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);
      formData.append("folder", "content");
      
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }
      
      const data = await res.json();
      console.log("✅ File uploaded:", data.secure_url);
      
      // 🔥 Set the file URL based on file type
      setFileUrl(data.secure_url);
      
      // If it's audio, also set it as audio_url for the space
      if (isAudio) {
        setFileUrl(data.secure_url);
      }
      
      setError("");
    } catch (err) {
      console.error("File upload error:", err);
      setError("File upload failed: " + err.message);
    }
  };

  // 🔥 Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const { url } = await uploadToCloudinary(file, "content_images");
      setImageUrl(url);
      setError("");
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Image upload failed: " + err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("📤 Saving content with file_url:", fileUrl);
    
    try {
      const { data, error } = await sb
        .from("content")
        .insert({
          space_id: spaceId,
          title: title.trim(),
          meta: meta.trim() || "New content",
          price: space.type === "book" ? price : null,
          blurb: space.type === "book" ? blurb : null,
          video_url: (space.type === "video" || space.type === "poetry") ? fileUrl : null,
          audio_url: space.type === "audio" ? fileUrl : null,
          file_url: space.type === "book" ? fileUrl : null,
          image_url: imageUrl || null,
        })
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        return;
      }
      
      if (data) {
        console.log("✅ Content saved:", data);
        setSuccess(true);
        setTitle("");
        setMeta("");
        setPrice("");
        setBlurb("");
        setVideoUrl("");
        setImageUrl("");
        setFileUrl("");
        setFileName("");
        setDriveLink("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Upload Content</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
        Add new content to your spaces. Supports audio, video, images, and PDFs.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p className="font-body text-[13px]" style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Space</label>
          <select value={spaceId} onChange={e => setSpaceId(e.target.value)} className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl appearance-none" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }}>
            {SPACES.map(s => <option key={s.id} value={s.id} style={{ background: C.surface }}>{s.title}</option>)}
          </select>
        </div>

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Episode 03 — Finding Peace" className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} required />
        </div>

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Description / Duration</label>
          <input value={meta} onChange={e => setMeta(e.target.value)} placeholder="e.g. 24 min · Episode 03" className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
        </div>

        {space.type === "book" && (
          <>
            <div>
              <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Price</label>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. ₦3,500" className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
            </div>
            <div>
              <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Blurb / Description</label>
              <textarea value={blurb} onChange={e => setBlurb(e.target.value)} rows="3" placeholder="A quiet collection on grief, faith, and the words we keep folded in our pockets." className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl resize-none" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
            </div>
          </>
        )}

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-transparent outline-none font-body text-[13.5px] px-4 py-3.5 rounded-2xl" style={{ border: `1px solid ${C.border}`, color: C.white, background: C.surface }} />
          {imageUrl && <p className="font-body text-[11px] mt-1" style={{ color: C.good }}>✅ Image uploaded</p>}
        </div>

        {/* 🔥 FILE UPLOAD - SUPPORTS AUDIO, VIDEO, PDF */}
        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.faint }}>
            {space.type === "audio" ? "🎵 Upload Audio File" :
             space.type === "video" ? "🎬 Upload Video File" :
             space.type === "book" ? "📄 Upload PDF" :
             "📁 Upload File"}
          </label>
          
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUploadMethod("cloudinary")}
              className={`px-3 py-1.5 rounded-xl font-body text-[11px] transition-all ${uploadMethod === "cloudinary" ? "bg-white/10" : ""}`}
              style={{ border: `1px solid ${uploadMethod === "cloudinary" ? C.violet : C.border}`, color: uploadMethod === "cloudinary" ? C.violet : C.faint }}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod("googledrive")}
              className={`px-3 py-1.5 rounded-xl font-body text-[11px] transition-all ${uploadMethod === "googledrive" ? "bg-white/10" : ""}`}
              style={{ border: `1px solid ${uploadMethod === "googledrive" ? C.violet : C.border}`, color: uploadMethod === "googledrive" ? C.violet : C.faint }}
            >
              📁 Google Drive
            </button>
          </div>

          {uploadMethod === "cloudinary" && (
            <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl cursor-pointer" style={{ border: `2px dashed ${C.border}`, background: C.fainter }}>
              <UploadCloud size={20} color={space.accent} />
              <span className="font-body text-[12.5px]" style={{ color: C.dim }}>
                {fileName || `Choose a ${space.type === "audio" ? "audio" : space.type === "book" ? "PDF" : "video"} file`}
              </span>
              <p className="font-body text-[10px]" style={{ color: C.faint }}>
                {space.type === "audio" ? "MP3, WAV, AAC, FLAC, M4A" :
                 space.type === "video" ? "MP4, WebM, MOV, AVI" :
                 space.type === "book" ? "PDF" :
                 "Any file type"}
              </p>
              <input type="file" className="hidden" onChange={handleFileUpload} accept={
                space.type === "audio" ? "audio/*" :
                space.type === "video" ? "video/*" :
                space.type === "book" ? ".pdf" :
                "*/*"
              } />
            </label>
          )}

          {uploadMethod === "googledrive" && (
            <div className="p-4 rounded-2xl" style={{ background: C.fainter, border: `1px solid ${C.border}` }}>
              <p className="font-body text-[12px]" style={{ color: C.dim }}>📌 Paste your Google Drive share link</p>
              <p className="font-body text-[10px] mt-1" style={{ color: C.faint }}>Example: https://drive.google.com/file/d/abc123/view</p>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="Paste Google Drive link..."
                  className="flex-1 px-4 py-2 rounded-xl font-body text-[13px] outline-none"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                />
                <button
                  type="button"
                  onClick={handleDriveUpload}
                  className="px-4 py-2 rounded-xl font-body text-[13px] font-semibold whitespace-nowrap"
                  style={{ background: `linear-gradient(135deg, ${C.violet}, ${C.blue})`, color: "white" }}
                >
                  Link File
                </button>
              </div>
              {fileUrl && uploadMethod === "googledrive" && (
                <p className="font-body text-[11px] mt-2" style={{ color: C.good }}>✅ Google Drive file linked</p>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="px-7 py-3.5 rounded-2xl font-body text-[13.5px] font-semibold transition-opacity" style={{ background: `linear-gradient(135deg, ${space.accent}, ${ACCENT_COLORS[(ACCENT_COLORS.indexOf(space.accent) + 2) % ACCENT_COLORS.length] || C.blue})`, color: "white", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Saving..." : "Save Content"}
        </button>
        {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-[12.5px]" style={{ color: C.good }}>✓ Content saved to Supabase!</motion.p>}
      </form>
    </div>
  );
};
/* ---------------------------------------------------------------
   MANAGE CONTENT - FIXED
--------------------------------------------------------------- */
const ManageContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await sb
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      const { error } = await sb
        .from("content")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchContent();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting: " + err.message);
    }
  };

  const filtered = filter === "all" ? content : content.filter(c => c.space_id === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${C.border}`, borderTopColor: C.white }} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: C.white }}>Manage Content</h2>
      <p className="font-body text-[13px] mb-6" style={{ color: C.faint }}>
        {content.length} pieces of content across all spaces.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")} className="px-3.5 py-1.5 rounded-full font-body text-[12px]" style={{ border: `1px solid ${filter === "all" ? C.violet : C.border}`, color: filter === "all" ? C.violet : C.faint, background: filter === "all" ? `${C.violet}14` : "transparent" }}>
          All ({content.length})
        </button>
        {SPACES.map(s => {
          const count = content.filter(c => c.space_id === s.id).length;
          return (
            <button key={s.id} onClick={() => setFilter(s.id)} className="px-3.5 py-1.5 rounded-full font-body text-[12px]" style={{ border: `1px solid ${filter === s.id ? s.accent : C.border}`, color: filter === s.id ? s.accent : C.faint, background: filter === s.id ? `${s.accent}14` : "transparent" }}>
              {s.title} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8" style={{ color: C.faint }}>
          <p className="font-body text-[14px]">No content in this space yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((item, i) => {
            const space = SPACES.find(s => s.id === item.space_id);
            const IconComponent = space?.Icon || FolderOpen;
            const accentColor = space?.accent || C.violet;
            
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between py-4 px-4 rounded-xl"
                style={{ background: i % 2 === 0 ? "transparent" : C.fainter }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accentColor}22` }}>
                    <IconComponent size={13} color={accentColor} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-[13.5px] truncate" style={{ color: C.white }}>{item.title}</p>
                    <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{space?.title || item.space_id} · {item.meta || "New"}{item.price ? ` · ${item.price}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden sm:flex items-center gap-1 font-body text-[12px]" style={{ color: C.faint }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${C.bad}14` }}>
                    <Trash2 size={13} color={C.bad} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
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

/* ===============================================================
   🔥 ADS MANAGEMENT - FIXED
   =============================================================== */
const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    video_url: '',
    position: 'home',
    active: true
  });

  // Fetch ads
  const fetchAds = async () => {
    setLoading(true);
    try {
      const { data, error } = await sb
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (err) {
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const { url } = await uploadToCloudinary(file, "ads_images");
      setFormData({...formData, image_url: url});
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      const { url } = await uploadToCloudinary(file, "ads_videos");
      setFormData({...formData, video_url: url});
      alert("✅ Video uploaded successfully!");
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  // Save ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAd) {
        const { error } = await sb
          .from("ads")
          .update(formData)
          .eq("id", editingAd.id);
        if (error) throw error;
      } else {
        const { error } = await sb
          .from("ads")
          .insert([formData]);
        if (error) throw error;
      }
      await fetchAds();
      setShowForm(false);
      setEditingAd(null);
      setFormData({ title: '', image_url: '', link_url: '', video_url: '', position: 'home', active: true });
    } catch (err) {
      console.error("Error saving ad:", err);
      alert("Error saving ad: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete ad
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    setLoading(true);
    try {
      const { error } = await sb
        .from("ads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchAds();
    } catch (err) {
      console.error("Error deleting ad:", err);
      alert("Error deleting ad: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit ad
  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      video_url: ad.video_url || '',
      position: ad.position || 'home',
      active: ad.active
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-fraunces text-2xl font-bold" style={{ color: C.white }}>📢 Ads Management</h2>
          <p className="font-body text-[13px] mt-1" style={{ color: C.faint }}>Create and manage ads. Upload images and videos directly from your device!</p>
        </div>
        <button
          onClick={() => {
            setEditingAd(null);
            setFormData({ title: '', image_url: '', link_url: '', video_url: '', position: 'home', active: true });
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl font-body text-[13px] font-semibold flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: 'white' }}
        >
          <Plus size={16} />
          {showForm ? 'Cancel' : 'Add Ad'}
        </button>
      </div>

      {/* Ad Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 rounded-2xl"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-[12px] mb-1" style={{ color: C.faint }}>Ad Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl font-body text-[13px] outline-none"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                  required
                />
              </div>
              <div>
                <label className="block font-body text-[12px] mb-1" style={{ color: C.faint }}>Upload Image (JPG, PNG, WEBP)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1 px-4 py-2.5 rounded-xl font-body text-[13px] outline-none cursor-pointer"
                    style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                  />
                  {uploadingImage && <span className="font-body text-[12px]" style={{ color: C.good }}>⏳ Uploading...</span>}
                </div>
                {formData.image_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.image_url} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover" />
                    <p className="font-body text-[11px] truncate" style={{ color: C.good }}>✅ Image uploaded!</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block font-body text-[12px] mb-1" style={{ color: C.faint }}>Link URL (YouTube/Vimeo or Website)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl font-body text-[13px] outline-none"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                  placeholder="https://youtube.com/watch?v=xxxxx"
                />
              </div>
              <div>
                <label className="block font-body text-[12px] mb-1" style={{ color: C.faint }}>OR Upload Video (MP4, WebM)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="flex-1 px-4 py-2.5 rounded-xl font-body text-[13px] outline-none cursor-pointer"
                    style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                  />
                  {uploadingVideo && <span className="font-body text-[12px]" style={{ color: C.good }}>⏳ Uploading...</span>}
                </div>
                {formData.video_url && (
                  <p className="font-body text-[11px] mt-1" style={{ color: C.good }}>
                    ✅ Video uploaded: <span className="truncate" style={{ color: C.faint }}>{formData.video_url}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block font-body text-[12px] mb-1" style={{ color: C.faint }}>Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl font-body text-[13px] outline-none"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.white }}
                >
                  <option value="home">Homepage</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-body text-[13px]" style={{ color: C.dim }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                Active
              </label>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-body text-[13px] font-semibold"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: 'white' }}
              >
                {loading ? 'Saving...' : (editingAd ? 'Update Ad' : 'Save Ad')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ads List */}
      <div className="space-y-2">
        {ads.map((ad, i) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl flex items-center justify-between gap-4"
            style={{ background: i % 2 === 0 ? C.surface : C.fainter, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {ad.image_url && (
                <img src={ad.image_url} alt={ad.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <h4 className="font-body text-[14px] font-semibold truncate" style={{ color: C.white }}>
                  {ad.title}
                </h4>
                <p className="font-body text-[11.5px]" style={{ color: C.faint }}>
                  {ad.position} • {ad.clicks || 0} clicks • 
                  {ad.video_url ? ' 🎬 Video' : 
                   ad.image_url ? ' 🖼️ Image' : ' 📝 Text'}
                  • {ad.active ? '✅ Active' : '❌ Inactive'}
                </p>
                {ad.video_url && (
                  <p className="font-body text-[10px] truncate" style={{ color: C.faint }}>📹 {ad.video_url}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(ad)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: C.dim }}
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => handleDelete(ad.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {ads.length === 0 && !loading && (
        <div className="text-center py-12" style={{ color: C.faint }}>
          <p className="font-body text-[14px]">No ads yet. Click "Add Ad" to create one!</p>
        </div>
      )}
    </div>
  );
};

/* ===============================================================
   NAVIGATION
   =============================================================== */
const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "photos", label: "Gallery Photos", Icon: Image },
  { id: "upload", label: "Upload Content", Icon: UploadCloud },
  { id: "manage", label: "Manage Content", Icon: FolderOpen },
  { id: "ads", label: "Ads Management", Icon: Plus },
  { id: "payments", label: "Payments", Icon: CreditCard },
  { id: "audience", label: "Audience", Icon: Users },
];

/* ===============================================================
   ROOT ADMIN
   =============================================================== */
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
                {tab === "ads" && <AdsManagement />}
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
