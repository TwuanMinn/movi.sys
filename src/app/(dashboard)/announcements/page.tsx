"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnnouncementStore, Announcement, Category } from "@/stores/announcement-store";
import { useUIStore } from "@/stores/ui-store";

const EMOJI_OPTIONS = ["🎬", "🎥", "🍿", "🏆", "🌟", "🎭", "🦸", "🚀"];
const FILTERS = ["All", "Premieres", "Trailers", "Movie news", "Events", "Urgent", "Pinned"];

const CATEGORY_MAP: Record<Category, { color: string; laneId: string; heading: string }> = {
  "Premiere": { color: "#534AB7", laneId: "premiere", heading: "🚀 Premieres" },
  "Trailer drop": { color: "#0F6E56", laneId: "trailer", heading: "🎥 Trailer drops" },
  "Movie news": { color: "#185FA5", laneId: "news", heading: "🦸 Movie news" },
  "Event": { color: "#993C1D", laneId: "event", heading: "🏆 Events & screenings" }
};

export default function PromotionPage() {
  const store = useAnnouncementStore();
  const announcements = store.announcements;
  
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);
  const addToast = (msg: string, type: string = "success") => {
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
    let result = announcements.filter(item => {
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
    let totals = { total: announcements.length, urgent: 0, pinned: 0, passed: 0 };
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
    if (diffDays < 0) return { label: "Passed", color: "var(--color-danger)", bg: "var(--color-danger-muted)" };
    if (diffDays <= 3) return { label: `In ${diffDays}d`, color: "var(--color-warning)", bg: "var(--color-warning-muted)" };
    return { label: new Date(dateStr).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), color: "var(--color-success)", bg: "var(--color-success-muted)" };
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const formatViews = (num: number) => num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : num;

  const openForm = (id: string | null = null) => {
    let item = id ? announcements.find(d => d.id === id) : null;
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

  // Check if we should render hero spotlight
  const canShowHero = view === 'grid' && sort === 'pinned' && filtered.length > 0 && filtered[0]?.pinned;
  const gridItems = canShowHero ? filtered.slice(1) : filtered;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 max-w-7xl mx-auto w-full gap-8 relative pb-32">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 font-[family-name:var(--font-display)]">🎬 Movie announcements</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-[var(--radius-sm)] border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-bg-surface)]">
            <button 
              onClick={() => setView("grid")} 
              className={`px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'grid' ? 'bg-[var(--color-accent-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}
            >Grid</button>
            <button 
              onClick={() => setView("swimlanes")} 
              className={`px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'swimlanes' ? 'bg-[var(--color-accent-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}
            >Swimlanes</button>
          </div>
          <button 
            onClick={() => openForm(null)}
            className="flex items-center gap-2 bg-[var(--color-accent-primary)] text-white px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          >+ New</button>
        </div>
      </div>

      {/* Stats row with counter animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total" val={stats.total} color="var(--color-text-primary)" />
        <StatTile label="Urgent" val={stats.urgent} color="#D85A30" />
        <StatTile label="Pinned" val={stats.pinned} color="#534AB7" />
        <StatTile label="Passed" val={stats.passed} color="var(--color-danger)" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <input 
          type="text" placeholder="Search announcements..." 
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] text-sm outline-none focus:border-[var(--color-accent-primary)]"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${filter === f ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] border-[var(--color-text-primary)]' : 'bg-[var(--color-bg-surface)] border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <select 
          value={sort} onChange={e => setSort(e.target.value)}
          className="px-3 py-2 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] text-sm outline-none cursor-pointer"
        >
          <option value="pinned">Pinned first</option>
          <option value="newest">Newest first</option>
          <option value="premiere">Premiere date</option>
          <option value="urgent">Urgent first</option>
        </select>
      </div>

      {/* Main Content View Switcher */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={view + sort + filter} // trigger animation on structural change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-8 flex-1"
        >
          {view === "grid" ? (
            <>
              {canShowHero && <HeroCard item={filtered[0]} onEdit={openForm} onDelete={setDeleteTarget} isCommentActive={activeCommentId===filtered[0].id} toggleComments={setActiveCommentId} getDueState={getDueState} getInitials={getInitials} formatViews={formatViews} addToast={addToast} />}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {gridItems.map((item, idx) => (
                    <motion.div layout key={item.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.95}} transition={{duration:0.3, delay: Math.min(idx*0.05, 0.4)}}>
                      <StandardCard compact={false} item={item} onEdit={openForm} onDelete={setDeleteTarget} isCommentActive={activeCommentId===item.id} toggleComments={setActiveCommentId} getDueState={getDueState} getInitials={getInitials} formatViews={formatViews} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-10 overflow-hidden relative">
              {Object.keys(CATEGORY_MAP).map((catName) => {
                const laneItems = filtered.filter(f => f.category === catName);
                if (laneItems.length === 0) return null;
                const laneMeta = CATEGORY_MAP[catName as Category];
                return (
                  <div key={catName} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 pl-1">
                      <h3 className="text-xl font-bold">{laneMeta.heading}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-bg-elevated)] text-xs font-semibold text-[var(--color-text-secondary)]">{laneItems.length}</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                      {laneItems.map((item, idx) => (
                        <motion.div layout key={item.id} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, scale:0.95}} transition={{duration:0.3, delay: Math.min(idx*0.05, 0.4)}} className="shrink-0 snap-start">
                          <StandardCard compact={true} item={item} onEdit={openForm} onDelete={setDeleteTarget} isCommentActive={activeCommentId===item.id} toggleComments={setActiveCommentId} getDueState={getDueState} getInitials={getInitials} formatViews={formatViews} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Comment Panel */}
      <AnimatePresence>
        {activeCommentId && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-0 mt-8 mb-4 max-w-5xl self-center w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-2xl overflow-hidden flex flex-col z-40"
          >
            <div className="p-4 border-b border-[var(--color-border-default)] flex justify-between items-center bg-[var(--color-bg-primary)]">
              <span className="font-bold text-sm">💬 Comments on "{announcements.find(a=>a.id===activeCommentId)?.title.substring(0, 40)}..."</span>
              <button className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] px-2 rounded" onClick={() => setActiveCommentId(null)}>✕</button>
            </div>
            <div className="p-4 max-h-[40vh] overflow-y-auto flex flex-col gap-4 bg-[var(--color-bg-elevated)]">
              {announcements.find(a=>a.id===activeCommentId)?.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[#185FA5] flex items-center justify-center text-[10px] font-bold text-white">{getInitials(c.author)}</div>
                  <div className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs">{c.author}</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">{c.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
                  </div>
                </div>
              ))}
              {announcements.find(a=>a.id===activeCommentId)?.comments.length === 0 && (
                <div className="text-center italic text-sm text-[var(--color-text-secondary)] py-6">No comments yet. Be the first!</div>
              )}
            </div>
            <div className="p-4 border-t border-[var(--color-border-default)] flex flex-col gap-3 bg-[var(--color-bg-surface)]">
              <textarea 
                value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..." 
                className="w-full min-h-[80px] p-3 border border-[var(--color-border-default)] rounded-md outline-none bg-[var(--color-bg-primary)] focus:border-[var(--color-accent-primary)] text-sm resize-y"
              />
              <div className="flex justify-end">
                <button onClick={postComment} className="bg-[var(--color-accent-primary)] text-white px-5 py-2 rounded-md font-semibold text-sm hover:opacity-90">Post</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto flex flex-col"
            >
              <div className="sticky top-0 bg-[var(--color-bg-surface)] p-5 border-b border-[var(--color-border-default)] flex justify-between items-center z-10">
                <h2 className="text-lg font-bold">{editId ? "Edit Announcement" : "New Announcement"}</h2>
                <button className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] rounded" onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Name" value={formName} onChange={setFormName} />
                  <FormSelect label="Role" value={formRole} onChange={setFormRole} options={["Editor", "Admin"]} />
                </div>
                <FormInput label="Title" value={formTitle} onChange={setFormTitle} placeholder="Announcement title" />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)]">Poster Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map(e => (
                      <button key={e} onClick={() => setFormEmoji(e)} className={`w-11 h-11 text-2xl flex items-center justify-center rounded-md border transition-all ${formEmoji===e ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)]'}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)]">Message</label>
                  <textarea value={formBody} onChange={e=>setFormBody(e.target.value)} rows={4} className="w-full p-3 text-sm border border-[var(--color-border-default)] rounded-md outline-none focus:border-[var(--color-accent-primary)] bg-[var(--color-bg-surface)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect label="Category" value={formCategory} onChange={(v)=>setFormCategory(v as Category)} options={["Premiere", "Trailer drop", "Movie news", "Event"]} />
                  <FormSelect label="Audience" value={formAudience} onChange={setFormAudience} options={["Everyone", "Members only", "Press & media", "VIP"]} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput type="date" label="Date (Optional)" value={formDate} onChange={setFormDate} />
                  <FormSelect label="Priority" value={formPriority} onChange={setFormPriority} options={["Normal", "Urgent"]} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect label="Pin to top" value={formPinned} onChange={setFormPinned} options={[{val:"false", label:"No"}, {val:"true", label:"Yes"}]} />
                  <FormInput label="Attachment (Optional)" value={formAttachment} onChange={setFormAttachment} placeholder="e.g. poster.jpg" />
                </div>
              </div>
              <div className="sticky bottom-0 bg-[var(--color-bg-surface)] p-5 border-t border-[var(--color-border-default)] flex justify-end gap-3 z-10">
                <button onClick={()=>setModalOpen(false)} className="px-5 py-2 rounded-md font-semibold text-sm border border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] transition-colors">Cancel</button>
                <button onClick={submitForm} className="px-5 py-2 rounded-md font-semibold text-sm bg-[var(--color-accent-primary)] text-white hover:opacity-90">{editId ? "Update announcement" : "Post announcement"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-2xl relative w-full max-w-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-[var(--color-border-default)] text-base font-bold flex justify-between">Delete announcement? <button onClick={()=>setDeleteTarget(null)} className="text-[var(--color-text-muted)]">✕</button></div>
              <div className="p-5 text-sm text-[var(--color-text-secondary)]">This cannot be undone. All comments will also be permanently removed.</div>
              <div className="p-5 bg-[var(--color-bg-primary)] flex justify-end gap-3 border-t border-[var(--color-border-default)]">
                <button onClick={()=>setDeleteTarget(null)} className="px-4 py-2 border border-[var(--color-border-default)] rounded font-semibold text-sm hover:bg-[var(--color-bg-hover)]">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-[var(--color-danger)] text-white rounded font-semibold text-sm hover:opacity-90">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
            className={`fixed top-6 right-6 px-4 py-3 rounded-md shadow-lg border-l-4 z-[100] text-sm font-bold bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] ${toast.type === 'success' ? 'border-[var(--color-success)]' : 'border-[var(--color-warning)]'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--color-border-default); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ------------------------------
// Micro-Components
// ------------------------------

function StatTile({ label, val, color }: { label: string, val: number, color: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const dur = 600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - prog, 3)) * val));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [val]);
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-2 shadow-sm">
      <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</div>
      <motion.div key={val} initial={{scale:1.15}} animate={{scale:1}} className="text-3xl font-black" style={{ color }}>{display}</motion.div>
    </div>
  );
}

function StandardCard({ compact, item, onEdit, onDelete, isCommentActive, toggleComments, getDueState, getInitials, formatViews }: any) {
  const uiColor = item.urgent ? "#D85A30" : CATEGORY_MAP[item.category as Category].color;
  const due = getDueState(item.dueDate);
  return (
    <div className={`group flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] overflow-hidden relative transition-all hover:-translate-y-0.5 hover:shadow-lg ${compact ? 'w-[260px] h-[360px]' : 'h-full shrink-0'}`}>
      <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: uiColor }}></div>
      <div className={`flex items-center justify-center relative overflow-hidden bg-white/5 dark:bg-black/20 shrink-0 border-b border-[var(--color-border-subtle)] ${compact ? 'h-[100px] text-4xl' : 'h-[120px] text-5xl'}`}>
        <div className="absolute inset-0 opacity-10" style={{ background: uiColor }}></div>
        <span className="drop-shadow-md z-10">{item.emoji}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2 relative">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded" style={{ background: `${uiColor}15`, color: uiColor }}>{item.category}</span>
            {item.urgent && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#D85A30] text-white">Urgent</span>}
            {item.pinned && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#534AB7] text-white">Pinned</span>}
          </div>
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={()=>onEdit(item.id)} className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-xs">✏️</button>
            <button onClick={()=>onDelete(item.id)} className="p-1 hover:bg-[#D85A30]/10 hover:text-[#D85A30] rounded text-xs transition-colors">🗑️</button>
          </div>
        </div>
        <div className={`font-bold text-sm tracking-tight text-[var(--color-text-primary)] leading-snug mt-1 ${compact ? 'line-clamp-2' : ''}`}>{item.title}</div>
        <div className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">{item.body}</div>
        <div className="mt-auto pt-3 flex flex-col gap-2">
          {item.attachment && <div className="text-xs font-semibold text-[#185FA5] break-all">📎 {item.attachment}</div>}
          <div className="flex flex-wrap gap-1.5">
            {due && <span className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ background: due.bg, color: due.color }}>{due.label}</span>}
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]">{item.audience}</span>
          </div>
        </div>
      </div>
      <div className="p-3 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-subtle)] flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#185FA5] text-white flex justify-center items-center text-[8px] font-bold">{getInitials(item.author)}</div>
          <div className="flex flex-col"><span className="text-[10px] font-bold leading-none">{item.author}</span><span className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{item.datePosted}</span></div>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => toggleComments(item.id)} className={`text-xs flex items-center gap-1 font-semibold transition-colors ${isCommentActive ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>💬 {item.comments.length}</button>
          <span className="text-xs flex items-center gap-1 font-semibold text-[var(--color-text-secondary)]">👁 {formatViews(item.views)}</span>
        </div>
      </div>
    </div>
  );
}

function HeroCard({ item, onEdit, onDelete, isCommentActive, toggleComments, getDueState, getInitials, formatViews, addToast }: any) {
  const uiColor = item.urgent ? "#D85A30" : CATEGORY_MAP[item.category as Category].color;
  const due = getDueState(item.dueDate);
  
  return (
    <div className="flex flex-col sm:flex-row bg-[var(--color-bg-surface)] border-l-4 border-y border-r border-r-[var(--color-border-default)] border-y-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-md overflow-hidden relative group transition-all shrink-0" style={{ borderLeftColor: uiColor }}>
      <div className="sm:w-[140px] h-[120px] sm:h-auto border-b sm:border-b-0 sm:border-r border-[var(--color-border-subtle)] flex items-center justify-center text-6xl relative overflow-hidden bg-white/5 dark:bg-black/20 shrink-0">
         <div className="absolute inset-0 opacity-10" style={{ background: uiColor }}></div>
         <span className="drop-shadow-lg z-10">{item.emoji}</span>
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3 relative">
         <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Featured spotlight</span>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
              <button onClick={()=>onEdit(item.id)} className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-sm">✏️</button>
              <button onClick={()=>onDelete(item.id)} className="p-1 hover:bg-[#D85A30]/10 hover:text-[#D85A30] rounded text-sm transition-colors">🗑️</button>
            </div>
         </div>
         <div className="flex flex-wrap gap-1.5 mt-[-4px]">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded" style={{ background: `${uiColor}15`, color: uiColor }}>{item.category}</span>
            {item.urgent && <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#D85A30] text-white">Urgent</span>}
            {item.pinned && <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#534AB7] text-white">Pinned</span>}
         </div>
         <h2 className="text-xl font-bold text-[var(--color-text-primary)] leading-snug">{item.title}</h2>
         <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 max-w-3xl leading-relaxed">{item.body}</p>
         
         <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {due && <span className="px-2 py-1 text-[10px] font-bold rounded" style={{ background: due.bg, color: due.color }}>{due.label}</span>}
              <div className="flex items-center gap-2 pr-3 border-r border-[var(--color-border-subtle)]">
                <div className="w-5 h-5 rounded-full bg-[#185FA5] text-white flex justify-center items-center text-[9px] font-bold">{getInitials(item.author)}</div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{item.author} <span className="opacity-50">· {item.datePosted}</span></span>
              </div>
              <button onClick={() => toggleComments(item.id)} className={`text-xs flex items-center gap-1.5 font-bold transition-colors ${isCommentActive ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>💬 {item.comments.length}</button>
              <span className="text-xs flex items-center gap-1.5 font-bold text-[var(--color-text-secondary)]">👁 {formatViews(item.views)}</span>
            </div>
            {item.attachment && <button onClick={()=>addToast(`Opening ${item.attachment}...`, "success")} className="bg-[var(--color-accent-primary)] text-white text-xs font-bold px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90">View material</button>}
         </div>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type="text", placeholder="" }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[var(--color-text-secondary)]">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="px-3 py-2 text-sm border border-[var(--color-border-default)] rounded-md outline-none bg-[var(--color-bg-surface)] focus:border-[var(--color-accent-primary)] w-full" />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[var(--color-text-secondary)]">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} className="px-3 py-2 text-sm border border-[var(--color-border-default)] rounded-md outline-none bg-[var(--color-bg-surface)] w-full focus:border-[var(--color-accent-primary)] cursor-pointer">
        {options.map((o: any) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.val} value={o.val}>{o.label}</option>)}
      </select>
    </div>
  );
}
