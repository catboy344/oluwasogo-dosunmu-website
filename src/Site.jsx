import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  Heart, MessageCircle, X, Instagram, Youtube, Facebook, Twitter, Send,
  Play, Mail, Lock, User, LogOut, ArrowLeft, ChevronLeft, ChevronRight,
  Quote, FileText  // 🔥 ADD THIS
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { useTheme } from './ThemeContext';
import { getThemeColors } from './themeColors';
import ThemeToggle from './ThemeToggle';
import Ads from './Ads';

// ==================== SUPABASE ====================
const SUPABASE_URL = "https://mzhccgxxbznvinqyvust.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aGNjZ3h4YnpudmlucXl2dXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzkwMTAsImV4cCI6MjA5NzgxNTAxMH0.z-KNumdmNKaXyYYgWGFo1ZIxNMPc31rNvGqvdIlMbFU";
export const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ==================================================

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

const SLIDES = [
  { bg: "linear-gradient(160deg,#1a0533,#3d1065,#6b21a8)", label: "Author" },
  { bg: "linear-gradient(160deg,#0a2540,#1e4d8c,#3b82f6)", label: "Poet" },
  { bg: "linear-gradient(160deg,#1a2e05,#365314,#65a30d)", label: "Speaker" },
  { bg: "linear-gradient(160deg,#450a0a,#991b1b,#ef4444)", label: "Visionary" },
];

const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", tag: "Podcast · Audio", desc: "Quiet conversations recorded for the moments you need a voice beside you.", welcome: "these whispers were saved for you", Icon: Mic, type: "audio", accent: "#38BDB0", emoji: "🎙️" },
  { id: "speaks", title: "Sogo Speaks", tag: "Motivational · Video", desc: "Words meant to move you forward — for the mornings you need a push.", welcome: "let these words meet you exactly where you are", Icon: Video, type: "video", accent: "#E8B23D", emoji: "🎤" },
  { id: "healingpen", title: "The Healing Pen", tag: "Books · Writings", desc: "Pages written to mend, to mirror, and to make sense of the unspeakable.", welcome: "turn the page — healing is here", Icon: BookOpen, type: "book", accent: "#E85D9E", emoji: "✍️" },
  { id: "poetry", title: "Poetry", tag: "Poems · Acoustic", desc: "Verses that breathe — some spoken plainly, some carried by a single guitar.", welcome: "sit with these words a while", Icon: PenTool, type: "poetry", accent: "#9B82F0", emoji: "🖊️" },
  { id: "preaches", title: "Sogo Preaches", tag: "Sermons · Video", desc: "The gospel of Christ, unpacked plainly and preached boldly.", welcome: "come in, the Word is being broken", Icon: Church, type: "video", accent: "#F2944D", emoji: "✝️" },
  { id: "presence", title: "In His Presence", tag: "Worship · Video", desc: "A space set apart for praise — where the ordinary gives way to the holy.", welcome: "lay everything down and worship", Icon: Sparkles, type: "video", accent: "#F25C9C", emoji: "🙌" },
  { id: "holyghost", title: "The Holy Ghost in Action", tag: "Prayer · Video", desc: "Prayer sessions carried by the Spirit. Come empty-handed.", welcome: "let's enter the secret place together", Icon: Hand, type: "video", accent: "#3DD68C", emoji: "🔥" },
];

const sampleContent = (space) => {
  return [];
};

const AD_SLOTS = ["New Release", "Podcast Premiere", "Upcoming Event", "Merch Drop", "Featured Sermon", "Book Tour"];
const STATS = [{ n: "7", label: "Spaces" }, { n: "2+", label: "Books" }, { n: "∞", label: "Impact" }];

const GLOW_COLORS = [
  "#7C3AED", "#2563EB", "#059669", "#DC2626",
  "#E8B23D", "#E85D9E", "#38BDB0",
];

const TILES_ROW1 = ["Author","Podcast","Speaker","The Healing Pen","Poet","Holy Ghost","Sogo Speaks","Visionary","In His Presence","Poetry","Sogo Preaches","Faith","Worship","Impact"];
const TILE_COLORS = [
  { bg:"rgba(124,58,237,0.15)", border:"rgba(124,58,237,0.3)", color:"#a78bfa", dot:"#a78bfa" },
  { bg:"rgba(56,189,176,0.12)", border:"rgba(56,189,176,0.3)", color:"#5eead4", dot:"#5eead4" },
  { bg:"rgba(232,178,61,0.12)", border:"rgba(232,178,61,0.3)", color:"#fbbf24", dot:"#fbbf24" },
  { bg:"rgba(232,93,158,0.12)", border:"rgba(232,93,158,0.3)", color:"#f472b6", dot:"#f472b6" },
  { bg:"rgba(37,99,235,0.12)",  border:"rgba(37,99,235,0.3)",  color:"#60a5fa", dot:"#60a5fa" },
  { bg:"rgba(61,214,140,0.12)", border:"rgba(61,214,140,0.3)", color:"#4ade80", dot:"#4ade80" },
  { bg:"rgba(242,148,77,0.12)", border:"rgba(242,148,77,0.3)", color:"#fb923c", dot:"#fb923c" },
];

function lsGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { sessionStorage.setItem(k, v); } catch {} }

/* ---------------------------------------------------------------
   AUTO-SWIPING GALLERY
--------------------------------------------------------------- */
const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [glowIdx, setGlowIdx] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const { data, error } = await sb
          .from("photos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error loading photos:", error);
          return;
        }

        if (data && data.length > 0) {
          const mapped = data.map((p) => ({
            src: p.url,
            name: p.name || p.title || "Photo",
          }));
          setPhotos(mapped);
        }
      } catch (err) {
        console.error("Failed to load photos:", err);
      }
    };

    loadPhotos();
  }, []);

  const slides = photos.length > 0 ? photos : SLIDES;
  const total = slides.length;

  const goTo = (next) => { setDir(next > idx ? 1 : -1); setIdx(next); };

  useEffect(() => {
    setIdx(0);
  }, [photos.length]);

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setIdx(i => (i + 1) % total); }, 4000);
    return () => clearInterval(t);
  }, [total]);

  useEffect(() => {
    const g = setInterval(() => setGlowIdx(i => (i + 1) % GLOW_COLORS.length), 1800);
    return () => clearInterval(g);
  }, []);

  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, scale: 0.96 }),
  };

  const c1 = GLOW_COLORS[glowIdx];
  const c2 = GLOW_COLORS[(glowIdx + 2) % GLOW_COLORS.length];
  const c3 = GLOW_COLORS[(glowIdx + 4) % GLOW_COLORS.length];

  return (
    <div className="relative w-full md:w-[360px] shrink-0" style={{ height: 500 }}>
      <motion.div
        className="absolute rounded-3xl pointer-events-none"
        style={{ inset: -18, zIndex: 0 }}
        animate={{ boxShadow: `0 0 60px 20px ${c1}88, 0 0 120px 40px ${c2}44, 0 0 180px 60px ${c3}22` }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-3xl pointer-events-none"
        style={{ inset: -3, zIndex: 1, borderRadius: 28 }}
        animate={{
          background: [
            `conic-gradient(from 0deg, ${c1}, ${c2}, ${c3}, ${c1})`,
            `conic-gradient(from 120deg, ${c2}, ${c3}, ${c1}, ${c2})`,
            `conic-gradient(from 240deg, ${c3}, ${c1}, ${c2}, ${c3})`,
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute rounded-[24px] pointer-events-none" style={{ inset: 3, background: "#07080C", zIndex: 2 }} />
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl" style={{ zIndex: 3 }}>
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0"
          >
            {photos.length > 0 ? (
              <img
                src={slides[idx].src}
                alt={slides[idx].name || "Gallery photo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: slides[idx].bg }}>
                <div className="w-24 h-24 rounded-full flex items-center justify-center font-fraunces font-black text-3xl"
                  style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
                  OD
                </div>
                <p className="font-body text-[11px] tracking-[0.35em] uppercase mt-4" style={{ color: "rgba(255,255,255,0.45)" }}>{slides[idx].label}</p>
                <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
                <p className="absolute bottom-5 left-5 font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Add your photo in admin</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button onClick={() => goTo((idx - 1 + total) % total)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
          <ChevronLeft size={16} color="white" />
        </button>
        <button onClick={() => goTo((idx + 1) % total)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
          <ChevronRight size={16} color="white" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="transition-all duration-300 rounded-full"
            style={{ width: i === idx ? 22 : 7, height: 7, background: i === idx ? "white" : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   ABOUT ME - THEMED
--------------------------------------------------------------- */
const AboutMe = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="flex-1 flex flex-col justify-center py-4 min-w-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${colors.borderColor}, transparent)` }} />
        <p className="font-body text-[10px] tracking-[0.4em] uppercase shrink-0" style={{ color: colors.textMuted }}>Behind the Words</p>
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${colors.borderColor})` }} />
      </div>
      <h1 className="font-fraunces font-black leading-[1.0] mb-5" style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: colors.textPrimary }}>
        Oluwasogo<br />Dosunmu
      </h1>
      <div className="flex flex-wrap gap-2 mb-7">
        {[["Author", "#7C3AED"], ["Poet", "#2563EB"], ["Speaker", "#059669"], ["Visionary", "#DC2626"]].map(([r, c]) => (
          <span key={r} className="px-3 py-1.5 rounded-full font-body text-[11px] font-medium" style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>{r}</span>
        ))}
      </div>
      <div className="relative mb-7 pl-5" style={{ borderLeft: `3px solid ${colors.borderColor}` }}>
        <Quote size={18} color={colors.textMuted} className="mb-2" />
        <p className="font-fraunces italic text-[18px] md:text-[21px] leading-[1.6]" style={{ color: colors.textLight }}>
          Every creation has the power to leave a lasting impact.
        </p>
      </div>
      <p className="font-body text-[13.5px] leading-[1.85]" style={{ color: colors.textSecondary, maxWidth: 480 }}>
        I am an author, poet, speaker, and creative visionary passionate about inspiring lives through words, faith, and music. Through books, poetry, sermons, prayer sessions, and motivational messages, I seek to inspire hope, ignite purpose, and point people toward God.
      </p>
      <div className="flex items-center gap-6 mt-8 pt-7" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
        {STATS.map((s, i) => (
          <div key={i}>
            <p className="font-fraunces font-black text-2xl md:text-3xl" style={{ color: colors.textPrimary }}>{s.n}</p>
            <p className="font-body text-[11px] mt-0.5" style={{ color: colors.textMuted }}>{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   BURST NAV
--------------------------------------------------------------- */
const BurstNav = ({ onSelectSpace }) => {
  const [phase, setPhase] = useState("closed");
  const ref = useRef(null);
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (phase !== "closed") setPhase("closed");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [phase]);

  const handleToggle = () => {
    if (phase === "closed") {
      setPhase("burst");
      setTimeout(() => { setPhase("list"); }, 1200);
    } else {
      setPhase("closed");
    }
  };

  const burstPositions = [
    { x: -240, y: 120 },
    { x: -160, y: 180 },
    { x: -80,  y: 250 },
    { x: 0,    y: 300 },
    { x: 80,   y: 250 },
    { x: 160,  y: 180 },
    { x: 240,  y: 120 },
  ];

  return (
    <div className="relative" ref={ref} style={{ zIndex: 9999 }}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 font-body text-[13px] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full"
        style={{ 
          color: colors.textPrimary,
          background: phase !== "closed" ? colors.backgroundInput : colors.backgroundNavTransparent,
          border: `1px solid ${colors.borderLight}`
        }}
      >
        My World
        <motion.span animate={{ rotate: phase !== "closed" ? 180 : 0 }} transition={{ duration: 2.5 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {(phase === "burst" || phase === "list") && (
          <>
            {phase === "burst" && SPACES.map((s, i) => (
              <motion.div
                key={`burst-${s.id}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                animate={{ x: burstPositions[i].x, y: burstPositions[i].y, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: i * 0.04, type: "spring", stiffness: 120, damping: 12 }}
                className="absolute top-12 right-0 z-50 flex items-center gap-1.5 px-3 py-2 rounded-2xl pointer-events-none"
                style={{ background: `${s.accent}22`, border: `1px solid ${s.accent}55`, whiteSpace: "nowrap" }}
              >
                <s.Icon size={13} color={s.accent} />
                <span className="font-body text-[12px]" style={{ color: colors.textPrimary }}>{s.title}</span>
              </motion.div>
            ))}

            {phase === "list" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-3 w-[350px] rounded-2xl overflow-hidden"
                style={{ 
                  background: colors.backgroundModal,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: colors.shadow,
                  backdropFilter: "blur(20px)",
                  zIndex: 99999
                }}
              >
                {SPACES.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, y: -40, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: (SPACES.length - 1 - i) * 0.2, type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => { setPhase("closed"); onSelectSpace(s.id); }}
                    className="w-full text-left px-5 py-4 flex items-center gap-3.5 group hover:bg-white/[0.04] transition-colors"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${colors.borderColor}` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg">
                      {s.emoji}
                    </div>
                    <span>
                      <span className="block font-body text-[13.5px] font-medium" style={{ color: colors.textPrimary }}>{s.title}</span>
                      <span className="block font-body text-[11px] mt-0.5" style={{ color: colors.textMuted }}>{s.tag}</span>
                    </span>
                    <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: s.accent }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------------------------------------------------------
   NAV - THEMED (Theme Toggle in front of Logo)
--------------------------------------------------------------- */
const Nav = ({ onSelectSpace, onGoHome }) => {
  const [scrolled, setScrolled] = useState(false);
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: scrolled ? colors.backgroundNav : colors.backgroundNavTransparent,
        backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
        borderBottom: `1px solid ${colors.borderColor}`,
        transition: "all 0.4s"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between relative">

        {/* LEFT: Theme Toggle + Logo */}
        <div className="relative z-20 shrink-0 flex items-center gap-3 mr-12">
          <ThemeToggle />
          <button 
            onClick={onGoHome} 
            className="font-fraunces font-bold text-[18px] md:text-[20px]" 
            style={{ color: colors.textPrimary }}
          >
            Oluwasogo Dosunmu
          </button>
        </div>

        {/* CENTER: Scrolling tiles */}
        <div className="absolute left-1/2 top-0 bottom-0 z-10 flex items-center overflow-hidden" style={{ transform: 'translateX(-40%)', maxWidth: '50%' }}>
          <motion.div
            style={{ display: "flex", gap: 8 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...TILES_ROW1, ...TILES_ROW1].map((label, i) => {
              const c = TILE_COLORS[i % TILE_COLORS.length];
              return (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 12px", height: 30, borderRadius: 8, background: c.bg, border: `1px solid ${c.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 500, color: c.color }}>{label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT: My World */}
        <div className="relative z-50 shrink-0 flex items-center gap-3 ml-12">
          <BurstNav onSelectSpace={onSelectSpace} />
        </div>

      </div>
    </motion.header>
  );
};

/* ---------------------------------------------------------------
   AUTH MODAL - GOOGLE ONLY (NO EMAIL SIGNUP)
--------------------------------------------------------------- */
const AuthModal = ({ onClose, onAuth, defaultMode = "signup", pendingSpace = null }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Animated tiles background
  const animatedTiles = [
    "Author", "Poet", "Speaker", "Visionary", "Podcast", "Sermon", "Worship",
    "Prayer", "Faith", "Impact", "Words", "Hope", "Purpose", "Inspire",
    "Healing", "Mend", "Mirror", "Breathe", "Listen", "Speak", "Believe",
    "Create", "Dream", "Rise", "Shine", "Lead", "Serve", "Love",
    "Write", "Sing", "Pray", "Preach", "Teach", "Guide", "Illuminate",
    "Transform", "Renew", "Restore", "Revive", "Awaken", "Empower", "Ignite"
  ];

  const tileColors = [
    "rgba(124,58,237,0.15)", "rgba(37,99,235,0.15)", "rgba(5,150,105,0.15)",
    "rgba(220,38,38,0.15)", "rgba(232,178,61,0.15)", "rgba(232,93,158,0.15)",
    "rgba(56,189,176,0.15)", "rgba(242,148,77,0.15)", "rgba(155,130,240,0.15)",
    "rgba(236,72,153,0.15)", "rgba(52,211,153,0.15)", "rgba(251,146,60,0.15)"
  ];

  // Google-only login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center px-5 overflow-hidden" 
      style={{ 
        background: isDark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.92)", 
        backdropFilter: "blur(16px)" 
      }} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {/* Animated tiles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {animatedTiles.map((tile, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const xPos = 3 + col * 16 + Math.random() * 4;
          const yPos = 3 + row * 14 + Math.random() * 6;
          const duration = 12 + Math.random() * 18;
          const delay = Math.random() * 8;
          const size = 70 + Math.random() * 60;
          const colorIndex = i % tileColors.length;
          const rotation = -15 + Math.random() * 30;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-2xl flex items-center justify-center font-body font-bold tracking-wide"
              style={{
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size * 0.45,
                background: tileColors[colorIndex],
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                fontSize: `${size * 0.2}px`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                padding: '0 16px',
                backdropFilter: 'blur(4px)',
                boxShadow: isDark 
                  ? '0 8px 32px rgba(0,0,0,0.2)' 
                  : '0 8px 32px rgba(0,0,0,0.04)',
                rotate: rotation,
                transformOrigin: 'center',
              }}
              animate={{
                x: [0, 80, -50, 60, -30, 40, 0],
                y: [0, -60, 30, -40, 20, -30, 0],
                rotate: [rotation, rotation + 12, rotation - 8, rotation + 6, rotation - 4, rotation],
                scale: [1, 1.12, 0.88, 1.08, 0.92, 1],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            >
              {tile}
            </motion.div>
          );
        })}
        
        {/* Glowing particles */}
        {[...Array(20)].map((_, i) => {
          const size = 100 + Math.random() * 200;
          const colors = isDark 
            ? ['rgba(124,58,237,0.08)', 'rgba(37,99,235,0.08)', 'rgba(5,150,105,0.08)', 'rgba(232,178,61,0.08)']
            : ['rgba(124,58,237,0.05)', 'rgba(37,99,235,0.05)', 'rgba(5,150,105,0.05)', 'rgba(232,178,61,0.05)'];
          
          return (
            <motion.div
              key={`glow-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${colors[i % colors.length]}, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(20px)',
              }}
              animate={{
                x: [0, 80, -50, 60, -30, 0],
                y: [0, -60, 40, -30, 20, 0],
                scale: [1, 1.5, 0.7, 1.3, 0.9, 1],
              }}
              transition={{
                duration: 15 + Math.random() * 25,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            />
          );
        })}
        
        {/* Floating dots */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3 + Math.random() * 5,
              height: 3 + Math.random() * 5,
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30 + Math.random() * 50, -20 - Math.random() * 30, 0],
              y: [0, -20 - Math.random() * 40, 10 + Math.random() * 30, 0],
              opacity: [0.3, 1, 0.3, 0.6],
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Auth Modal - SIMPLIFIED */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl p-8 relative z-10"
        style={{ 
          background: isDark ? "rgba(14,16,21,0.95)" : "rgba(255,255,255,0.95)", 
          border: `1px solid ${colors.borderColor}`,
          boxShadow: isDark 
            ? "0 30px 80px rgba(0,0,0,0.8), 0 0 80px rgba(124,58,237,0.08)" 
            : "0 30px 80px rgba(0,0,0,0.08), 0 0 80px rgba(124,58,237,0.04)",
          backdropFilter: "blur(20px)"
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" 
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
        >
          <X size={15} color={colors.textSecondary} />
        </button>
        
        <div className="text-center">
          <h3 className="font-fraunces text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            Welcome Back
          </h3>
          <p className="font-body text-[13px] mb-7" style={{ color: colors.textSecondary }}>
            Sign in with Google to access your account
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-xl" style={{ 
            background: "rgba(239,68,68,0.15)", 
            border: "1px solid rgba(239,68,68,0.3)" 
          }}>
            <p className="font-body text-[13px]" style={{ color: "#ef4444" }}>
              {error}
            </p>
          </div>
        )}
        
        {/* Google Button */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-body text-[15px] font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          style={{ 
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${colors.borderColor}`,
            color: colors.textPrimary,
            opacity: loading ? 0.7 : 1
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-center font-body text-[11px] mt-6" style={{ color: colors.textMuted }}>
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   ENGAGEMENT
--------------------------------------------------------------- */
const Engagement = ({ contentId, user, accent }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [data, setData] = useState({ likes: 0, comments: [] });
  const [likedByMe, setLikedByMe] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  
  useEffect(() => {
    const s = lsGet(`engage_${contentId}`); const m = lsGet(`liked_${contentId}`);
    if (s) setData(JSON.parse(s)); if (m) setLikedByMe(JSON.parse(m));
  }, [contentId]);
  
  const toggleLike = () => {
    const n = !likedByMe; const nd = { ...data, likes: data.likes + (n ? 1 : -1) };
    setLikedByMe(n); setData(nd); lsSet(`liked_${contentId}`, JSON.stringify(n)); lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };
  
  const addComment = (e) => {
    e.preventDefault(); if (!draft.trim()) return;
    const nd = { ...data, comments: [...data.comments, { name: user?.name || "Guest", text: draft.trim() }] };
    setData(nd); setDraft(""); lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };
  
  return (
    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
      <div className="flex items-center gap-5">
        <button onClick={toggleLike} className="flex items-center gap-2 font-body text-[13px]">
          <Heart size={15} fill={likedByMe ? accent : "none"} color={likedByMe ? accent : colors.textMuted} />
          <span style={{ color: likedByMe ? accent : colors.textMuted }}>{data.likes}</span>
        </button>
        <button onClick={() => setShowComments(s => !s)} className="flex items-center gap-2 font-body text-[13px]" style={{ color: colors.textMuted }}>
          <MessageCircle size={15} />{data.comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-3 space-y-2">
          {data.comments.map((c, i) => <div key={i} className="font-body text-[12.5px]"><span style={{ color: accent }}>{c.name}</span> <span style={{ color: colors.textSecondary }}>{c.text}</span></div>)}
          <form onSubmit={addComment} className="flex gap-2 mt-2">
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Say something..." className="flex-1 bg-transparent outline-none font-body text-[13px] px-4 py-2.5 rounded-xl" style={{ border: `1px solid ${colors.borderColor}`, color: colors.textPrimary }} />
            <button type="submit" style={{ color: accent }}><Send size={15} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   SPACE VIEW - FETCHES FROM SUPABASE (WITH GOOGLE PDF VIEWER)
--------------------------------------------------------------- */
const SpaceView = ({ space, user, onBack }) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await sb
          .from("content")
          .select("*")
          .eq("space_id", space.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching content:", error);
          return;
        }
        
        setContent(data || []);
      } catch (err) {
        console.error("Failed to load content:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [space.id]);

  // Open image fullscreen
  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // Open PDF in Google PDF Viewer
  const openPDF = (fileUrl) => {
    setSelectedPDF(fileUrl);
  };

  const closePDF = () => {
    setSelectedPDF(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: colors.background, transition: "all 0.3s ease" }}>
        <button onClick={onBack} className="fixed top-5 left-5 z-50 flex items-center gap-2 font-body text-[13px] px-4 py-2.5 rounded-full" style={{ color: colors.textPrimary, background: isDark ? "rgba(20,20,28,0.92)" : "rgba(255,255,255,0.92)", border: `1px solid ${colors.borderLight}`, backdropFilter: "blur(10px)" }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${colors.borderColor}`, borderTopColor: colors.textPrimary }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ background: colors.background, transition: "all 0.3s ease" }}>
        <button
          onClick={onBack}
          className="fixed top-5 left-5 z-50 flex items-center gap-2 font-body text-[13px] px-4 py-2.5 rounded-full"
          style={{ 
            color: colors.textPrimary, 
            background: isDark ? "rgba(20,20,28,0.92)" : "rgba(255,255,255,0.92)", 
            border: `1px solid ${colors.borderLight}`,
            backdropFilter: "blur(10px)" 
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="relative pt-24 pb-16 px-6 md:px-10 text-center" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${space.accent}25, transparent)` }} />
          <div className="relative">
            <div className="text-4xl mb-3">{space.emoji}</div>
            <p className="font-body text-[10.5px] tracking-[0.3em] uppercase mb-2" style={{ color: space.accent }}>{space.tag}</p>
            <h1 className="font-fraunces font-bold text-4xl md:text-[3.2rem] leading-tight mb-4" style={{ color: colors.textPrimary }}>{space.title}</h1>
            <p className="font-body text-[15px] max-w-md mx-auto" style={{ color: colors.textSecondary }}>{space.desc}</p>
            <p className="font-body text-[13px] mt-5" style={{ color: colors.textMuted }}>
              Welcome, <span style={{ color: space.accent }}>{user?.name}</span> — {space.welcome}.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 space-y-4">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-[14px]" style={{ color: colors.textMuted }}>
                No content yet. Check back soon!
              </p>
            </div>
          ) : (
            content.map((item, i) => {
              const IconComponent = space.Icon;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 rounded-3xl" style={{ background: colors.backgroundCard, border: `1px solid ${colors.borderColor}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-fraunces text-xl font-semibold" style={{ color: colors.textPrimary }}>{item.title}</h3>
                      <p className="font-body text-[12px] mt-1" style={{ color: colors.textMuted }}>{item.meta || "New content"}</p>
                      
                      {/* Video */}
                      {item.video_url && (
                        <div className="mt-3 rounded-xl overflow-hidden">
                          <video src={item.video_url} className="w-full max-h-[300px]" controls playsInline />
                        </div>
                      )}

                      {/* Image - CLICK TO EXPAND */}
                      {item.image_url && !item.video_url && (
                        <div 
                          className="mt-3 rounded-xl overflow-hidden cursor-pointer"
                          onClick={() => openImage(item.image_url)}
                        >
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full max-h-[300px] object-cover transition-transform hover:scale-105" 
                          />
                          <p className="font-body text-[10px] mt-1 text-center" style={{ color: colors.textMuted }}>
                            👆 Click to expand
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: `${space.accent}22` }}>
                      <IconComponent size={14} color={space.accent} fill={space.accent} />
                    </div>
                  </div>

                  {/* Book Section with Google PDF Viewer */}
                  {space.type === "book" && item.blurb && (
                    <div className="mt-4">
                      <p className="font-body text-[13.5px] leading-relaxed" style={{ color: colors.textSecondary }}>{item.blurb}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {item.file_url ? (
                          <button 
                            onClick={() => openPDF(item.file_url)}
                            className="px-5 py-2.5 rounded-xl font-body text-[13px] font-semibold flex items-center gap-2"
                            style={{ background: space.accent, color: "#07080C" }}
                          >
                            <FileText size={16} />
                            Read Online · {item.price || "Free"}
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="px-5 py-2.5 rounded-xl font-body text-[13px] font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
                            style={{ background: space.accent, color: "#07080C" }}
                          >
                            <FileText size={16} />
                            PDF Not Available
                          </button>
                        )}
                        <button className="px-5 py-2.5 rounded-xl font-body text-[13px]" style={{ border: `1px solid ${colors.borderColor}`, color: colors.textSecondary }}>
                          Buy hardcover
                        </button>
                      </div>
                    </div>
                  )}
                  <Engagement contentId={item.id} user={user} accent={space.accent} />
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 🔥 FULLSCREEN IMAGE MODAL */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={closeImage}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage} 
              alt="Full view"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
            />
          </motion.div>
        </motion.div>
      )}

      {/* 🔥 PDF VIEWER MODAL - Google PDF Viewer */}
      {selectedPDF && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={closePDF}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden"
            style={{ background: '#f5f5f5' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePDF}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white', backdropFilter: 'blur(10px)' }}
            >
              <X size={20} />
            </button>
            
            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid #e5e5e5`, borderTopColor: '#7C3AED' }} />
            </div>
            
            {/* 🔥 Google PDF Viewer */}
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPDF)}&embedded=true`}
              className="w-full h-full relative z-10"
              style={{ border: 'none', background: 'white' }}
              title="PDF Reader"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
/* ---------------------------------------------------------------
   HOMEPAGE - THEMED WITH ADS SECTION (MORE SPACE ABOVE)
--------------------------------------------------------------- */
const Homepage = () => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  return (
    <div style={{ background: colors.background, minHeight: "100vh", transition: "all 0.3s ease" }}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {[
          { color: "#7C3AED", top: "10%", left: "60%", size: 500 },
          { color: "#2563EB", top: "60%", left: "-5%", size: 400 },
          { color: "#059669", top: "80%", left: "70%", size: 360 },
        ].map((b, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: b.color, opacity: 0.18, filter: "blur(130px)", mixBlendMode: "screen" }}
            animate={{ x: [0, 30, -15, 0], y: [0, -25, 18, 0] }}
            transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-20 w-full">
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="w-full md:w-auto">
              <Gallery />
            </motion.div>
            <AboutMe />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${colors.borderColor}, transparent)` }} />

      {/* ADS SECTION */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-8">
        <Ads position="home" limit={7} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${colors.borderColor}, transparent)` }} />

      {/* Featured Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-body text-[10.5px] tracking-[0.35em] uppercase mb-8 text-center" style={{ color: colors.textMuted }}>
          Featured
        </motion.p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {AD_SLOTS.map((label, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -5 }}
              className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-2 p-3 text-center overflow-hidden relative"
              style={{ background: colors.backgroundCard, border: `1px solid ${colors.borderColor}` }}
            >
              <div className="absolute w-16 h-16 rounded-full pointer-events-none" style={{ background: ["#7C3AED", "#2563EB", "#059669", "#DC2626", "#D97706", "#DB2777"][i % 6], opacity: 0.3, filter: "blur(22px)", top: "-10%", left: "20%" }} />
              <Sparkles size={15} color={colors.textMuted} className="relative" />
              <p className="relative font-body text-[11px] leading-tight" style={{ color: colors.textSecondary }}>{label}</p>
              <p className="relative font-body text-[8.5px] uppercase tracking-[0.15em]" style={{ color: colors.textMuted }}>Coming soon</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${colors.borderColor}, transparent)` }} />
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="font-body text-[12px]" style={{ color: colors.textMuted }}>
          © {new Date().getFullYear()} Oluwasogo Dosunmu. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <a 
            href="https://www.instagram.com/whispers.with.oluwasogo?igsh=ZnVoNGlyaHh0djA=" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10" 
            style={{ border: `1px solid ${colors.borderColor}`, color: colors.textSecondary }}
            aria-label="Instagram"
          >
            <Instagram size={15} />
          </a>
          <a 
            href="https://youtube.com/@shugzeygold?si=0bsnDVrBbROsPHyL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10" 
            style={{ border: `1px solid ${colors.borderColor}`, color: colors.textSecondary }}
            aria-label="YouTube"
          >
            <Youtube size={15} />
          </a>
          <a 
            href="https://www.tiktok.com/@whispers.with.oluwasogo?_r=1&_t=ZS-97WEBNcejYN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10" 
            style={{ border: `1px solid ${colors.borderColor}`, color: colors.textSecondary }}
            aria-label="TikTok"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://x.com/sogospeaks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10" 
            style={{ border: `1px solid ${colors.borderColor}`, color: colors.textSecondary }}
            aria-label="Twitter"
          >
            <Twitter size={15} />
          </a>
        </div>
      </footer>
    </div>
  );
};


/* ---------------------------------------------------------------
   ROOT - SITE
--------------------------------------------------------------- */
export default function Site() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSpace, setPendingSpace] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // REAL-TIME AUTH STATE LISTENER
  useEffect(() => {
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem("user-profile");
        localStorage.removeItem("session-start");
        localStorage.removeItem("pending-space");
        setUser(null);
        setView("home");
        console.log("🔄 Auto-logged out: Auth state changed");
      } else if (event === 'SIGNED_IN' && session) {
        const user = session.user;
        const profile = {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email,
          id: user.id
        };
        localStorage.setItem("user-profile", JSON.stringify(profile));
        localStorage.setItem("session-start", Date.now().toString());
        setUser(profile);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // CHECK SESSION ON LOAD - WITH EXPIRY
  useEffect(() => {
    const checkSession = async () => {
      setIsChecking(true);
      
      const storedUser = localStorage.getItem("user-profile");
      const sessionStart = localStorage.getItem("session-start");
      
      const SESSION_DURATION = 30 * 60 * 1000;
      const now = Date.now();
      
      if (storedUser && sessionStart) {
        const elapsed = now - parseInt(sessionStart);
        if (elapsed > SESSION_DURATION) {
          localStorage.removeItem("user-profile");
          localStorage.removeItem("session-start");
          localStorage.removeItem("pending-space");
          await sb.auth.signOut();
          setUser(null);
          setView("home");
          setIsChecking(false);
          console.log("🔄 Auto-logged out: Session expired (30 min)");
          return;
        }
      }
      
      const { data: { session } } = await sb.auth.getSession();
      
      if (session) {
        const user = session.user;
        const profile = {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email,
          id: user.id
        };
        
        localStorage.setItem("user-profile", JSON.stringify(profile));
        localStorage.setItem("session-start", now.toString());
        setUser(profile);
        
        // 🔥 CHECK FOR PENDING SPACE IN LOCALSTORAGE
        const pending = localStorage.getItem("pending-space");
        if (pending) {
          setView(pending);
          setPendingSpace(null);
          localStorage.removeItem("pending-space");
          window.scrollTo(0, 0);
        }
      } else {
        localStorage.removeItem("user-profile");
        localStorage.removeItem("session-start");
        localStorage.removeItem("pending-space");
        setUser(null);
        setView("home");
      }
      setIsChecking(false);
    };
    
    checkSession();
  }, []);

  // CHECK SESSION EVERY 5 SECONDS
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await sb.auth.getSession();
      
      const sessionStart = localStorage.getItem("session-start");
      const SESSION_DURATION = 30 * 60 * 1000;
      
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart);
        if (elapsed > SESSION_DURATION) {
          localStorage.removeItem("user-profile");
          localStorage.removeItem("session-start");
          localStorage.removeItem("pending-space");
          await sb.auth.signOut();
          setUser(null);
          setView("home");
          console.log("🔄 Auto-logged out: Session expired (time)");
          return;
        }
      }
      
      if (!session && user) {
        localStorage.removeItem("user-profile");
        localStorage.removeItem("session-start");
        localStorage.removeItem("pending-space");
        setUser(null);
        setView("home");
        console.log("🔄 Auto-logged out: Session expired (Supabase)");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // DETECT TAB/BROWSER CLOSE
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("last-activity", Date.now().toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // CHECK IF USER RETURNED AFTER LONG ABSENCE
  useEffect(() => {
    const checkReturn = () => {
      const lastActivity = localStorage.getItem("last-activity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        if (elapsed > 5 * 60 * 1000) {
          const checkSession = async () => {
            const { data: { session } } = await sb.auth.getSession();
            if (!session) {
              localStorage.removeItem("user-profile");
              localStorage.removeItem("session-start");
              localStorage.removeItem("pending-space");
              setUser(null);
              setView("home");
              console.log("🔄 Auto-logged out: Returned after long absence");
            }
          };
          checkSession();
        }
        localStorage.removeItem("last-activity");
      }
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkReturn();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 🔥 GOOGLE WELCOME EMAIL
  useEffect(() => {
    const sendWelcomeEmail = async () => {
      if (!user) return;
      
      const welcomeSent = localStorage.getItem(`welcome_${user.id}`);
      if (welcomeSent) return;
      
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer re_VmZTuJvF_23mUrh32qHtLvBNeasgcMR8q',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Welcome to Oluwasogo Dosunmu! 🙌',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #0E1015; color: #ffffff;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <h1 style="font-family: 'Georgia', serif; font-size: 28px; color: #ffffff; margin: 0;">
                    Oluwasogo Dosunmu
                  </h1>
                  <p style="color: rgba(255,255,255,0.4); font-size: 14px; margin-top: 5px;">
                    Author · Poet · Speaker · Visionary
                  </p>
                </div>

                <div style="padding: 30px 0;">
                  <h2 style="color: #ffffff; font-size: 22px;">
                    Welcome to My World! 🎉
                  </h2>
                  
                  <p style="color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6;">
                    Thank you for joining, <strong>${user.name || 'Friend'}</strong>!
                  </p>

                  <p style="color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6;">
                    You now have access to exclusive content, inspiring messages, poetry, sermons, and more.
                  </p>

                  <div style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid #7C3AED;">
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
                      ✨ <strong>What you'll find:</strong> Exclusive podcasts, inspiring poetry, powerful sermons, 
                      worship sessions, and access to my books and writings.
                    </p>
                  </div>

                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${window.location.origin}" 
                       style="background: linear-gradient(135deg, #7C3AED, #2563EB); 
                              color: #ffffff; 
                              padding: 14px 40px; 
                              text-decoration: none; 
                              border-radius: 30px; 
                              font-size: 16px; 
                              font-weight: bold;
                              display: inline-block;">
                      Explore Now →
                    </a>
                  </div>
                </div>

                <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <p style="color: rgba(255,255,255,0.2); font-size: 12px;">
                    © ${new Date().getFullYear()} Oluwasogo Dosunmu. All rights reserved.
                  </p>
                </div>
              </div>
            `,
          }),
        });
        
        if (res.ok) {
          localStorage.setItem(`welcome_${user.id}`, 'sent');
          console.log("✅ Welcome email sent to:", user.email);
        } else {
          console.error("❌ Failed to send welcome email:", await res.text());
        }
      } catch (err) {
        console.error("❌ Welcome email error:", err);
      }
    };

    sendWelcomeEmail();
  }, [user]);

  const handleSelectSpace = useCallback((id) => {
    if (user) { 
      setView(id); 
      window.scrollTo(0, 0); 
    } else { 
      setPendingSpace(id);
      // 🔥 SAVE TO LOCALSTORAGE SO IT PERSISTS THROUGH GOOGLE REDIRECT
      localStorage.setItem("pending-space", id);
      setAuthOpen(true); 
    }
  }, [user]);

  const handleAuth = (profile) => {
    setUser(profile); 
    localStorage.setItem("user-profile", JSON.stringify(profile)); 
    localStorage.setItem("session-start", Date.now().toString());
    setAuthOpen(false);
    
    // 🔥 CHECK FOR PENDING SPACE IN LOCALSTORAGE
    const pending = localStorage.getItem("pending-space");
    if (pending) { 
      setView(pending);
      setPendingSpace(null);
      localStorage.removeItem("pending-space");
      window.scrollTo(0, 0); 
    }
  };

  const logout = async () => { 
    await sb.auth.signOut();
    localStorage.removeItem("user-profile");
    localStorage.removeItem("session-start");
    localStorage.removeItem("last-activity");
    localStorage.removeItem("pending-space");
    setUser(null); 
    setView("home"); 
  };
  
  const activeSpace = SPACES.find(s => s.id === view);

  if (isChecking) {
    return (
      <div style={{ 
        background: "#07080C", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ color: "white", fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <FontLoader />
      <style>{`
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(124,58,237,0.4); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Nav onSelectSpace={handleSelectSpace} onGoHome={() => { setView("home"); window.scrollTo(0, 0); }} />

      {user && view !== "home" && (
        <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex items-center gap-2 font-body text-[12px] px-4 py-2.5 rounded-full"
            style={{ background: "rgba(20,20,28,0.9)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      )}

      {view === "home" && <Homepage />}
      {activeSpace && <SpaceView space={activeSpace} user={user} onBack={() => { setView("home"); window.scrollTo(0, 0); }} />}

      <AnimatePresence>
        {authOpen && (
          <AuthModal 
            onClose={() => setAuthOpen(false)} 
            onAuth={handleAuth} 
            defaultMode={pendingSpace ? "login" : "signup"}
            pendingSpace={pendingSpace}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
