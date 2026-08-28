"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import BlockEditor from "@/components/BlockEditor";

type Toggles = Pick<
  SiteSettings,
  "show_upcoming_matches" | "show_upcoming_competitions" | "show_past_matches"
>;

export default function HomeAdminPage() {
  const supabase = createClient();
  const [toggles, setToggles] = useState<Toggles>({
    show_upcoming_matches: true,
    show_upcoming_competitions: true,
    show_past_matches: true,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("site_settings")
      .select(
        "show_upcoming_matches, show_upcoming_competitions, show_past_matches"
      )
      .eq("id", 1)
      .maybeSingle();
    if (data) setToggles(data as Toggles);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggle(key: keyof Toggles) {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    await supabase.from("site_settings").update(next).eq("id", 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Page d&apos;accueil</h1>
      <p className="mt-1 text-sm text-slate-500">
        Choisis les sections automatiques à afficher, et ajoute ton propre
        contenu (texte et photos, dans l&apos;ordre que tu veux) sur la page
        d&apos;accueil.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">
          Sections automatiques
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={toggles.show_upcoming_matches}
              onChange={() => handleToggle("show_upcoming_matches")}
            />
            Afficher les prochains matchs
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={toggles.show_upcoming_competitions}
              onChange={() => handleToggle("show_upcoming_competitions")}
            />
            Afficher les prochaines compétitions
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={toggles.show_past_matches}
              onChange={() => handleToggle("show_past_matches")}
            />
            Afficher les derniers résultats
          </label>
        </div>
        {saved && <span className="mt-2 block text-xs text-green-600">Enregistré ✓</span>}
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Contenu personnalisé
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ce contenu apparaît en haut de la page d&apos;accueil, juste après
          la bannière du club.
        </p>
        <div className="mt-3">
          <BlockEditor ownerType="home" uploadFolder="home" />
        </div>
      </section>
    </div>
  );
}
