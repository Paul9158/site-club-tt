"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Page } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PagesAdminPage() {
  const supabase = createClient();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("nav_order", { ascending: true });
    setPages((data as Page[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("pages").insert({
      title,
      slug: slugify(title) || `page-${Date.now()}`,
      content: "",
      show_in_nav: true,
      is_published: true,
      nav_order: pages.length,
    });

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    load();
  }

  async function toggleNav(page: Page) {
    await supabase
      .from("pages")
      .update({ show_in_nav: !page.show_in_nav })
      .eq("id", page.id);
    load();
  }

  async function togglePublished(page: Page) {
    await supabase
      .from("pages")
      .update({ is_published: !page.is_published })
      .eq("id", page.id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette page ?")) return;
    await supabase.from("pages").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Pages / Onglets</h1>
      <p className="mt-1 text-sm text-slate-500">
        Crée de nouveaux onglets pour le menu du site (ex: &quot;Le Club&quot;,
        &quot;Horaires&quot;, &quot;Partenaires&quot;...).
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-slate-600">
            Titre de la nouvelle page
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Le Club"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          Créer la page
        </button>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : pages.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune page pour le moment.</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{page.title}</p>
                <p className="text-sm text-slate-500">/pages/{page.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={page.show_in_nav}
                    onChange={() => toggleNav(page)}
                  />
                  Dans le menu
                </label>
                <label className="flex items-center gap-1 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={page.is_published}
                    onChange={() => togglePublished(page)}
                  />
                  Publiée
                </label>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                >
                  Modifier le contenu
                </Link>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
