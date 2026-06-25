import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  Heart, MessageCircle, X, Instagram, Youtube, Facebook, Twitter, Send,
  Play, Mail, Lock, User, LogOut, ArrowLeft, ChevronLeft, ChevronRight,
  Quote
} from "lucide-react";

// ==================== SUPABASE ====================
import { createClient } from '@supabase/supabase-js';

// 🔁 REPLACE THESE WITH YOUR ACTUAL VALUES
const SUPABASE_URL = "https://mzhccgxxbznvinqyvust.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aGNjZ3h4YnpudmlucXl2dXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzkwMTAsImV4cCI6MjA5NzgxNTAxMH0.z-KNumdmNKaXyYYgWGFo1ZIxNMPc31rNvGqvdIlMbFU";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

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
  switch (space.type) {
    case "audio": return [
      { id: `${space.id}-1`, title: "On Starting Over (Again)", meta: "24 min · Episode 01" },
      { id: `${space.id}-2`, title: "The Weight We Don't Talk About", meta: "31 min · Episode 02" },
    ];
    case "book": return [
      { id: `${space.id}-1`, title: "Letters I Never Sent", meta: "Poetry & Prose · 142 pages", price: "₦3,500", blurb: "A quiet collection on grief, faith, and the words we keep folded in our pockets." },
      { id: `${space.id}-2`, title: "Still Standing", meta: "Memoir · 210 pages", price: "₦4,200", blurb: "A personal account of holding onto purpose when everything else gave way." },
    ];
    case "poetry": return [
      { id: `${space.id}-1`, title: "Unfinished Prayer", meta: "Spoken · 3 min" },
      { id: `${space.id}-2`, title: "Acoustic: What the River Knows", meta: "Acoustic · 4 min" },
    ];
    default: return [
      { id: `${space.id}-1`, title: `${space.title} — Vol. 1`, meta: "Video · 18 min" },
      { id: `${space.id}-2`, title: `${space.title} — Vol. 2`, meta: "Video · 22 min" },
    ];
  }
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

function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

/* ---------------------------------------------------------------
   AUTO-SWIPING GALLERY (FIXED)
--------------------------------------------------------------- */
const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [glowIdx, setGlowIdx] = useState(0);

  // Load photos from Supabase
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
   ABOUT ME (unchanged)
--------------------------------------------------------------- */
const AboutMe = () => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="flex-1 flex flex-col justify-center py-4 min-w-0">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)" }} />
      <p className="font-body text-[10px] tracking-[0.4em] uppercase shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>Behind the Words</p>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15))" }} />
    </div>
    <h1 className="font-fraunces font-black leading-[1.0] mb-5" style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: "white" }}>
      Oluwasogo<br />Dosunmu
    </h1>
    <div className="flex flex-wrap gap-2 mb-7">
      {[["Author", "#7C3AED"], ["Poet", "#2563EB"], ["Speaker", "#059669"], ["Visionary", "#DC2626"]].map(([r, c]) => (
        <span key={r} className="px-3 py-1.5 rounded-full font-body text-[11px] font-medium" style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>{r}</span>
      ))}
    </div>
    <div className="relative mb-7 pl-5" style={{ borderLeft: "3px solid rgba(255,255,255,0.15)" }}>
      <Quote size={18} color="rgba(255,255,255,0.2)" className="mb-2" />
      <p className="font-fraunces italic text-[18px] md:text-[21px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.85)" }}>
        Every creation has the power to leave a lasting impact.
      </p>
    </div>
    <p className="font-body text-[13.5px] leading-[1.85]" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 480 }}>
      I am an author, poet, speaker, and creative visionary passionate about inspiring lives through words, faith, and music. Through books, poetry, sermons, prayer sessions, and motivational messages, I seek to inspire hope, ignite purpose, and point people toward God.
    </p>
    <div className="flex items-center gap-6 mt-8 pt-7" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {STATS.map((s, i) => (
        <div key={i}>
          <p className="font-fraunces font-black text-2xl md:text-3xl" style={{ color: "white" }}>{s.n}</p>
          <p className="font-body text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ---------------------------------------------------------------
   BURST NAV (unchanged)
--------------------------------------------------------------- */
const BurstNav = ({ onSelectSpace }) => {
  const [phase, setPhase] = useState("closed");
  const ref = useRef(null);

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
        style={{ color: "white", background: phase !== "closed" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
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
                <span className="font-body text-[12px]" style={{ color: "white" }}>{s.title}</span>
              </motion.div>
            ))}

            {phase === "list" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 mt-3 w-[290px] rounded-2xl overflow-hidden"
                style={{ 
                  background: "rgba(12,13,18,0.97)", 
                  border: "1px solid rgba(255,255,255,0.09)", 
                  boxShadow: "0 30px 80px rgba(0,0,0,0.9)", 
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
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg">
                      {s.emoji}
                    </div>
                    <span>
                      <span className="block font-body text-[13.5px] font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>{s.title}</span>
                      <span className="block font-body text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.tag}</span>
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
   NAV (unchanged)
--------------------------------------------------------------- */
const Nav = ({ onSelectSpace, onGoHome }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-40"
      style={{ background: scrolled ? "rgba(7,8,12,0.9)" : "rgba(7,8,12,0.5)", backdropFilter: scrolled ? "blur(16px)" : "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.07)", transition: "all 0.4s" }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between relative">

        {/* LEFT: Logo */}
        <div className="relative z-20 shrink-0 mr-12">
          <button onClick={onGoHome} className="font-fraunces font-bold text-[18px] md:text-[20px]" style={{ color: "#FFFFFF" }}>
            Oluwasogo Dosunmu
          </button>
        </div>

        {/* CENTER: Scrolling tiles - shifted more to the right */}
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
        <div className="relative z-50 shrink-0 ml-12">
          <BurstNav onSelectSpace={onSelectSpace} />
        </div>

      </div>
    </motion.header>
  );
};
/* ---------------------------------------------------------------
   AUTH MODAL (unchanged)
--------------------------------------------------------------- */
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dodgeCount, setDodgeCount] = useState(0);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [shake, setShake] = useState(false);

  const dodge = () => {
    const directions = [
      { x: 120, y: -30 }, { x: -110, y: 20 }, { x: 80, y: 40 },
      { x: -90, y: -50 }, { x: 100, y: 50 }, { x: -120, y: 10 },
    ];
    const pick = directions[Math.floor(Math.random() * directions.length)];
    setBtnPos(pick);
    setShake(true);
    setTimeout(() => { setBtnPos({ x: 0, y: 0 }); setShake(false); }, 500);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (dodgeCount < 2) {
      setDodgeCount(c => c + 1);
      dodge();
    } else {
      onAuth({ name: name || email.split("@")[0], email });
    }
  };

  const dodgeMsgs = ["Hmm, not yet... 😏", "Almost! Try again 😅", "Okay okay, you got me 😂"];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl p-8 relative"
        style={{ background: "#0E1015", border: "1px solid rgba(255,255,255,0.09)" }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
          <X size={15} color="rgba(255,255,255,0.5)" />
        </button>
        <h3 className="font-fraunces text-2xl font-bold mb-1" style={{ color: "white" }}>
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h3>
        <p className="font-body text-[13px] mb-7" style={{ color: "rgba(255,255,255,0.35)" }}>
          {dodgeCount === 0 ? (mode === "signup" ? "Join my world" : "Log back in") : dodgeMsgs[dodgeCount - 1]}
        </p>
        <form onSubmit={handleSubmitClick} className="space-y-3">
          {mode === "signup" && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <User size={15} color="rgba(255,255,255,0.3)" />
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="bg-transparent outline-none w-full font-body text-[13.5px]" style={{ color: "white" }} />
            </div>
          )}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Mail size={15} color="rgba(255,255,255,0.3)" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" className="bg-transparent outline-none w-full font-body text-[13.5px]" style={{ color: "white" }} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Lock size={15} color="rgba(255,255,255,0.3)" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="bg-transparent outline-none w-full font-body text-[13.5px]" style={{ color: "white" }} />
          </div>
          <div className="relative h-14 mt-2">
            <motion.button
              type="submit"
              animate={{ x: btnPos.x, y: btnPos.y, rotate: shake ? [0, -4, 4, -4, 4, 0] : 0 }}
              transition={{ x: { type: "spring", stiffness: 260, damping: 18 }, y: { type: "spring", stiffness: 260, damping: 18 }, rotate: { duration: 0.4 } }}
              className="absolute inset-0 w-full rounded-2xl font-body text-[14px] font-semibold"
              style={{ background: dodgeCount >= 2 ? "linear-gradient(135deg,#059669,#10B981)" : "linear-gradient(135deg,#7C3AED,#2563EB)", color: "white" }}
            >
              {dodgeCount === 0 && (mode === "signup" ? "Sign up" : "Log in")}
              {dodgeCount === 1 && "Catch me if you can 😏"}
              {dodgeCount >= 2 && "Okay fine, come in! 🎉"}
            </motion.button>
          </div>
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="font-body text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>or</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>
        <button onClick={() => onAuth({ name: "Google User", email: "you@gmail.com" })} className="w-full py-3.5 rounded-2xl font-body text-[13.5px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}>
          Continue with Google
        </button>
        <p className="text-center font-body text-[12px] mt-6" style={{ color: "rgba(255,255,255,0.3)" }}>
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setDodgeCount(0); setBtnPos({ x: 0, y: 0 }); }} style={{ color: "#818CF8" }}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   ENGAGEMENT (unchanged)
--------------------------------------------------------------- */
const Engagement = ({ contentId, user, accent }) => {
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
    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-5">
        <button onClick={toggleLike} className="flex items-center gap-2 font-body text-[13px]">
          <Heart size={15} fill={likedByMe ? accent : "none"} color={likedByMe ? accent : "rgba(255,255,255,0.3)"} />
          <span style={{ color: likedByMe ? accent : "rgba(255,255,255,0.3)" }}>{data.likes}</span>
        </button>
        <button onClick={() => setShowComments(s => !s)} className="flex items-center gap-2 font-body text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          <MessageCircle size={15} />{data.comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-3 space-y-2">
          {data.comments.map((c, i) => <div key={i} className="font-body text-[12.5px]"><span style={{ color: accent }}>{c.name}</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>{c.text}</span></div>)}
          <form onSubmit={addComment} className="flex gap-2 mt-2">
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Say something..." className="flex-1 bg-transparent outline-none font-body text-[13px] px-4 py-2.5 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
            <button type="submit" style={{ color: accent }}><Send size={15} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   SPACE VIEW (unchanged)
--------------------------------------------------------------- */
const SpaceView = ({ space, user, onBack }) => {
  const content = sampleContent(space);
  return (
    <div className="min-h-screen" style={{ background: "#07080C" }}>
      <button
        onClick={onBack}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 font-body text-[13px] px-4 py-2.5 rounded-full"
        style={{ color: "white", background: "rgba(20,20,28,0.92)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
      >
        <ArrowLeft size={14} /> Back
      </button>
      <div className="relative pt-24 pb-16 px-6 md:px-10 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${space.accent}25, transparent)` }} />
        <div className="relative">
          <div className="text-4xl mb-3">{space.emoji}</div>
          <p className="font-body text-[10.5px] tracking-[0.3em] uppercase mb-2" style={{ color: space.accent }}>{space.tag}</p>
          <h1 className="font-fraunces font-bold text-4xl md:text-[3.2rem] leading-tight mb-4" style={{ color: "white" }}>{space.title}</h1>
          <p className="font-body text-[15px] max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>{space.desc}</p>
          <p className="font-body text-[13px] mt-5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Welcome, <span style={{ color: space.accent }}>{user?.name}</span> — {space.welcome}.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 space-y-4">
        {content.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-fraunces text-xl font-semibold" style={{ color: "white" }}>{item.title}</h3>
                <p className="font-body text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.meta}</p>
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: `${space.accent}22` }}>
                <Play size={14} color={space.accent} fill={space.accent} />
              </div>
            </div>
            {space.type === "book" && (
              <div className="mt-4">
                <p className="font-body text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.blurb}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button className="px-5 py-2.5 rounded-xl font-body text-[13px] font-semibold" style={{ background: space.accent, color: "#07080C" }}>Read PDF · {item.price}</button>
                  <button className="px-5 py-2.5 rounded-xl font-body text-[13px]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Buy hardcover</button>
                </div>
              </div>
            )}
            <Engagement contentId={item.id} user={user} accent={space.accent} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   HOMEPAGE (unchanged)
--------------------------------------------------------------- */
const Homepage = () => (
  <div style={{ background: "#07080C", minHeight: "100vh" }}>
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

    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

    <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-body text-[10.5px] tracking-[0.35em] uppercase mb-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
        Featured
      </motion.p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {AD_SLOTS.map((label, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -5 }}
            className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-2 p-3 text-center overflow-hidden relative"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="absolute w-16 h-16 rounded-full pointer-events-none" style={{ background: ["#7C3AED", "#2563EB", "#059669", "#DC2626", "#D97706", "#DB2777"][i % 6], opacity: 0.3, filter: "blur(22px)", top: "-10%", left: "20%" }} />
            <Sparkles size={15} color="rgba(255,255,255,0.3)" className="relative" />
            <p className="relative font-body text-[11px] leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
            <p className="relative font-body text-[8.5px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.2)" }}>Coming soon</p>
          </motion.div>
        ))}
      </div>
    </div>

    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
    <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
      <p className="font-body text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} Oluwasogo Dosunmu. All rights reserved.</p>
      <div className="flex items-center gap-3">
        {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
          <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}><Icon size={15} /></a>
        ))}
      </div>
    </footer>
  </div>
);
/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function Site() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSpace, setPendingSpace] = useState(null);

  useEffect(() => { const s = lsGet("user-profile"); if (s) setUser(JSON.parse(s)); }, []);

  const handleSelectSpace = useCallback((id) => {
    if (user) { setView(id); window.scrollTo(0, 0); }
    else { setPendingSpace(id); setAuthOpen(true); }
  }, [user]);

  const handleAuth = (profile) => {
    setUser(profile); lsSet("user-profile", JSON.stringify(profile)); setAuthOpen(false);
    if (pendingSpace) { setView(pendingSpace); setPendingSpace(null); window.scrollTo(0, 0); }
  };

  const logout = () => { setUser(null); setView("home"); lsSet("user-profile", ""); };
  const activeSpace = SPACES.find(s => s.id === view);

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
        <div className="fixed bottom-6 right-6 z-30">
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
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={handleAuth} />}
      </AnimatePresence>
    </div>
  );
}
