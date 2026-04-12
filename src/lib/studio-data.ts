import type { Movie, User, Asset, Activity, Comment, Role, PromoStep, CalendarEvent } from "./studio-types";

export const ROLES: Role[] = [
  { id: "director", label: "Director", icon: "🎬", desc: "Oversees creative vision, approves final cuts and campaign direction", color: "#D4534B", permissions: ["all"] },
  { id: "producer", label: "Producer", icon: "💰", desc: "Manages budgets, timelines, and coordinates all departments", color: "#D4903B", permissions: ["movies", "budget", "promotion", "users", "calendar", "reports"] },
  { id: "marketing_lead", label: "Marketing Lead", icon: "📣", desc: "Designs and executes promotional campaigns and strategies", color: "#8E5BB5", permissions: ["promotion", "analytics", "calendar", "assets"] },
  { id: "distribution_mgr", label: "Distribution Mgr", icon: "🌍", desc: "Handles theatrical, streaming, and international releases", color: "#3BA55C", permissions: ["movies", "calendar", "reports"] },
  { id: "pr_specialist", label: "PR Specialist", icon: "📰", desc: "Manages press relations, interviews, and media coverage", color: "#4A90D9", permissions: ["promotion", "assets", "calendar"] },
  { id: "social_media_mgr", label: "Social Media Mgr", icon: "📱", desc: "Runs social channels, influencer partnerships, and viral content", color: "#2BA5A5", permissions: ["promotion", "analytics", "assets"] },
  { id: "analytics_lead", label: "Analytics Lead", icon: "📊", desc: "Tracks KPIs, audience data, and ROI across all campaigns", color: "#CF7A30", permissions: ["analytics", "reports"] },
  { id: "editor", label: "Editor", icon: "✂️", desc: "Manages trailers, teasers, and promotional video content", color: "#7B4BAD", permissions: ["assets", "promotion"] },
];

export const STATUSES = ["Pre-Production", "In Production", "Post-Production", "Released"] as const;

export const GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Animation", "Documentary"] as const;

export const POSTER_OPTIONS = ["🎬", "🚀", "👻", "🎭", "💥", "🌙", "⚔️", "🔮", "🎪", "🦁", "🏴‍☠️", "🌊", "🏔️", "🔥", "💎", "🎯", "🛸", "🧛", "🤖", "🐉"];

export const PROMO_STEPS: PromoStep[] = [
  { id: 1, phase: "Pre-Production", title: "Market Research & Positioning", tasks: ["Audience demographic analysis", "Competitor film landscape review", "Genre trend identification", "Target market segmentation"], icon: "🔍", duration: "4-6 weeks" },
  { id: 2, phase: "Pre-Production", title: "Brand Identity & Assets", tasks: ["Logo & key art design", "Tagline development", "Color palette & typography", "Press kit assembly"], icon: "🎨", duration: "3-4 weeks" },
  { id: 3, phase: "Production", title: "Behind-the-Scenes Content", tasks: ["On-set photo/video capture", "Cast & crew interviews", "Making-of documentary clips", "Social media teasers"], icon: "🎥", duration: "Ongoing" },
  { id: 4, phase: "Post-Production", title: "Trailer & Teaser Campaign", tasks: ["Teaser trailer (90s)", "Official trailer (2:30)", "Character spots", "TV spots (30s/15s)"], icon: "🎞️", duration: "6-8 weeks" },
  { id: 5, phase: "Marketing", title: "Digital Marketing Blitz", tasks: ["Social media campaign launch", "Influencer partnerships", "Paid ad campaigns (Meta, Google, TikTok)", "Email marketing sequences"], icon: "💻", duration: "8-12 weeks" },
  { id: 6, phase: "Marketing", title: "Press & Media Relations", tasks: ["Press screenings", "Junket & interview circuit", "Review embargo management", "Festival submissions"], icon: "📰", duration: "4-6 weeks" },
  { id: 7, phase: "Release", title: "Premiere & Launch Events", tasks: ["Red carpet premiere", "Fan screening events", "Cast appearances & Q&As", "Merchandise tie-ins"], icon: "🌟", duration: "1-2 weeks" },
  { id: 8, phase: "Release", title: "Distribution & Expansion", tasks: ["Theatrical rollout strategy", "International release schedule", "Streaming platform negotiations", "Home media & VOD planning"], icon: "🌍", duration: "4-12 weeks" },
  { id: 9, phase: "Post-Release", title: "Performance Analysis", tasks: ["Box office tracking", "Audience sentiment analysis", "Campaign ROI measurement", "Awards campaign strategy"], icon: "📈", duration: "Ongoing" },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: "2026-04-15", title: "Crimson Horizon — Press Kit Delivery", movie: "Crimson Horizon", type: "deadline", color: "#D4534B" },
  { date: "2026-04-22", title: "Whispers — Trailer Launch", movie: "Whispers in the Dark", type: "launch", color: "#8E5BB5" },
  { date: "2026-05-01", title: "Moonlit Garden — Budget Review", movie: "Moonlit Garden", type: "meeting", color: "#D4903B" },
  { date: "2026-05-10", title: "Velocity — Awards Submission", movie: "Velocity", type: "deadline", color: "#3BA55C" },
  { date: "2026-06-01", title: "Whispers — Festival Screening", movie: "Whispers in the Dark", type: "event", color: "#4A90D9" },
  { date: "2026-06-15", title: "Crimson — Teaser Drop #2", movie: "Crimson Horizon", type: "launch", color: "#D4534B" },
  { date: "2026-07-20", title: "Whispers — Social Blitz Start", movie: "Whispers in the Dark", type: "campaign", color: "#2BA5A5" },
  { date: "2026-08-20", title: "Whispers in the Dark — RELEASE", movie: "Whispers in the Dark", type: "release", color: "#CF7A30" },
  { date: "2026-10-01", title: "Crimson — Official Trailer", movie: "Crimson Horizon", type: "launch", color: "#D4534B" },
  { date: "2026-12-15", title: "Crimson Horizon — RELEASE", movie: "Crimson Horizon", type: "release", color: "#CF7A30" },
  { date: "2027-02-14", title: "Moonlit Garden — RELEASE", movie: "Moonlit Garden", type: "release", color: "#CF7A30" },
];

export const INIT_MOVIES: Movie[] = [
  { id: 1, title: "Crimson Horizon", genre: "Sci-Fi", status: "In Production", budget: 120, spent: 78, revenue: 0, rating: 0, releaseDate: "2026-12-15", promoStep: 3, poster: "🚀", audience: { male: 58, female: 37, other: 5 }, ageGroups: { "18-24": 32, "25-34": 38, "35-44": 18, "45+": 12 }, campaignSpend: { social: 4.2, press: 2.1, digital: 6.8, events: 1.5 }, campaignResults: { social: 320000, press: 85, digital: 1200000, events: 4 } },
  { id: 2, title: "Whispers in the Dark", genre: "Horror", status: "Post-Production", budget: 45, spent: 41, revenue: 0, rating: 0, releaseDate: "2026-08-20", promoStep: 5, poster: "👻", audience: { male: 45, female: 50, other: 5 }, ageGroups: { "18-24": 42, "25-34": 33, "35-44": 15, "45+": 10 }, campaignSpend: { social: 3.8, press: 1.5, digital: 5.2, events: 0.8 }, campaignResults: { social: 580000, press: 120, digital: 2100000, events: 6 } },
  { id: 3, title: "The Last Encore", genre: "Drama", status: "Released", budget: 80, spent: 80, revenue: 245, rating: 8.4, releaseDate: "2026-03-10", promoStep: 9, poster: "🎭", audience: { male: 40, female: 55, other: 5 }, ageGroups: { "18-24": 15, "25-34": 28, "35-44": 32, "45+": 25 }, campaignSpend: { social: 5.5, press: 4.2, digital: 8.1, events: 3.8 }, campaignResults: { social: 920000, press: 340, digital: 4500000, events: 12 } },
  { id: 4, title: "Velocity", genre: "Action", status: "Released", budget: 150, spent: 150, revenue: 420, rating: 7.8, releaseDate: "2026-01-25", promoStep: 9, poster: "💥", audience: { male: 62, female: 33, other: 5 }, ageGroups: { "18-24": 35, "25-34": 35, "35-44": 20, "45+": 10 }, campaignSpend: { social: 8.2, press: 5.5, digital: 12.4, events: 6.1 }, campaignResults: { social: 2100000, press: 520, digital: 8900000, events: 18 } },
  { id: 5, title: "Moonlit Garden", genre: "Romance", status: "Pre-Production", budget: 35, spent: 8, revenue: 0, rating: 0, releaseDate: "2027-02-14", promoStep: 1, poster: "🌙", audience: { male: 25, female: 70, other: 5 }, ageGroups: { "18-24": 28, "25-34": 40, "35-44": 22, "45+": 10 }, campaignSpend: { social: 0.5, press: 0, digital: 1.2, events: 0 }, campaignResults: { social: 45000, press: 5, digital: 89000, events: 0 } },
];

export const INIT_USERS: User[] = [
  { id: 1, name: "Sarah Chen", role: "director", email: "sarah@studio.com", avatar: "SC", active: true, lastActive: "2h ago" },
  { id: 2, name: "Marcus Webb", role: "producer", email: "marcus@studio.com", avatar: "MW", active: true, lastActive: "15m ago" },
  { id: 3, name: "Elena Rossi", role: "marketing_lead", email: "elena@studio.com", avatar: "ER", active: true, lastActive: "1h ago" },
  { id: 4, name: "James Park", role: "analytics_lead", email: "james@studio.com", avatar: "JP", active: false, lastActive: "2d ago" },
  { id: 5, name: "Aisha Okafor", role: "pr_specialist", email: "aisha@studio.com", avatar: "AO", active: true, lastActive: "30m ago" },
  { id: 6, name: "David Nguyen", role: "social_media_mgr", email: "david@studio.com", avatar: "DN", active: true, lastActive: "5m ago" },
  { id: 7, name: "Lisa Andersson", role: "distribution_mgr", email: "lisa@studio.com", avatar: "LA", active: false, lastActive: "5d ago" },
  { id: 8, name: "Carlos Mendez", role: "editor", email: "carlos@studio.com", avatar: "CM", active: true, lastActive: "45m ago" },
];

export const INIT_ACTIVITIES: Activity[] = [
  { id: 1, user: "Elena Rossi", action: "uploaded new key art for", target: "Whispers in the Dark", type: "asset", time: "5 min ago", icon: "🎨" },
  { id: 2, user: "Sarah Chen", action: "approved trailer cut for", target: "Crimson Horizon", type: "approval", time: "20 min ago", icon: "✅" },
  { id: 3, user: "Marcus Webb", action: "updated budget for", target: "Moonlit Garden", type: "budget", time: "1 hour ago", icon: "💰" },
  { id: 4, user: "David Nguyen", action: "launched TikTok campaign for", target: "Whispers in the Dark", type: "campaign", time: "2 hours ago", icon: "📱" },
  { id: 5, user: "Aisha Okafor", action: "scheduled press screening for", target: "Crimson Horizon", type: "event", time: "3 hours ago", icon: "📰" },
  { id: 6, user: "Carlos Mendez", action: "completed teaser edit for", target: "Moonlit Garden", type: "asset", time: "5 hours ago", icon: "✂️" },
  { id: 7, user: "Lisa Andersson", action: "finalized streaming deal for", target: "The Last Encore", type: "deal", time: "1 day ago", icon: "🌍" },
  { id: 8, user: "James Park", action: "generated ROI report for", target: "Velocity", type: "report", time: "1 day ago", icon: "📊" },
];

export const INIT_ASSETS: Asset[] = [
  { id: 1, name: "Official Poster v3.psd", movie: "Crimson Horizon", type: "image", size: "48MB", uploader: "Elena Rossi", date: "Apr 8", status: "approved" },
  { id: 2, name: "Teaser Trailer Final.mp4", movie: "Whispers in the Dark", type: "video", size: "320MB", uploader: "Carlos Mendez", date: "Apr 7", status: "pending" },
  { id: 3, name: "Press Kit Q2.pdf", movie: "Crimson Horizon", type: "document", size: "12MB", uploader: "Aisha Okafor", date: "Apr 6", status: "approved" },
  { id: 4, name: "Social Media Pack.zip", movie: "Moonlit Garden", type: "archive", size: "85MB", uploader: "David Nguyen", date: "Apr 5", status: "in_review" },
  { id: 5, name: "Behind-the-Scenes Reel.mp4", movie: "Crimson Horizon", type: "video", size: "1.2GB", uploader: "Carlos Mendez", date: "Apr 4", status: "approved" },
  { id: 6, name: "Distribution Contract.pdf", movie: "The Last Encore", type: "document", size: "2MB", uploader: "Lisa Andersson", date: "Apr 3", status: "approved" },
];

export const INIT_COMMENTS: Comment[] = [
  { id: 1, movie: "Crimson Horizon", user: "Sarah Chen", text: "The second teaser needs more tension in the final 10 seconds. Let's reshoot the closing shot.", time: "2h ago", replies: [{ user: "Carlos Mendez", text: "Working on it now — I'll have a new cut by EOD.", time: "1h ago" }] },
  { id: 2, movie: "Whispers in the Dark", user: "Elena Rossi", text: "TikTok campaign is outperforming expectations — 580K engagements in week one. Recommend doubling the ad spend.", time: "4h ago", replies: [{ user: "Marcus Webb", text: "Approved. Budget adjusted.", time: "3h ago" }] },
  { id: 3, movie: "Moonlit Garden", user: "Marcus Webb", text: "We need to lock the Valentine's release date ASAP. Distribution needs 6 months lead time.", time: "1d ago", replies: [] },
];
