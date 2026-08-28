"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import PhotoUploader from "@/components/PhotoUploader";

const EMPTY: Omit<SiteSettings, "id"> = {
  club_name: "",
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

export default function SettingsAdminPage() {
  const supabase = createClient();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (data) setForm(data as SiteSettings);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase
      .from("site_settings")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Réglages du site</h1>
      <p className="mt-1 text-sm text-slate-500">
        Nom du club, logo, couleurs et coordonnées affichées partout sur le
        site.
      </p>

      <form
        onSubmit={handleSave}
        className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600">Nom du club</label>
          <input
            required
            value={form.club_name}
            onChange={(e) => setForm({ ...form, club_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600">Logo</label>
          <div className="mt-1 flex items-center gap-3">
            {form.logo_url && (
              <Image
                src={form.logo_url}
                alt="Logo"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-slate-200 object-contain"
              />
            )}
            <PhotoUploader
              folder="site"
              label="Changer le logo"
              onUploaded={(url) => setForm({ ...form, logo_url: url })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">
            Couleur principale
          </label>
          <input
            type="color"
            value={form.primary_color}
            onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
            className="mt-1 h-10 w-full rounded-lg border border-slate-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">
            Couleur secondaire
          </label>
          <input
            type="color"
            value={form.secondary_color}
            onChange={(e) =>
              setForm({ ...form, secondary_color: e.target.value })
            }
            className="mt-1 h-10 w-full rounded-lg border border-slate-300"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600">
            Présentation du club (page d&apos;accueil)
          </label>
          <textarea
            value={form.about_text ?? ""}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Adresse</label>
          <input
            value={form.address ?? ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Email de contact</label>
          <input
            type="email"
            value={form.contact_email ?? ""}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Téléphone</label>
          <input
            value={form.contact_phone ?? ""}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Facebook (URL)</label>
          <input
            value={form.facebook_url ?? ""}
            onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Instagram (URL)</label>
          <input
            value={form.instagram_url ?? ""}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2 border-t border-slate-200 pt-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.sidebar_enabled}
              onChange={(e) =>
                setForm({ ...form, sidebar_enabled: e.target.checked })
              }
            />
            Afficher un bandeau vertical fixe à gauche (visible sur toutes
            les pages)
          </label>
        </div>

        {form.sidebar_enabled && (
          <>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">
                Image du bandeau (logo, affiche, sponsor...)
              </label>
              <div className="mt-1 flex items-center gap-3">
                {form.sidebar_image_url && (
                  <Image
                    src={form.sidebar_image_url}
                    alt="Bandeau"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-slate-200 object-contain"
                  />
                )}
                <PhotoUploader
                  folder="sidebar"
                  label="Changer l'image du bandeau"
                  onUploaded={(url) => setForm({ ...form, sidebar_image_url: url })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Texte du bandeau (affiché à la verticale)
              </label>
              <input
                value={form.sidebar_text ?? ""}
                onChange={(e) => setForm({ ...form, sidebar_text: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Ex: Nos partenaires"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Lien (optionnel, au clic sur le bandeau)
              </label>
              <input
                value={form.sidebar_link_url ?? ""}
                onChange={(e) =>
                  setForm({ ...form, sidebar_link_url: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Couleur de fond du bandeau
              </label>
              <input
                type="color"
                value={form.sidebar_background_color}
                onChange={(e) =>
                  setForm({ ...form, sidebar_background_color: e.target.value })
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {saved && <span className="text-sm text-green-600">Enregistré ✓</span>}
        </div>
      </form>
    </div>
  );
}
