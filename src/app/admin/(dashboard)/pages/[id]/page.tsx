"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Page, PagePhoto } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import PhotoUploader from "@/components/PhotoUploader";

export default function EditPageAdmin() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [photos, setPhotos] = useState<PagePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: pageData }, { data: photoData }] = await Promise.all([
      supabase.from("pages").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("page_photos")
        .select("*")
        .eq("page_id", id)
        .order("display_order"),
    ]);
    setPage(pageData as Page);
    setTitle((pageData as Page)?.title ?? "");
    setContent((pageData as Page)?.content ?? "");
    setPhotos((photoData as PagePhoto[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await supabase
      .from("pages")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleUploaded(url: string) {
    await supabase.from("page_photos").insert({
      page_id: id,
      photo_url: url,
      display_order: photos.length,
    });
    load();
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    await supabase.from("page_photos").delete().eq("id", photoId);
    load();
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;
  if (!page) return <p className="text-sm text-slate-400">Page introuvable.</p>;

  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-blue-700 hover:underline">
        ← Retour aux pages
      </Link>

      <div className="mt-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xl font-bold text-slate-800"
        />
        <p className="mt-1 text-sm text-slate-500">
          URL publique : /pages/{page.slug}
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-600">
            Contenu (texte simple, avec mise en forme : # Titre, **gras**,
            listes avec -, liens [texte](url))
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Aperçu</label>
          <div
            className="prose-content mt-1 rounded-lg border border-slate-200 bg-white p-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && <span className="text-sm text-green-600">Enregistré ✓</span>}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Photos de la page</h2>
        <div className="mt-3">
          <PhotoUploader folder={`pages/${id}`} onUploaded={handleUploaded} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                <Image
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="w-full border-t border-slate-100 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
