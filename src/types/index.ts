export type UserRole =
  | "admin"
  | "director"
  | "producer"
  | "editor"
  | "cinematographer"
  | "sound_engineer"
  | "vfx_artist"
  | "user";

export type MovieStatus =
  | "development"
  | "pre_production"
  | "production"
  | "post_production"
  | "completed"
  | "released";

export type AssetStatus = "pending" | "approved" | "rejected" | "archived";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type Genre =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "sci_fi"
  | "thriller"
  | "documentary"
  | "animation"
  | "romance"
  | "fantasy";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

export interface StatCardData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: string;
}
