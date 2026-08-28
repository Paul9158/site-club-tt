"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Block, BlockOwnerType, BlockWidth } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import PhotoUploader from "@/components/PhotoUploader";

const WIDTH_OPTIONS: { value: BlockWidth; label: string }[] = [
  { value: "full", label: "Pleine largeur" },
  { value: "two_thirds", label: "Deux tiers" },
  { value: "half", label: "Moitié" },
  { value: "third", label: "Tiers" },
];

export default function BlockEditor({
  ownerType,
  pageId,
  uploadFolder,
}: {
  ownerType: BlockOwnerType;
  pageId?: string;
  uploadFolder: string;
}) {
  const supabase = createClient();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("blocks")
      .select("*")
      .eq("owner_type", ownerType)
      .order("position", { ascending: true });
    query = ownerType === "page" ? query.eq("page_id", pageId) : query.is("page_id", null);
    const { data } = await query;
    setBlocks((data as Block[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, pageId]);

  function nextPosition() {
    return blocks.length === 0 ? 0 : Math.max(...blocks.map((b) => b.position)) + 1;
  }

  async function addTextBlock() {
    await supabase.from("blocks").insert({
      owner_type: ownerType,
      page_id: ownerType === "page" ? pageId : null,
      block_type: "text",
      content: "",
      position: nextPosition(),
    });
    load();
  }

  async function addPhotoBlock(url: string) {
    await supabase.from("blocks").insert({
      owner_type: ownerType,
      page_id: ownerType === "page" ? pageId : null,
      block_type: "photo",
      photo_url: url,
      position: nextPosition(),
    });
    load();
  }

  async function updateBlock(id: string, patch: Partial<Block>) {
    await supabase.from("blocks").update(patch).eq("id", id);
  }

  async function updateWidth(id: string, width: BlockWidth) {
    updateLocal(id, { width });
    await supabase.from("blocks").update({ width }).eq("id", id);
  }

  function updateLocal(id: string, patch: Partial<Block>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const a = blocks[index];
    const b = blocks[target];
    await Promise.all([
      supabase.from("blocks").update({ position: b.position }).eq("id", a.id),
      supabase.from("blocks").update({ position: a.position }).eq("id", b.id),
    ]);
    load();
  }

  async function deleteBlock(id: string) {
    if (!confirm("Supprimer ce bloc ?")) return;
    await supabase.from("blocks").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={addTextBlock}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          + Bloc de texte
        </button>
        <PhotoUploader
          folder={uploadFolder}
          label="+ Bloc photo"
          onUploaded={addPhotoBlock}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Astuce : choisis &quot;Moitié&quot; ou &quot;Tiers&quot; sur plusieurs
        blocs qui se suivent pour les afficher côte à côte, comme une grille
        de journal.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {blocks.length === 0 && (
          <p className="text-sm text-slate-400">
            Aucun bloc pour le moment. Ajoute du texte ou une photo, dans
            l&apos;ordre que tu veux.
          </p>
        )}
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {block.block_type === "text" ? "Texte" : "Photo"}
                </span>
                <select
                  value={block.width}
                  onChange={(e) => updateWidth(block.id, e.target.value as BlockWidth)}
                  className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  title="Largeur du bloc"
                >
                  {WIDTH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                  className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Descendre"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>

            {block.block_type === "text" ? (
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <textarea
                  value={block.content ?? ""}
                  onChange={(e) => updateLocal(block.id, { content: e.target.value })}
                  onBlur={(e) => updateBlock(block.id, { content: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                  placeholder="# Titre, **gras**, - liste, [lien](url)..."
                />
                <div
                  className="prose-content rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                />
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
                {block.photo_url && (
                  <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg bg-slate-100 sm:h-32 sm:w-48">
                    <Image
                      src={block.photo_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                )}
                <input
                  value={block.caption ?? ""}
                  onChange={(e) => updateLocal(block.id, { caption: e.target.value })}
                  onBlur={(e) => updateBlock(block.id, { caption: e.target.value })}
                  placeholder="Légende (optionnelle)"
                  className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
