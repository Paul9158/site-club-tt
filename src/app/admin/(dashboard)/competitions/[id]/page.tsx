"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Competition, CompetitionPhoto } from "@/lib/types";
import PhotoUploader from "@/components/PhotoUploader";

export default function CompetitionPhotosAdminPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [photos, setPhotos] = useState<CompetitionPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: comp }, { data: photoData }] = await Promise.all([
      supabase.from("competitions").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("competition_photos")
        .select("*")
        .eq("competition_id", id)
        .order("display_order"),
    ]);
    setCompetition(comp as Competition);
    setPhotos((photoData as CompetitionPhoto[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUploaded(url: string) {
    await supabase.from("competition_photos").insert({
      competition_id: id,
      photo_url: url,
      display_order: photos.length,
    });
    load();
  }

  async function handleCaptionChange(photoId: string, caption: string) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  }

  async function handleCaptionBlur(photoId: string, caption: string) {
    await supabase.from("competition_photos").update({ caption }).eq("id", photoId);
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    await supabase.from("competition_photos").delete().eq("id", photoId);
    load();
  }

  if (loading) return <p className="text-sm text-slate-400">Chargement...</p>;
  if (!competition) return <p className="text-sm text-slate-400">Compétition introuvable.</p>;

  return (
    <div>
      <Link href="/admin/competitions" className="text-sm text-blue-700 hover:underline">
        ← Retour aux compétitions
      </Link>
      <h1 className="mt-2 text-xl font-bold text-slate-800">
        Photos — {competition.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Ajoute des photos d&apos;archives pour cette compétition.
      </p>

      <div className="mt-4">
        <PhotoUploader
          folder={`competitions/${id}`}
          onUploaded={handleUploaded}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
            <div className="p-2">
              <input
                value={photo.caption ?? ""}
                onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                onBlur={(e) => handleCaptionBlur(photo.id, e.target.value)}
                placeholder="Légende (optionnelle)"
                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="mt-2 w-full rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
