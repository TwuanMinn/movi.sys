"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAnnouncementStore, type Announcement, type Category } from "@/stores/announcement-store";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { AnimatedCounter } from "@/components/ui/motion-primitives";

/* ── Icon helper ── */
function MI({ name, className = "", filled, style }: { name: string; className?: string; filled?: boolean; style?: React.CSSProperties }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`, ...style }}
    >
      {name}
    </span>
  );
}

/* ── Design tokens ── */
const EMOJI_OPTIONS = ["🎬", "🎥", "🍿", "🏆", "🌟", "🎭", "🦸", "🚀"];
const FILTERS = ["All", "Premieres", "Trailers", "Movie news", "Events", "Urgent", "Pinned"];

const CATEGORY_MAP: Record<Category, { color: string; gradient: string; laneId: string; heading: string; icon: string }> = {
  "Premiere":     { color: "#8E5BB5", gradient: "linear-gradient(135deg, rgba(142,91,181,0.12) 0%, rgba(31,35,45,0.6) 100%)", laneId: "premiere", heading: "Premieres", icon: "movie" },
  "Trailer drop": { color: "#2BA5A5", gradient: "linear-gradient(135deg, rgba(43,165,165,0.12) 0%, rgba(31,35,45,0.6) 100%)", laneId: "trailer",  heading: "Trailer Drops", icon: "play_circle" },
  "Movie news":   { color: "#4A90D9", gradient: "linear-gradient(135deg, rgba(74,144,217,0.12) 0%, rgba(31,35,45,0.6) 100%)", laneId: "news",     heading: "Movie News", icon: "newspaper" },
  "Event":        { color: "#D4903B", gradient: "linear-gradient(135deg, rgba(212,144,59,0.12) 0%, rgba(31,35,45,0.6) 100%)",  laneId: "event",    heading: "Events & Screenings", icon: "event" },
};

/* ── Glassmorphism card ── */
const glassCard: React.CSSProperties = {
  background: "rgba(31, 35, 45, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(173, 198, 255, 0.1)",
  borderLeft: "1px solid rgba(173, 198, 255, 0.1)",
  borderRight: "1px solid rgba(173, 198, 255, 0.04)",
  borderBottom: "1px solid rgba(173, 198, 255, 0.04)",
  borderRadius: 16,
};

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;

/* ── Animation variants ── */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: STANDARD_EASE } },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, x: -14, y: 10 },
  show: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
};

type ToastType = "success" | "warning";

interface DueState {
  label: string;
  color: string;
  bg: string;
}

interface CardProps {
  item: Announcement;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isCommentActive: boolean;
  toggleComments: (id: string | null) => void;
  getDueState: (dateStr: string) => DueState | null;
  getInitials: (name: string) => string;
  formatViews: (num: number) => string;
}

interface HeroCardProps extends CardProps {
  addToast: (msg: string, type?: ToastType) => void;
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

type SelectOption = string | { val: string; label: string };

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export default function AnnouncementsPage() {
  const store = useAnnouncementStore();
  const announcements = store.announcements;

  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const addToast = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [view, setView] = useState<"grid" | "swimlanes">("grid");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("pinned");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("Current User");
  const [formRole, setFormRole] = useState("Editor");
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formEmoji, setFormEmoji] = useState("🎬");
  const [formCategory, setFormCategory] = useState<Category>("Premiere");
  const [formAudience, setFormAudience] = useState("Everyone");
  const [formDate, setFormDate] = useState("");
  const [formPriority, setFormPriority] = useState("Normal");
  const [formPinned, setFormPinned] = useState("false");
  const [formAttachment, setFormAttachment] = useState("");
  const [commentText, setCommentText] = useState("");

  const filtered = useMemo(() => {
    const result = announcements.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = item.title.toLowerCase().includes(q) ||
                          item.body.toLowerCase().includes(q) ||
                          item.author.toLowerCase().includes(q);

      let matchFilter = true;
      if (filter === 'Premieres') matchFilter = item.category === 'Premiere';
      if (filter === 'Trailers') matchFilter = item.category === 'Trailer drop';
      if (filter === 'Movie news') matchFilter = item.category === 'Movie news';
      if (filter === 'Events') matchFilter = item.category === 'Event';
      if (filter === 'Urgent') matchFilter = item.urgent;
      if (filter === 'Pinned') matchFilter = item.pinned;

      return matchSearch && matchFilter;
    });

    return result.sort((a, b) => {
      if (sort === 'pinned') {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.createdAt - a.createdAt;
      }
      if (sort === 'newest') return b.createdAt - a.createdAt;
      if (sort === 'urgent') {
        if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
        return b.createdAt - a.createdAt;
      }
      if (sort === 'premiere') {
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [announcements, searchQuery, filter, sort]);

  const stats = useMemo(() => {
    const totals = { total: announcements.length, urgent: 0, pinned: 0, passed: 0 };
    announcements.forEach(item => {
      if (item.urgent) totals.urgent++;
      if (item.pinned) totals.pinned++;
      if (item.dueDate) {
        const diffDays = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) totals.passed++;
      }
    });
    return totals;
  }, [announcements]);

  const getDueState = (dateStr: string) => {
    if (!dateStr) return null;
    const diffDays = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "Passed", color: "#e85d75", bg: "rgba(232,93,117,0.12)" };
    if (diffDays <= 3) return { label: `In ${diffDays}d`, color: "#ffb595", bg: "rgba(255,181,149,0.12)" };
    return { label: new Date(dateStr).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), color: "#82dab0", bg: "rgba(130,218,176,0.12)" };
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const formatViews = (num: number) => num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(num);

  const openForm = (id: string | null = null) => {
    const item = id ? announcements.find(d => d.id === id) : null;
    setEditId(id);
    setFormName(item ? item.author : "Studio User");
    setFormRole(item ? item.role : "Editor");
    setFormTitle(item ? item.title : "");
    setFormBody(item ? item.body : "");
    setFormEmoji(item ? item.emoji : "🎬");
    setFormCategory(item ? item.category : "Premiere");
    setFormAudience(item ? item.audience : "Everyone");
    setFormDate(item ? item.dueDate : "");
    setFormPriority(item && item.urgent ? "Urgent" : "Normal");
    setFormPinned(item && item.pinned ? "true" : "false");
    setFormAttachment(item ? item.attachment : "");
    setModalOpen(true);
  };

  const submitForm = () => {
    if (!formTitle.trim()) {
      addToast("Title is required", "warning");
      return;
    }
    const payload = {
      title: formTitle, author: formName, role: formRole, body: formBody, category: formCategory,
      audience: formAudience, dueDate: formDate, urgent: formPriority === "Urgent", pinned: formPinned === "true",
      attachment: formAttachment, emoji: formEmoji
    };

    if (editId) {
      store.updateAnnouncement(editId, payload);
      addToast("Announcement updated! ✔️", "success");
    } else {
      store.addAnnouncement(payload);
      addToast("Announcement posted! ✔️", "success");
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      store.deleteAnnouncement(deleteTarget);
      addToast("Announcement deleted", "success");
      if (activeCommentId === deleteTarget) setActiveCommentId(null);
    }
    setDeleteTarget(null);
  };

  const postComment = () => {
    if (!activeCommentId || !commentText.trim()) return;
    store.addComment(activeCommentId, "Studio User", commentText.trim());
    setCommentText("");
    addToast("Comment posted! ✔️", "success");
  };

  const canShowHero = view === 'grid' && sort === 'pinned' && filtered.length > 0 && filtered[0]?.pinned;
  const heroItem = canShowHero ? filtered[0] : null;
  const gridItems = canShowHero ? filtered.slice(1) : filtered;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full gap-7 relative pb-32"
    >
      {/* ── Hero Banner ── */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl overflow-hidden film-grain"
        style={{
          background: "linear-gradient(135deg, rgba(142,91,181,0.06) 0%, rgba(31,35,45,0.9) 30%, rgba(25,28,34,0.95) 100%)",
          border: "1px solid rgba(173,198,255,0.08)",
        }}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #8E5BB5, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #D4903B, transparent 70%)" }} />

        <div className="relative z-10 px-6 sm:px-8 py-7 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
                Live Feed
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Announcements
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm font-medium max-w-lg">
              Studio-wide updates, premiere dates, trailer drops, and breaking movie industry news.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Toggle */}
            <div className="flex bg-[var(--color-bg-surface)]/80 rounded-xl p-1 border border-[var(--color-border-default)]/20 backdrop-blur-sm">
              {(["grid", "swimlanes"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    view === v
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-primary)] shadow-sm"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <MI name={v === "grid" ? "grid_view" : "view_column"} className="!text-[16px]" filled={view === v} />
                  {v === "grid" ? "Grid" : "Lanes"}
                </button>
              ))}
            </div>
            {/* New button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openForm(null)}
              className="flex items-center gap-2 bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[var(--color-accent-primary)]/20 transition-all"
            >
              <MI name="add" className="!text-[18px]" />
              New Post
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", val: stats.total, icon: "campaign", accent: "var(--color-accent-primary)", bg: "rgba(173,198,255,0.06)" },
          { label: "Urgent", val: stats.urgent, icon: "priority_high", accent: "#e85d75", bg: "rgba(232,93,117,0.06)" },
          { label: "Pinned", val: stats.pinned, icon: "push_pin", accent: "#8E5BB5", bg: "rgba(142,91,181,0.06)" },
          { label: "Passed", val: stats.passed, icon: "schedule", accent: "#ffb595", bg: "rgba(255,181,149,0.06)" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeSlide}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ ...glassCard, background: stat.bg }}
          >
            <div className="absolute top-3 right-3 opacity-[0.08]">
              <MI name={stat.icon} className="!text-[40px]" filled style={{ color: stat.accent }} />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2" style={{ color: stat.accent }}>
              {stat.label}
            </p>
            <h3 className="text-3xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
              <AnimatedCounter value={stat.val} duration={800} />
            </h3>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Search & Filters ── */}
      <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <MI name="search" className="absolute left-3 top-1/2 -translate-y-1/2 !text-[18px] text-[var(--color-text-muted)]" />
          <input
            type="text" placeholder="Search announcements..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-default)]/30 rounded-xl bg-[var(--color-bg-surface)]/80 text-sm outline-none focus:border-[var(--color-accent-primary)]/50 backdrop-blur-sm transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === f
                  ? "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] border-[var(--color-text-primary)] shadow-md"
                  : "bg-[var(--color-bg-surface)]/60 border-[var(--color-border-default)]/30 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-default)]/60 backdrop-blur-sm"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sort} onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border-default)]/30 rounded-xl bg-[var(--color-bg-surface)]/80 text-sm outline-none cursor-pointer backdrop-blur-sm"
        >
          <option value="pinned">Pinned first</option>
          <option value="newest">Newest first</option>
          <option value="premiere">Premiere date</option>
          <option value="urgent">Urgent first</option>
        </select>
      </motion.div>

      {/* ── Main Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view + sort + filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-8 flex-1"
        >
          {view === "grid" ? (
            <>
              {heroItem && (
                <HeroCard
                  item={heroItem}
                  onEdit={openForm} onDelete={setDeleteTarget}
                  isCommentActive={activeCommentId === heroItem.id}
                  toggleComments={setActiveCommentId}
                  getDueState={getDueState} getInitials={getInitials}
                  formatViews={formatViews} addToast={addToast}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {gridItems.map((item, idx) => (
                    <motion.div
                      layout key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.06, 0.4) }}
                    >
                      <StandardCard
                        compact={false} item={item}
                        onEdit={openForm} onDelete={setDeleteTarget}
                        isCommentActive={activeCommentId === item.id}
                        toggleComments={setActiveCommentId}
                        getDueState={getDueState} getInitials={getInitials}
                        formatViews={formatViews}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.div
              className="flex flex-col gap-10 overflow-hidden relative"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              {(Object.keys(CATEGORY_MAP) as Category[]).map((catName, catIdx) => {
                const laneItems = filtered.filter(f => f.category === catName);
                if (laneItems.length === 0) return null;
                const laneMeta = CATEGORY_MAP[catName];
                return (
                  <motion.div
                    key={catName}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: catIdx * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3 pl-1">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${laneMeta.color}15` }}>
                        <MI name={laneMeta.icon} className="!text-[18px]" filled style={{ color: laneMeta.color }} />
                      </div>
                      <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                        {laneMeta.heading}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ background: `${laneMeta.color}12`, color: laneMeta.color }}>
                        {laneItems.length}
                      </span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-fade">
                      {laneItems.map((item, idx) => (
                        <motion.div
                          layout key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: Math.min(idx * 0.06, 0.4) }}
                          className="shrink-0 snap-start"
                        >
                          <StandardCard
                            compact={true} item={item}
                            onEdit={openForm} onDelete={setDeleteTarget}
                            isCommentActive={activeCommentId === item.id}
                            toggleComments={setActiveCommentId}
                            getDueState={getDueState} getInitials={getInitials}
                            formatViews={formatViews}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Comment Panel ── */}
      <AnimatePresence>
        {activeCommentId && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-[calc(100%-2rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-40"
            style={glassCard}
          >
            <div className="px-5 py-3.5 border-b border-[var(--color-border-default)]/20 flex justify-between items-center bg-[var(--color-bg-primary)]/60">
              <div className="flex items-center gap-2.5">
                <MI name="forum" className="!text-[18px] text-[var(--color-accent-primary)]" filled />
                <span className="font-bold text-sm text-[var(--color-text-primary)]">
                  {announcements.find(a => a.id === activeCommentId)?.title.substring(0, 40)}...
                </span>
              </div>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                onClick={() => setActiveCommentId(null)}
              >
                <MI name="close" className="!text-[16px]" />
              </button>
            </div>
            <div className="p-4 max-h-[35vh] overflow-y-auto flex flex-col gap-3.5 scroll-fade">
              {announcements.find(a => a.id === activeCommentId)?.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-accent-blue)]">
                    {getInitials(c.author)}
                  </div>
                  <div className="flex-1 bg-[var(--color-bg-surface)]/60 border border-[var(--color-border-default)]/20 p-3 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-[var(--color-text-primary)]">{c.author}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{c.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap">{c.text}</p>
                  </div>
                </div>
              ))}
              {announcements.find(a => a.id === activeCommentId)?.comments.length === 0 && (
                <div className="text-center py-8">
                  <MI name="chat_bubble_outline" className="!text-[32px] text-[var(--color-text-muted)]/30 mb-2 block mx-auto" />
                  <p className="text-sm text-[var(--color-text-muted)]">No comments yet. Be the first!</p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-[var(--color-border-default)]/20 flex gap-3 items-end bg-[var(--color-bg-surface)]/40">
              <textarea
                value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="flex-1 p-3 border border-[var(--color-border-default)]/20 rounded-xl outline-none bg-[var(--color-bg-primary)]/60 focus:border-[var(--color-accent-primary)]/40 text-sm resize-none backdrop-blur-sm transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={postComment}
                className="bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-accent-primary)]/20 shrink-0"
              >
                Post
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create/Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-full overflow-y-auto flex flex-col rounded-2xl shadow-2xl"
              style={glassCard}
            >
              <div className="sticky top-0 p-5 border-b border-[var(--color-border-default)]/20 flex justify-between items-center z-10 bg-[var(--color-bg-surface)]/90 backdrop-blur-xl rounded-t-2xl">
                <h2 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                  {editId ? "Edit Announcement" : "New Announcement"}
                </h2>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors" onClick={() => setModalOpen(false)}>
                  <MI name="close" className="!text-[18px]" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Name" value={formName} onChange={setFormName} />
                  <FormSelect label="Role" value={formRole} onChange={setFormRole} options={["Editor", "Admin"]} />
                </div>
                <FormInput label="Title" value={formTitle} onChange={setFormTitle} placeholder="Announcement title" />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Poster Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map(e => (
                      <button key={e} onClick={() => setFormEmoji(e)} className={`w-11 h-11 text-2xl flex items-center justify-center rounded-xl border transition-all ${formEmoji === e ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 shadow-sm' : 'border-[var(--color-border-default)]/30 hover:bg-[var(--color-bg-hover)]'}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Message</label>
                  <textarea value={formBody} onChange={e => setFormBody(e.target.value)} rows={4} className="w-full p-3 text-sm border border-[var(--color-border-default)]/30 rounded-xl outline-none focus:border-[var(--color-accent-primary)]/50 bg-[var(--color-bg-surface)]/60 backdrop-blur-sm resize-y transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect label="Category" value={formCategory} onChange={(v: string) => setFormCategory(v as Category)} options={["Premiere", "Trailer drop", "Movie news", "Event"]} />
                  <FormSelect label="Audience" value={formAudience} onChange={setFormAudience} options={["Everyone", "Members only", "Press & media", "VIP"]} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput type="date" label="Date (Optional)" value={formDate} onChange={setFormDate} />
                  <FormSelect label="Priority" value={formPriority} onChange={setFormPriority} options={["Normal", "Urgent"]} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect label="Pin to top" value={formPinned} onChange={setFormPinned} options={[{val: "false", label: "No"}, {val: "true", label: "Yes"}]} />
                  <FormInput label="Attachment (Optional)" value={formAttachment} onChange={setFormAttachment} placeholder="e.g. poster.jpg" />
                </div>
              </div>
              <div className="sticky bottom-0 p-5 border-t border-[var(--color-border-default)]/20 flex justify-end gap-3 z-10 bg-[var(--color-bg-surface)]/90 backdrop-blur-xl rounded-b-2xl">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm border border-[var(--color-border-default)]/30 hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)]">Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={submitForm}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] shadow-lg shadow-[var(--color-accent-primary)]/20"
                >
                  {editId ? "Update" : "Publish"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden flex flex-col rounded-2xl shadow-2xl"
              style={glassCard}
            >
              <div className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e85d75]/10 flex items-center justify-center shrink-0">
                  <MI name="delete_forever" className="!text-[20px] text-[#e85d75]" filled />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-base text-[var(--color-text-primary)]">Delete announcement?</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <div className="px-5 pb-5 flex justify-end gap-3">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border border-[var(--color-border-default)]/30 rounded-xl font-bold text-sm hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)]">Cancel</button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#e85d75] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#e85d75]/20"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-6 right-6 z-[100] px-5 py-3.5 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-3"
            style={{
              ...glassCard,
              borderLeft: `3px solid ${toast.type === 'success' ? '#82dab0' : '#ffb595'}`,
            }}
          >
            <MI
              name={toast.type === 'success' ? 'check_circle' : 'warning'}
              className="!text-[18px]"
              filled
              style={{ color: toast.type === 'success' ? '#82dab0' : '#ffb595' }}
            />
            <span className="text-[var(--color-text-primary)]">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════ */

function StandardCard({ compact, item, onEdit, onDelete, isCommentActive, toggleComments, getDueState, getInitials, formatViews }: CardProps & { compact?: boolean }) {
  const cat = CATEGORY_MAP[item.category as Category];
  const uiColor = item.urgent ? "#e85d75" : cat.color;
  const due = getDueState(item.dueDate);

  return (
    <SpotlightCard className={`!rounded-2xl group ${compact ? 'w-[280px]' : ''}`}>
      <div className={`flex flex-col overflow-hidden relative h-full ${compact ? 'h-[370px]' : ''}`}>
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-20"
          style={{ background: `linear-gradient(90deg, ${uiColor}, ${uiColor}60)` }} />

        {/* Emoji hero area */}
        <div
          className={`flex items-center justify-center relative overflow-hidden shrink-0 ${compact ? 'h-[100px]' : 'h-[110px]'}`}
          style={{ background: cat.gradient }}
        >
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ background: `radial-gradient(circle at 50% 50%, ${uiColor}, transparent 70%)` }} />
          <motion.span
            className="drop-shadow-lg z-10"
            style={{ fontSize: compact ? '2.5rem' : '3rem' }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {item.emoji}
          </motion.span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-2 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md tracking-wide"
                style={{ background: `${uiColor}12`, color: uiColor, border: `1px solid ${uiColor}18` }}>
                {item.category}
              </span>
              {item.urgent && (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-[#e85d75] text-white flex items-center gap-1">
                  <MI name="priority_high" className="!text-[10px]" /> Urgent
                </span>
              )}
              {item.pinned && (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-[#8E5BB5] text-white flex items-center gap-1">
                  <MI name="push_pin" className="!text-[10px]" filled /> Pinned
                </span>
              )}
            </div>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
              <button onClick={() => onEdit(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-hover)] transition-colors">
                <MI name="edit" className="!text-[14px] text-[var(--color-text-muted)]" />
              </button>
              <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#e85d75]/10 transition-colors">
                <MI name="delete" className="!text-[14px] text-[var(--color-text-muted)] hover:text-[#e85d75]" />
              </button>
            </div>
          </div>
          <h4 className={`font-[family-name:var(--font-display)] font-bold text-[15px] text-[var(--color-text-primary)] leading-snug mt-1 ${compact ? 'line-clamp-2' : ''}`}>
            {item.title}
          </h4>
          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">{item.body}</p>

          <div className="mt-auto pt-3 flex flex-col gap-2">
            {item.attachment && (
              <div className="text-[11px] font-bold flex items-center gap-1.5 text-[var(--color-accent-blue)]">
                <MI name="attach_file" className="!text-[13px]" /> {item.attachment}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {due && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md" style={{ background: due.bg, color: due.color }}>
                  {due.label}
                </span>
              )}
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[var(--color-bg-elevated)]/60 text-[var(--color-text-muted)]">
                {item.audience}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--color-border-default)]/15 flex justify-between items-center bg-[var(--color-bg-primary)]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full flex justify-center items-center text-[9px] font-bold text-white"
              style={{ background: `${uiColor}80` }}>
              {getInitials(item.author)}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold leading-none text-[var(--color-text-primary)]">{item.author}</span>
              <span className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{item.datePosted}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleComments(isCommentActive ? null : item.id)}
              className={`text-xs flex items-center gap-1 font-bold transition-colors ${isCommentActive ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              <MI name="chat_bubble" className="!text-[13px]" filled={isCommentActive} />
              {item.comments.length}
            </button>
            <span className="text-xs flex items-center gap-1 font-bold text-[var(--color-text-muted)]">
              <MI name="visibility" className="!text-[13px]" /> {formatViews(item.views)}
            </span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function HeroCard({ item, onEdit, onDelete, isCommentActive, toggleComments, getDueState, getInitials, formatViews, addToast }: HeroCardProps) {
  const cat = CATEGORY_MAP[item.category as Category];
  const uiColor = item.urgent ? "#e85d75" : cat.color;
  const due = getDueState(item.dueDate);

  return (
    <motion.div variants={fadeUp}>
      <SpotlightCard className="!rounded-2xl group">
        <div className="flex flex-col sm:flex-row overflow-hidden relative">
          {/* Left accent gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] z-20 hidden sm:block"
            style={{ background: `linear-gradient(180deg, ${uiColor}, ${uiColor}40)` }} />

          {/* Emoji area */}
          <div className="sm:w-[160px] h-[130px] sm:h-auto flex items-center justify-center relative overflow-hidden shrink-0"
            style={{ background: cat.gradient }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ background: `radial-gradient(circle at 50% 50%, ${uiColor}, transparent 70%)` }} />
            <motion.span
              className="drop-shadow-lg z-10 text-6xl"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {item.emoji}
            </motion.span>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3 relative sm:pl-7">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <MI name="star" className="!text-[14px] text-[var(--color-accent-amber)]" filled />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Featured Spotlight</span>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                <button onClick={() => onEdit(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-hover)] transition-colors">
                  <MI name="edit" className="!text-[14px] text-[var(--color-text-muted)]" />
                </button>
                <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#e85d75]/10 transition-colors">
                  <MI name="delete" className="!text-[14px] text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md tracking-wide"
                style={{ background: `${uiColor}12`, color: uiColor, border: `1px solid ${uiColor}18` }}>
                {item.category}
              </span>
              {item.urgent && (
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#e85d75] text-white">Urgent</span>
              )}
              {item.pinned && (
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#8E5BB5] text-white flex items-center gap-1">
                  <MI name="push_pin" className="!text-[10px]" filled /> Pinned
                </span>
              )}
            </div>

            <h2 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] leading-snug">
              {item.title}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 max-w-3xl leading-relaxed">{item.body}</p>

            <div className="mt-3 pt-3 border-t border-[var(--color-border-default)]/15 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {due && (
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-md" style={{ background: due.bg, color: due.color }}>
                    {due.label}
                  </span>
                )}
                <div className="flex items-center gap-2 pr-3 border-r border-[var(--color-border-default)]/20">
                  <div className="w-6 h-6 rounded-full flex justify-center items-center text-[9px] font-bold text-white"
                    style={{ background: `${uiColor}80` }}>
                    {getInitials(item.author)}
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                    {item.author} <span className="opacity-40 font-normal">· {item.datePosted}</span>
                  </span>
                </div>
                <button
                  onClick={() => toggleComments(isCommentActive ? null : item.id)}
                  className={`text-xs flex items-center gap-1.5 font-bold transition-colors ${isCommentActive ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
                >
                  <MI name="chat_bubble" className="!text-[14px]" filled={isCommentActive} /> {item.comments.length}
                </button>
                <span className="text-xs flex items-center gap-1.5 font-bold text-[var(--color-text-muted)]">
                  <MI name="visibility" className="!text-[14px]" /> {formatViews(item.views)}
                </span>
              </div>
              {item.attachment && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToast(`Opening ${item.attachment}...`, "success")}
                  className="bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
                >
                  <MI name="open_in_new" className="!text-[14px]" />
                  View material
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function FormInput({ label, value, onChange, type = "text", placeholder = "" }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">{label}</label>
      <input
        type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3.5 py-2.5 text-sm border border-[var(--color-border-default)]/30 rounded-xl outline-none bg-[var(--color-bg-surface)]/60 focus:border-[var(--color-accent-primary)]/50 w-full backdrop-blur-sm transition-colors"
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">{label}</label>
      <select
        value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="px-3.5 py-2.5 text-sm border border-[var(--color-border-default)]/30 rounded-xl outline-none bg-[var(--color-bg-surface)]/60 w-full focus:border-[var(--color-accent-primary)]/50 cursor-pointer backdrop-blur-sm transition-colors"
      >
        {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.val} value={o.val}>{o.label}</option>)}
      </select>
    </div>
  );
}
