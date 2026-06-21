import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown, Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  Heart, MessageCircle, X, Instagram, Youtube, Facebook, Twitter, Send,
  Play, Mail, Lock, User, LogOut, ArrowLeft, Mic2
} from "lucide-react";

/* ---------------------------------------------------------------
   FONTS
--------------------------------------------------------------- */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
  return null;
};

/* ---------------------------------------------------------------
   TOKENS — calm, high contrast, restrained gold
--------------------------------------------------------------- */
const C = {
  bg: "#050505",
  panel: "#0D0D0D",
  ivory: "#F4EFE6",
  ivoryDim: "#B5AFA2",
  faint: "#6E6A60",
  gold: "#C9A24B",
  goldBright: "#E0BE6E",
  hairline: "rgba(201,162,75,0.18)",
  hairlineSoft: "rgba(255,255,255,0.07)",
};

/* ---------------------------------------------------------------
   DATA
--------------------------------------------------------------- */
const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", tag: "Podcast · Audio", desc: "Quiet conversations and unscripted reflections recorded for the moments you need a voice beside you.", welcome: "these whispers were saved for you", Icon: Mic, type: "audio" },
  { id: "speaks", title: "Sogo Speaks", tag: "Motivational · Video", desc: "Words meant to move you forward — for the mornings you need a push and the nights you need a reason.", welcome: "let these words meet you exactly where you are", Icon: Video, type: "video" },
  { id: "healingpen", title: "The Healing Pen", tag: "Books · Writings", desc: "Pages written to mend, to mirror, and to make sense of the unspeakable. Read instantly, or find a hardcover near you.", welcome: "turn the page — healing is here", Icon: BookOpen, type: "book" },
  { id: "poetry", title: "Poetry", tag: "Poems · Acoustic", desc: "Verses that breathe — some spoken plainly, some carried by a single guitar, all of them felt.", welcome: "sit with these words a while", Icon: PenTool, type: "poetry" },
  { id: "preaches", title: "Sogo Preaches", tag: "Sermons · Video", desc: "The gospel of Christ, unpacked plainly and preached boldly, for anyone with an ear to hear.", welcome: "come in, the Word is being broken", Icon: Church, type: "video" },
  { id: "presence", title: "In His Presence", tag: "Worship · Video", desc: "A space set apart for praise — where the ordinary gives way to the holy.", welcome: "lay everything down and worship", Icon: Sparkles, type: "video" },
  { id: "holyghost", title: "The Holy Ghost in Action", tag: "Prayer · Video", desc: "Prayer sessions carried by the Spirit. Come empty-handed — leave heavy with peace.", welcome: "let's enter the secret place together", Icon: Hand, type: "video" },
];

const sampleContent = (space) => {
  switch (space.type) {
    case "audio":
      return [
        { id: `${space.id}-1`, title: "On Starting Over (Again)", meta: "24 min · Episode 01" },
        { id: `${space.id}-2`, title: "The Weight We Don't Talk About", meta: "31 min · Episode 02" },
      ];
    case "book":
      return [
        { id: `${space.id}-1`, title: "Letters I Never Sent", meta: "Poetry & Prose · 142 pages", price: "₦3,500", blurb: "A quiet collection on grief, faith, and the words we keep folded in our pockets." },
        { id: `${space.id}-2`, title: "Still Standing", meta: "Memoir · 210 pages", price: "₦4,200", blurb: "A personal account of holding onto purpose when everything else gave way." },
      ];
    case "poetry":
      return [
        { id: `${space.id}-1`, title: "Unfinished Prayer", meta: "Spoken · 3 min" },
        { id: `${space.id}-2`, title: "Acoustic: What the River Knows", meta: "Acoustic · 4 min" },
      ];
    default:
      return [
        { id: `${space.id}-1`, title: `${space.title} — Vol. 1`, meta: "Video · 18 min" },
        { id: `${space.id}-2`, title: `${space.title} — Vol. 2`, meta: "Video · 22 min" },
      ];
  }
};

const AD_SLOTS = ["New Release", "Podcast Premiere", "Upcoming Event", "Merch Drop", "Featured Sermon", "Book Tour"];
const ROLES = ["Author", "Poet", "Speaker", "Visionary"];

/* ---------------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------------- */
async function safeGet(key, shared) {
  try { const res = await window.storage.get(key, shared); return res ? res.value : null; }
  catch { return null; }
}
async function safeSet(key, value, shared) {
  try { await window.storage.set(key, value, shared); } catch {}
}

/* ---------------------------------------------------------------
   SCROLL REVEAL — one calm fade/rise, no flourishes
--------------------------------------------------------------- */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(18px)",
      transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

/* ---------------------------------------------------------------
   NAME — solid, legible, one quiet entrance
--------------------------------------------------------------- */
const NameReveal = () => (
  <div className="text-center">
    <Reveal>
      <h1
        className="font-display tracking-wide leading-[1.05]"
        style={{ fontSize: "clamp(2.4rem,7vw,4.6rem)", color: C.ivory, fontWeight: 600 }}
      >
        Oluwasogo Dosunmu
      </h1>
      <div className="flex items-center justify-center gap-3 mt-5">
        <span className="h-px w-10" style={{ background: C.hairline }} />
        <p className="font-body text-[11px] tracking-[0.35em] uppercase" style={{ color: C.gold }}>
          {ROLES.join(" · ")}
        </p>
        <span className="h-px w-10" style={{ background: C.hairline }} />
      </div>
    </Reveal>
  </div>
);

/* ---------------------------------------------------------------
   PORTRAIT — simple framed gallery card, quiet crossfade
--------------------------------------------------------------- */
const PortraitFrame = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROLES.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto md:mx-0" style={{ width: "min(300px,78vw)" }}>
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "3/4", background: C.panel, border: `1px solid ${C.hairline}` }}
      >
        {ROLES.map((label, i) => (
          <div
            key={label}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ opacity: idx === i ? 1 : 0, transition: "opacity 1s ease" }}
          >
            <span
              className="font-display"
              style={{ fontSize: "4.2rem", color: "transparent", WebkitTextStroke: `1px ${C.gold}`, lineHeight: 1 }}
            >
              OD
            </span>
            <p className="font-body text-[11px] tracking-[0.35em] uppercase mt-5" style={{ color: C.ivoryDim }}>
              {label}
            </p>
          </div>
        ))}
        {/* corner marks */}
        {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} w-4 h-4`} style={{ borderColor: C.gold, borderWidth: 1 }} />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="font-body text-[10.5px] tracking-wide" style={{ color: C.faint }}>Photos & videos go here</p>
        <div className="flex gap-1">
          {ROLES.map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full" style={{ background: idx === i ? C.gold : C.hairline }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   NAV
--------------------------------------------------------------- */
const Nav = ({ onSelectSpace, onGoHome }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.hairlineSoft}` }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
        <button onClick={onGoHome} className="font-display text-[17px]" style={{ color: C.ivory }}>
          Oluwasogo Dosunmu
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 font-body text-[12.5px] tracking-[0.18em] uppercase px-4 py-2"
            style={{ color: C.ivory, border: `1px solid ${open ? C.gold : C.hairline}` }}
          >
            My World
            <ChevronDown size={14} style={{ transition: "transform .3s", transform: open ? "rotate(180deg)" : "none", color: C.gold }} />
          </button>

          <div
            className="absolute right-0 mt-2 w-[280px]"
            style={{
              background: C.panel, border: `1px solid ${C.hairline}`,
              boxShadow: "0 20px 50px -12px rgba(0,0,0,0.9)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-6px)",
              pointerEvents: open ? "auto" : "none",
              transition: "all .25s ease",
            }}
          >
            {SPACES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setOpen(false); onSelectSpace(s.id); }}
                className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-white/[0.03] transition-colors"
                style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairlineSoft}` }}
              >
                <s.Icon size={14} color={C.gold} className="mt-0.5 shrink-0" />
                <span>
                  <span className="block font-body text-[13px]" style={{ color: C.ivory }}>{s.title}</span>
                  <span className="block font-body text-[10.5px] mt-0.5" style={{ color: C.faint }}>{s.tag}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ---------------------------------------------------------------
   AUTH MODAL
--------------------------------------------------------------- */
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) return;
    onAuth({ name: name || email.split("@")[0], email });
  };
  const googleDemo = () => onAuth({ name: "Google User", email: "you@gmail.com", viaGoogle: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-sm p-8" style={{ background: C.panel, border: `1px solid ${C.hairline}` }}>
        <button onClick={onClose} className="absolute" style={{ marginTop: -32, marginLeft: 'calc(100% - 24px)', color: C.faint }}><X size={18} /></button>
        <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: C.gold }}>{mode === "signup" ? "Join the world" : "Welcome back"}</p>
        <h3 className="font-display text-2xl mb-7" style={{ color: C.ivory }}>{mode === "signup" ? "Create your account" : "Log in"}</h3>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ border: `1px solid ${C.hairline}` }}>
              <User size={15} color={C.faint} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
            </div>
          )}
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ border: `1px solid ${C.hairline}` }}>
            <Mail size={15} color={C.faint} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ border: `1px solid ${C.hairline}` }}>
            <Lock size={15} color={C.faint} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
          </div>
          <button type="submit" className="w-full py-3 font-body text-sm tracking-wide mt-1" style={{ background: C.gold, color: "#1A1304", fontWeight: 600 }}>
            {mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1" style={{ background: C.hairline }} />
          <span className="text-[11px] font-body" style={{ color: C.faint }}>or</span>
          <div className="h-px flex-1" style={{ background: C.hairline }} />
        </div>

        <button onClick={googleDemo} className="w-full py-3 font-body text-sm" style={{ border: `1px solid ${C.hairline}`, color: C.ivory }}>
          Continue with Google
        </button>
        <p className="text-[10.5px] font-body mt-2 text-center" style={{ color: C.faint }}>(Demo mode — real Google sign-in connects on deploy)</p>

        <p className="text-center font-body text-[12.5px] mt-6" style={{ color: C.faint }}>
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ color: C.gold }}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   ENGAGEMENT
--------------------------------------------------------------- */
const Engagement = ({ contentId, user }) => {
  const [data, setData] = useState({ likes: 0, comments: [] });
  const [likedByMe, setLikedByMe] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const shared = await safeGet(`engage_${contentId}`, true);
      const mine = await safeGet(`liked_${contentId}`, false);
      if (shared) setData(JSON.parse(shared));
      if (mine) setLikedByMe(JSON.parse(mine));
      setLoaded(true);
    })();
  }, [contentId]);

  const toggleLike = async () => {
    const newLiked = !likedByMe;
    const newData = { ...data, likes: data.likes + (newLiked ? 1 : -1) };
    setLikedByMe(newLiked); setData(newData);
    await safeSet(`liked_${contentId}`, JSON.stringify(newLiked), false);
    await safeSet(`engage_${contentId}`, JSON.stringify(newData), true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const newComment = { name: user?.name || "Guest", text: draft.trim(), ts: Date.now() };
    const newData = { ...data, comments: [...data.comments, newComment] };
    setData(newData); setDraft("");
    await safeSet(`engage_${contentId}`, JSON.stringify(newData), true);
  };

  if (!loaded) return null;

  return (
    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.hairlineSoft}` }}>
      <div className="flex items-center gap-6">
        <button onClick={toggleLike} className="flex items-center gap-2 font-body text-[13px]">
          <Heart size={16} fill={likedByMe ? C.gold : "none"} color={likedByMe ? C.gold : C.faint} />
          <span style={{ color: likedByMe ? C.gold : C.faint }}>{data.likes}</span>
        </button>
        <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 font-body text-[13px]" style={{ color: C.faint }}>
          <MessageCircle size={16} />{data.comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-4 space-y-2.5">
          {data.comments.map((c, i) => (
            <div key={i} className="text-[13px] font-body"><span style={{ color: C.gold }}>{c.name}</span> <span style={{ color: C.ivoryDim }}>{c.text}</span></div>
          ))}
          <form onSubmit={addComment} className="flex gap-2 mt-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Leave a comment..." className="flex-1 bg-transparent outline-none font-body text-[13px] px-3.5 py-2.5" style={{ border: `1px solid ${C.hairline}`, color: C.ivory }} />
            <button type="submit" style={{ color: C.gold }}><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   SPACE VIEW
--------------------------------------------------------------- */
const SpaceView = ({ space, user, onBack }) => {
  const content = sampleContent(space);
  const { Icon } = space;
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="px-5 md:px-8 pt-12 pb-14 md:pt-16 md:pb-20 text-center" style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}>
        <button onClick={onBack} className="flex items-center gap-1.5 font-body text-[12.5px] mb-8 mx-auto md:mx-0 md:ml-0" style={{ color: C.faint, maxWidth: 1100 }}>
          <ArrowLeft size={14} /> My World
        </button>
        <Reveal>
          <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center" style={{ border: `1px solid ${C.gold}` }}>
            <Icon size={20} color={C.gold} />
          </div>
          <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: C.gold }}>{space.tag}</p>
          <h1 className="font-display text-4xl md:text-6xl mb-5" style={{ color: C.ivory, fontWeight: 600 }}>{space.title}</h1>
          <p className="font-cormorant italic text-xl md:text-2xl max-w-xl mx-auto" style={{ color: C.ivoryDim }}>{space.desc}</p>
          <p className="font-body text-[13px] mt-6" style={{ color: C.faint }}>Welcome, <span style={{ color: C.gold }}>{user?.name}</span> — {space.welcome}.</p>
        </Reveal>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-5">
        {content.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.07}>
            <div className="p-6 md:p-7" style={{ background: C.panel, border: `1px solid ${C.hairline}` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl md:text-2xl" style={{ color: C.ivory }}>{item.title}</h3>
                  <p className="font-body text-[12.5px] mt-1.5" style={{ color: C.faint }}>{item.meta}</p>
                </div>
                <div className="shrink-0 w-11 h-11 flex items-center justify-center" style={{ border: `1px solid ${C.gold}` }}>
                  <Play size={14} color={C.gold} fill={C.gold} />
                </div>
              </div>

              {space.type === "book" && (
                <div className="mt-4">
                  <p className="font-cormorant italic text-[15px]" style={{ color: C.ivoryDim }}>{item.blurb}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button className="px-5 py-2.5 font-body text-[12.5px]" style={{ background: C.gold, color: "#1A1304", fontWeight: 600 }}>
                      Read PDF · {item.price}
                    </button>
                    <button className="px-5 py-2.5 font-body text-[12.5px]" style={{ border: `1px solid ${C.hairline}`, color: C.ivoryDim }}>
                      Where to buy hardcover
                    </button>
                  </div>
                </div>
              )}
              <Engagement contentId={item.id} user={user} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   HOMEPAGE
--------------------------------------------------------------- */
const Homepage = () => (
  <>
    <section className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-16">
      <div className="flex flex-col md:flex-row gap-12 md:gap-0">
        <Reveal className="md:w-[300px] shrink-0">
          <PortraitFrame />
        </Reveal>

        <div className="hidden md:block w-px mx-12" style={{ background: C.hairline }} />

        <Reveal delay={0.12} className="flex-1 md:pt-2">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase mb-5" style={{ color: C.gold }}>About Me</p>
          <p className="font-cormorant text-[18px] md:text-[19px] leading-[1.9]" style={{ color: C.ivoryDim }}>
            My name is Oluwasogo Dosunmu—an author, poet, speaker, and creative visionary
            passionate about inspiring lives through words, faith, and music.
            <br /><br />
            I believe that every creation has the power to leave a lasting impact. Through my
            books, poetry, motivational messages, gospel teachings, prayer sessions, and
            instrumental expressions, I seek to inspire hope, ignite purpose, strengthen faith,
            and encourage personal growth.
            <br /><br />
            This platform is more than a collection of my work; it is a reflection of my
            journey, my convictions, and my commitment to creating meaningful content that
            uplifts, transforms, and connects people across the world.
            <br /><br />
            My mission is simple: to use every gift entrusted to me to inspire hearts, challenge
            minds, and point people toward purpose, excellence, and God.
            <br /><br />
            <span style={{ color: C.ivory }}>
              Welcome to my world—a place where creativity meets purpose, faith inspires action,
              and every creation carries a message worth sharing.
            </span>
          </p>
        </Reveal>
      </div>

      <div className="mt-20 md:mt-28"><NameReveal /></div>
    </section>

    <section className="max-w-3xl mx-auto px-5 md:px-8 pb-16">
      <Reveal>
        <p className="font-body text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: C.gold }}>Featured</p>
      </Reveal>
      <div>
        {AD_SLOTS.map((label, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div
              className="flex items-center justify-between py-4 group transition-colors"
              style={{ borderTop: i === 0 ? `1px solid ${C.hairline}` : "none", borderBottom: `1px solid ${C.hairline}` }}
            >
              <div className="flex items-center gap-4">
                <span className="font-body text-[11px]" style={{ color: C.faint }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg md:text-xl group-hover:translate-x-1 transition-transform inline-block" style={{ color: C.ivory }}>
                  {label}
                </span>
              </div>
              <span className="font-body text-[10.5px] tracking-[0.2em] uppercase" style={{ color: C.faint }}>Coming soon</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    <footer className="px-5 md:px-8 py-10" style={{ borderTop: `1px solid ${C.hairlineSoft}` }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="font-body text-[12.5px]" style={{ color: C.faint }}>© {new Date().getFullYear()} Oluwasogo Dosunmu. All rights reserved.</p>
        <div className="flex items-center gap-5">
          {[Instagram, Youtube, Facebook, Twitter].map((IconC, i) => (
            <a key={i} href="#" style={{ color: C.faint }}><IconC size={16} /></a>
          ))}
        </div>
      </div>
    </footer>
  </>
);

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function Site() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSpace, setPendingSpace] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await safeGet("user-profile", false);
      if (stored) setUser(JSON.parse(stored));
      setBooted(true);
    })();
  }, []);

  const handleSelectSpace = useCallback((id) => {
    if (user) setView(id);
    else { setPendingSpace(id); setAuthOpen(true); }
  }, [user]);

  const handleAuth = async (profile) => {
    setUser(profile);
    await safeSet("user-profile", JSON.stringify(profile), false);
    setAuthOpen(false);
    if (pendingSpace) { setView(pendingSpace); setPendingSpace(null); }
  };

  const logout = async () => { setUser(null); setView("home"); await safeSet("user-profile", "", false); };
  const activeSpace = SPACES.find((s) => s.id === view);

  if (!booted) return <div style={{ background: C.bg, minHeight: "100vh" }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <FontLoader />
      <style>{`
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        ::selection { background: rgba(201,162,75,0.3); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Nav onSelectSpace={handleSelectSpace} onGoHome={() => setView("home")} />

      {user && view !== "home" && (
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-3 flex justify-end">
          <button onClick={logout} className="flex items-center gap-1.5 font-body text-[11.5px]" style={{ color: C.faint }}>
            <LogOut size={12} /> Log out
          </button>
        </div>
      )}

      {view === "home" && <Homepage />}
      {activeSpace && <SpaceView space={activeSpace} user={user} onBack={() => setView("home")} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={handleAuth} />}
    </div>
  );
}
