export interface Movie {
  id: number;
  title: string;
  genre: string;
  status: string;
  budget: number;
  spent: number;
  revenue: number;
  rating: number;
  releaseDate: string;
  promoStep: number;
  poster: string;
  audience: { male: number; female: number; other: number };
  ageGroups: Record<string, number>;
  campaignSpend: { social: number; press: number; digital: number; events: number };
  campaignResults: { social: number; press: number; digital: number; events: number };
}

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar: string;
  active: boolean;
  lastActive: string;
}

export interface Asset {
  id: number;
  name: string;
  movie: string;
  type: string;
  size: string;
  uploader: string;
  date: string;
  status: string;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  type: string;
  time: string;
  icon: string;
}

export interface Comment {
  id: number;
  movie: string;
  user: string;
  text: string;
  time: string;
  replies: { user: string; text: string; time: string }[];
}

export interface Role {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
  permissions: string[];
}

export interface PromoStep {
  id: number;
  phase: string;
  title: string;
  tasks: string[];
  icon: string;
  duration: string;
}

export interface CalendarEvent {
  date: string;
  title: string;
  movie: string;
  type: string;
  color: string;
}
