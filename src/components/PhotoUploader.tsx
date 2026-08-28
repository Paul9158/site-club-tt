"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUploader({
  folder,
  onUploaded,
  label = "Ajouter une photo",
}: {
  folder: string;
  onUploaded: (publicUrl: string) => void;
  label?: string;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("club-photos")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Échec de l'envoi : " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("club-photos").getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
        {uploading ? "Envoi en cours..." : label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
