import { create } from 'zustand';

export type Category = "Premiere" | "Trailer drop" | "Movie news" | "Event";

export interface Comment {
  id: string;
  author: string;
  time: string;
  text: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: Category;
  emoji: string;
  pinned: boolean;
  urgent: boolean;
  audience: string;
  dueDate: string;
  views: number;
  attachment: string;
  body: string;
  author: string;
  role: string;
  datePosted: string;
  createdAt: number;
  comments: Comment[];
}

interface AnnouncementState {
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'views' | 'comments' | 'datePosted' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addComment: (announcementId: string, author: string, text: string) => void;
}

const INITIAL_DATA: Announcement[] = [
  {
    id: "1",
    title: "Dune: Part Three — official premiere announced",
    category: "Premiere",
    emoji: "🚀",
    pinned: true,
    urgent: false,
    audience: "Everyone",
    dueDate: "2026-11-14",
    views: 3841,
    attachment: "dune3_poster.jpg",
    body: "Warner Bros. confirmed the worldwide premiere date.\nTimothée Chalamet and Zendaya attend the LA red carpet.\nPublic screening tickets go on sale Monday.",
    author: "Sarah Kim",
    role: "Editor",
    datePosted: "Apr 10",
    createdAt: 1712700000000,
    comments: [
      { id:"c1", author: "James Park", time: "Apr 10, 2:00 PM", text: "Cannot wait for this. Villeneuve is on another level." },
      { id:"c2", author: "Marie Dupont", time: "Apr 10, 3:15 PM", text: "Red carpet livestream confirmed on YouTube!" }
    ]
  },
  {
    id: "2",
    title: "Mission Impossible 8 — final trailer just dropped",
    category: "Trailer drop",
    emoji: "🎥",
    pinned: true,
    urgent: false,
    audience: "Everyone",
    dueDate: "2026-05-22",
    views: 12540,
    attachment: "mi8_trailer.mp4",
    body: "The final MI8 trailer is live. Tom Cruise does another\njaw-dropping stunt. Hits theaters this summer.",
    author: "James Park",
    role: "Editor",
    datePosted: "Apr 9",
    createdAt: 1712613600000,
    comments: [
      { id:"c3", author: "Sarah Kim", time: "Apr 9, 10:00 AM", text: "The motorcycle sequence looks absolutely insane." }
    ]
  },
  {
    id: "3",
    title: "Avengers: Secret Wars — casting confirmed by Marvel",
    category: "Movie news",
    emoji: "🦸",
    pinned: false,
    urgent: true,
    audience: "Everyone",
    dueDate: "",
    views: 28900,
    attachment: "",
    body: "Marvel confirmed leaked casting for Secret Wars including\nreturning characters and a major surprise cameo.",
    author: "Sarah Kim",
    role: "Editor",
    datePosted: "Apr 8",
    createdAt: 1712527200000,
    comments: [
      { id:"c4", author: "James Park", time: "Apr 8, 4:20 PM", text: "The surprise cameo broke the internet." },
      { id:"c5", author: "Marie Dupont", time: "Apr 8, 5:05 PM", text: "Pre-sales opened and servers crashed instantly." }
    ]
  },
  {
    id: "4",
    title: "Cannes Film Festival 2026 — full lineup revealed",
    category: "Event",
    emoji: "🏆",
    pinned: false,
    urgent: false,
    audience: "Press",
    dueDate: "2026-05-13",
    views: 4210,
    attachment: "cannes2026_lineup.pdf",
    body: "21 films compete for the Palme d'Or from France,\nSouth Korea, and Brazil. Press accreditation closes April 20.",
    author: "Marie Dupont",
    role: "Admin",
    datePosted: "Apr 7",
    createdAt: 1712440800000,
    comments: [
      { id:"c6", author: "Sarah Kim", time: "Apr 7, 9:30 AM", text: "The South Korean entry looks particularly strong." }
    ]
  },
  {
    id: "5",
    title: "Joker 2 director's cut — streaming this Friday",
    category: "Movie news",
    emoji: "🎭",
    pinned: false,
    urgent: true,
    audience: "Members",
    dueDate: "2026-04-11",
    views: 7620,
    attachment: "",
    body: "Extended director's cut hits streaming Friday.\n28 extra minutes and an alternate ending.",
    author: "James Park",
    role: "Editor",
    datePosted: "Apr 6",
    createdAt: 1712354400000,
    comments: []
  },
  {
    id: "6",
    title: "VIP screening — Interstellar 4K restoration",
    category: "Event",
    emoji: "🌟",
    pinned: false,
    urgent: false,
    audience: "VIP",
    dueDate: "2026-04-25",
    views: 892,
    attachment: "vip_invite.pdf",
    body: "Special VIP screening at Dolby Cinema, April 25.\nVery limited seats. Reserve up to 2 tickets today.",
    author: "Marie Dupont",
    role: "Admin",
    datePosted: "Apr 5",
    createdAt: 1712268000000,
    comments: [
      { id:"c7", author: "James Park", time: "Apr 5, 8:00 PM", text: "Already reserved my seats. Dolby sound will be epic." }
    ]
  }
];

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: INITIAL_DATA,
  
  addAnnouncement: (ann) => set((state) => {
    const now = new Date();
    const newAnn: Announcement = {
      ...ann,
      id: "a" + Date.now(),
      views: 0,
      comments: [],
      datePosted: now.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
      createdAt: Date.now()
    };
    return { announcements: [newAnn, ...state.announcements] };
  }),

  updateAnnouncement: (id, updates) => set((state) => ({
    announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  deleteAnnouncement: (id) => set((state) => ({
    announcements: state.announcements.filter(a => a.id !== id)
  })),

  addComment: (annId, author, text) => set((state) => {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) + ', ' + 
                    now.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'});
    
    return {
      announcements: state.announcements.map(a => {
        if (a.id === annId) {
          return {
            ...a,
            comments: [...a.comments, { id: "c" + Date.now(), author, time: timeStr, text }]
          };
        }
        return a;
      })
    };
  })
}));
