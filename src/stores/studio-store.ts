import { create } from "zustand";
import type { Movie, User, Asset, Comment, Activity } from "@/lib/studio-types";
import { INIT_MOVIES, INIT_USERS, INIT_ACTIVITIES, INIT_ASSETS, INIT_COMMENTS } from "@/lib/studio-data";

interface StudioState {
  // ── Core data ──
  movies: Movie[];
  users: User[];
  activities: Activity[];
  assets: Asset[];
  comments: Comment[];

  // ── UI state ──
  selectedMovie: Movie | null;
  editingMovie: Movie | null;
  promoMovie: Movie;
  showMovieModal: boolean;
  showUserModal: boolean;
  showRoleInfo: boolean;
  filterStatus: string;
  assetFilter: string;
  calMonth: number;
  toast: string | null;

  // ── Task state ──
  taskAssignments: Record<string, string>;
  taskChecked: Record<string, boolean>;

  // ── Comment state ──
  newComment: string;
  commentMovie: string;
  replyText: Record<number, string>;
  showReply: number | null;

  // ── Form state ──
  newMovie: { title: string; genre: string; status: string; budget: number; releaseDate: string; poster: string };
  newUser: { name: string; email: string; role: string };
  showPosterPicker: boolean;

  // ── Setters ──
  setSelectedMovie: (movie: Movie | null) => void;
  setEditingMovie: (movie: Movie | null | ((m: Movie | null) => Movie | null)) => void;
  setPromoMovie: (movie: Movie) => void;
  setShowMovieModal: (open: boolean) => void;
  setShowUserModal: (open: boolean) => void;
  setShowRoleInfo: (open: boolean) => void;
  setFilterStatus: (status: string) => void;
  setAssetFilter: (filter: string) => void;
  setCalMonth: (month: number | ((m: number) => number)) => void;
  setNewComment: (text: string) => void;
  setCommentMovie: (movie: string) => void;
  setReplyText: (update: Record<number, string> | ((prev: Record<number, string>) => Record<number, string>)) => void;
  setShowReply: (id: number | null) => void;
  setNewMovie: (update: typeof INIT_NEW_MOVIE | ((prev: typeof INIT_NEW_MOVIE) => typeof INIT_NEW_MOVIE)) => void;
  setNewUser: (update: { name: string; email: string; role: string } | ((prev: { name: string; email: string; role: string }) => { name: string; email: string; role: string })) => void;
  setShowPosterPicker: (open: boolean | ((prev: boolean) => boolean)) => void;

  // ── Actions ──
  handleAddMovie: () => void;
  handleEditMovie: () => void;
  handleDeleteMovie: (id: number) => void;
  handleAddUser: () => void;
  toggleTask: (stepId: number, taskIdx: number, stepTask: string) => void;
  assignTask: (stepId: number, taskIdx: number, userId: string, stepTask: string) => void;
  addComment: () => void;
  addReply: (commentId: number) => void;
  approveAsset: (assetId: number) => void;

  // ── Derived ──
  filteredMovies: () => Movie[];
  totalBudget: () => number;
  totalSpent: () => number;
  totalRevenue: () => number;
  releasedMovies: () => Movie[];
  avgRating: () => string;
}

const INIT_NEW_MOVIE = { title: "", genre: "Action", status: "Pre-Production", budget: 50, releaseDate: "", poster: "🎬" };

function showToast(set: (fn: (s: StudioState) => Partial<StudioState>) => void, msg: string) {
  set(() => ({ toast: msg }));
  setTimeout(() => set(() => ({ toast: null })), 3000);
}

function addActivity(set: (fn: (s: StudioState) => Partial<StudioState>) => void, user: string, action: string, target: string, type: string, icon: string) {
  set((s) => ({
    activities: [{ id: Date.now(), user, action, target, type, time: "Just now", icon }, ...s.activities].slice(0, 20),
  }));
}

export const useStudioStore = create<StudioState>((set, get) => ({
  // ── Core data ──
  movies: INIT_MOVIES,
  users: INIT_USERS,
  activities: INIT_ACTIVITIES,
  assets: INIT_ASSETS,
  comments: INIT_COMMENTS,

  // ── UI state ──
  selectedMovie: null,
  editingMovie: null,
  promoMovie: INIT_MOVIES[0]!,
  showMovieModal: false,
  showUserModal: false,
  showRoleInfo: false,
  filterStatus: "all",
  assetFilter: "all",
  calMonth: 3,
  toast: null,

  // ── Task state ──
  taskAssignments: {},
  taskChecked: {},

  // ── Comment state ──
  newComment: "",
  commentMovie: "Crimson Horizon",
  replyText: {},
  showReply: null,

  // ── Form state ──
  newMovie: INIT_NEW_MOVIE,
  newUser: { name: "", email: "", role: "director" },
  showPosterPicker: false,

  // ── Setters ──
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setEditingMovie: (movie) => set((s) => ({
    editingMovie: typeof movie === "function" ? movie(s.editingMovie) : movie,
  })),
  setPromoMovie: (movie) => set({ promoMovie: movie }),
  setShowMovieModal: (open) => set({ showMovieModal: open }),
  setShowUserModal: (open) => set({ showUserModal: open }),
  setShowRoleInfo: (open) => set({ showRoleInfo: open }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setAssetFilter: (filter) => set({ assetFilter: filter }),
  setCalMonth: (month) => set((s) => ({
    calMonth: typeof month === "function" ? month(s.calMonth) : month,
  })),
  setNewComment: (text) => set({ newComment: text }),
  setCommentMovie: (movie) => set({ commentMovie: movie }),
  setReplyText: (update) => set((s) => ({
    replyText: typeof update === "function" ? update(s.replyText) : update,
  })),
  setShowReply: (id) => set({ showReply: id }),
  setNewMovie: (update) => set((s) => ({
    newMovie: typeof update === "function" ? update(s.newMovie) : update,
  })),
  setNewUser: (update) => set((s) => ({
    newUser: typeof update === "function" ? update(s.newUser) : update,
  })),
  setShowPosterPicker: (open) => set((s) => ({
    showPosterPicker: typeof open === "function" ? open(s.showPosterPicker) : open,
  })),

  // ── Actions ──
  handleAddMovie: () => {
    const s = get();
    if (!s.newMovie.title || !s.newMovie.releaseDate) return;
    const m: Movie = {
      ...s.newMovie,
      id: Date.now(),
      spent: 0,
      revenue: 0,
      rating: 0,
      promoStep: 1,
      audience: { male: 50, female: 45, other: 5 },
      ageGroups: { "18-24": 25, "25-34": 35, "35-44": 25, "45+": 15 },
      campaignSpend: { social: 0, press: 0, digital: 0, events: 0 },
      campaignResults: { social: 0, press: 0, digital: 0, events: 0 },
    };
    set((prev) => ({ movies: [...prev.movies, m], showMovieModal: false, newMovie: INIT_NEW_MOVIE }));
    addActivity(set, "You", "created new project", m.title, "project", "🎬");
    showToast(set, `"${m.title}" added to portfolio`);
  },

  handleEditMovie: () => {
    const s = get();
    if (!s.editingMovie) return;
    set((prev) => ({
      movies: prev.movies.map((m) => (m.id === s.editingMovie!.id ? s.editingMovie! : m)),
      editingMovie: null,
    }));
    addActivity(set, "You", "updated details for", s.editingMovie.title, "edit", "✏️");
    showToast(set, `"${s.editingMovie.title}" updated`);
  },

  handleDeleteMovie: (id) => {
    const s = get();
    const m = s.movies.find((x) => x.id === id);
    set((prev) => ({
      movies: prev.movies.filter((x) => x.id !== id),
      selectedMovie: prev.selectedMovie?.id === id ? null : prev.selectedMovie,
    }));
    addActivity(set, "You", "archived project", m?.title ?? "", "delete", "🗑️");
    showToast(set, `"${m?.title}" removed`);
  },

  handleAddUser: () => {
    const s = get();
    if (!s.newUser.name || !s.newUser.email) return;
    const avatar = s.newUser.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    set((prev) => ({
      users: [...prev.users, { id: Date.now(), ...s.newUser, avatar, active: true, lastActive: "Just now" }],
      showUserModal: false,
      newUser: { name: "", email: "", role: "director" },
    }));
    addActivity(set, "You", "added team member", s.newUser.name, "user", "👤");
    showToast(set, `${s.newUser.name} added to team`);
  },

  toggleTask: (stepId, taskIdx, stepTask) => {
    const s = get();
    const key = `${s.promoMovie.id}-${stepId}-${taskIdx}`;
    set((prev) => ({ taskChecked: { ...prev.taskChecked, [key]: !prev.taskChecked[key] } }));
    if (!s.taskChecked[key]) {
      addActivity(set, "You", `completed "${stepTask}" for`, s.promoMovie.title, "task", "✓");
    }
  },

  assignTask: (stepId, taskIdx, userId, stepTask) => {
    const s = get();
    const key = `${s.promoMovie.id}-${stepId}-${taskIdx}`;
    set((prev) => ({ taskAssignments: { ...prev.taskAssignments, [key]: userId } }));
    const user = s.users.find((u) => u.id === parseInt(userId));
    if (user) addActivity(set, "You", `assigned "${stepTask}" to ${user.name} for`, s.promoMovie.title, "assign", "👤");
  },

  addComment: () => {
    const s = get();
    if (!s.newComment.trim()) return;
    set((prev) => ({
      comments: [{ id: Date.now(), movie: s.commentMovie, user: "You", text: s.newComment, time: "Just now", replies: [] }, ...prev.comments],
      newComment: "",
    }));
    addActivity(set, "You", "commented on", s.commentMovie, "comment", "💬");
  },

  addReply: (commentId) => {
    const s = get();
    const txt = s.replyText[commentId];
    if (!txt?.trim()) return;
    set((prev) => ({
      comments: prev.comments.map((c) => c.id === commentId ? { ...c, replies: [...c.replies, { user: "You", text: txt, time: "Just now" }] } : c),
      replyText: { ...prev.replyText, [commentId]: "" },
      showReply: null,
    }));
  },

  approveAsset: (assetId) => {
    const s = get();
    const a = s.assets.find((x) => x.id === assetId);
    set((prev) => ({
      assets: prev.assets.map((asset) => asset.id === assetId ? { ...asset, status: "approved" } : asset),
    }));
    addActivity(set, "You", `approved "${a?.name}" for`, a?.movie ?? "", "approval", "✅");
    showToast(set, `"${a?.name}" approved`);
  },

  // ── Derived (as functions for freshness) ──
  filteredMovies: () => {
    const s = get();
    return s.filterStatus === "all" ? s.movies : s.movies.filter((m) => m.status === s.filterStatus);
  },
  totalBudget: () => get().movies.reduce((s, m) => s + m.budget, 0),
  totalSpent: () => get().movies.reduce((s, m) => s + m.spent, 0),
  totalRevenue: () => get().movies.reduce((s, m) => s + m.revenue, 0),
  releasedMovies: () => get().movies.filter((m) => m.rating > 0),
  avgRating: () => {
    const released = get().movies.filter((m) => m.rating > 0);
    return released.length
      ? (released.reduce((s, m) => s + m.rating, 0) / released.length).toFixed(1)
      : "—";
  },
}));
