import { createClient } from "@/lib/supabase/server";
import type {
  SiteSettings,
  Team,
  Match,
  Competition,
  CompetitionPhoto,
  Page,
  PagePhoto,
  Block,
} from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  club_name: "Mon Club de Tennis de Table",
  logo_url: null,
  primary_color: "#1d4ed8",
  secondary_color: "#f97316",
  address: null,
  contact_email: null,
  contact_phone: null,
  facebook_url: null,
  instagram_url: null,
  about_text: null,
  show_upcoming_matches: true,
  show_upcoming_competitions: true,
  show_past_matches: true,
  sidebar_enabled: false,
  sidebar_image_url: null,
  sidebar_link_url: null,
  sidebar_text: null,
  sidebar_background_color: "#0f172a",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as SiteSettings) ?? DEFAULT_SETTINGS;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .order("display_order", { ascending: true });
  return (data as Team[]) ?? [];
}

export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*, teams(*)")
    .order("match_date", { ascending: true });
  return (data as unknown as Match[]) ?? [];
}

export async function getUpcomingMatches(limit?: number): Promise<Match[]> {
  const supabase = await createClient();
  let query = supabase
    .from("matches")
    .select("*, teams(*)")
    .gte("match_date", new Date().toISOString())
    .order("match_date", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as unknown as Match[]) ?? [];
}

export async function getPastMatches(limit?: number): Promise<Match[]> {
  const supabase = await createClient();
  let query = supabase
    .from("matches")
    .select("*, teams(*)")
    .lt("match_date", new Date().toISOString())
    .order("match_date", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as unknown as Match[]) ?? [];
}

export async function getCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .order("start_date", { ascending: false });
  return (data as Competition[]) ?? [];
}

export async function getCompetition(id: string): Promise<Competition | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Competition) ?? null;
}

export async function getCompetitionPhotos(
  competitionId: string
): Promise<CompetitionPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_photos")
    .select("*")
    .eq("competition_id", competitionId)
    .order("display_order", { ascending: true });
  return (data as CompetitionPhoto[]) ?? [];
}

export async function getNavPages(): Promise<Page[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .eq("show_in_nav", true)
    .order("nav_order", { ascending: true });
  return (data as Page[]) ?? [];
}

export async function getAllPages(): Promise<Page[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("nav_order", { ascending: true });
  return (data as Page[]) ?? [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as Page) ?? null;
}

export async function getPagePhotos(pageId: string): Promise<PagePhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_photos")
    .select("*")
    .eq("page_id", pageId)
    .order("display_order", { ascending: true });
  return (data as PagePhoto[]) ?? [];
}

export async function getHomeBlocks(): Promise<Block[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blocks")
    .select("*")
    .eq("owner_type", "home")
    .order("position", { ascending: true });
  return (data as Block[]) ?? [];
}

export async function getPageBlocks(pageId: string): Promise<Block[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blocks")
    .select("*")
    .eq("owner_type", "page")
    .eq("page_id", pageId)
    .order("position", { ascending: true });
  return (data as Block[]) ?? [];
}
