export type SiteSettings = {
  id: number;
  club_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  about_text: string | null;
};

export type Team = {
  id: string;
  name: string;
  division: string | null;
  color: string | null;
  display_order: number;
};

export type MatchStatus = "a_venir" | "joue" | "reporte" | "annule";

export type Match = {
  id: string;
  team_id: string | null;
  opponent: string;
  is_home: boolean;
  match_date: string;
  location: string | null;
  competition_type: string | null;
  status: MatchStatus;
  score_us: number | null;
  score_them: number | null;
  notes: string | null;
  teams?: Team | null;
};

export type Competition = {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  is_upcoming: boolean;
};

export type CompetitionPhoto = {
  id: string;
  competition_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  show_in_nav: boolean;
  nav_order: number;
  is_published: boolean;
};

export type PagePhoto = {
  id: string;
  page_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
};
