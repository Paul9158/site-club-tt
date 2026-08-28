"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Competition } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  location: "",
  is_upcoming: true,
};

export default function CompetitionsAdminPage() {
  const supabase = createClient();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("competitions")
      .select("*")
      .order("start_date", { ascending: false });
    setCompetitions((data as Competition[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(c: Competition) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      start_date: c.start_date ?? "",
      end_date: c.end_date ?? "",
      location: c.location ?? "",
      is_upcoming: c.is_upcoming,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      location: form.location || null,
      is_upcoming: form.is_upcoming,
    };

    const { error } = editingId
      ? await supabase.from("competitions").update(payload).eq("id", editingId)
      : await supabase.from("competitions").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    cancelEdit();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette compétition et ses photos ?")) return;
    await supabase.from("competitions").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Compétitions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ajoute les compétitions à venir et archive les anciennes avec des
        photos.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Tournoi interne de printemps"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Date de début</label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Date de fin</label>
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Lieu</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Statut</label>
          <select
            value={form.is_upcoming ? "upcoming" : "past"}
            onChange={(e) =>
              setForm({ ...form, is_upcoming: e.target.value === "upcoming" })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="upcoming">À venir</option>
            <option value="past">Archivée</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {editingId ? "Enregistrer" : "Ajouter la compétition"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : competitions.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune compétition pour le moment.</p>
        ) : (
          competitions.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{c.name}</p>
                <p className="text-sm text-slate-500">
                  {c.start_date ?? "Date non définie"}
                  {c.location ? ` · ${c.location}` : ""} ·{" "}
                  {c.is_upcoming ? "À venir" : "Archivée"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/competitions/${c.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                >
                  Photos
                </Link>
                <button
                  onClick={() => startEdit(c)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
