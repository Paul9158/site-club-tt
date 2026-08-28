"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Page } from "@/lib/types";
import BlockEditor from "@/components/BlockEditor";

export default function EditPageAdmin() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
    setPage(data as Page);
    setTitle((data as Page)?.title ?? "");
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSaveTitle() {
    setSaving(true);
    setSaved(false);
    await supabase
      .from("pages")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;
  if (!page) return <p className="text-sm text-slate-400">Page introuvable.</p>;

  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-blue-700 hover:underline">
        ← Retour aux pages
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSaveTitle}
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-xl font-bold text-slate-800"
        />
        {saving && <span className="text-xs text-slate-400">Enregistrement...</span>}
        {saved && <span className="text-xs text-green-600">Enregistré ✓</span>}
      </div>
      <p className="mt-1 text-sm text-slate-500">URL publique : /pages/{page.slug}</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">Contenu de la page</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ajoute des blocs de texte et de photo, dans l&apos;ordre que tu
          veux (texte, puis photo, puis texte, etc.), et réorganise-les avec
          les flèches.
        </p>
        <div className="mt-3">
          <BlockEditor ownerType="page" pageId={id} uploadFolder={`pages/${id}`} />
        </div>
      </section>
    </div>
  );
}
