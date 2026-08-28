"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Team } from "@/lib/types";

const EMPTY_FORM = { name: "", division: "", color: "#1d4ed8", display_order: 0 };

export default function TeamsAdminPage() {
  const supabase = createClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("teams")
      .select("*")
      .order("display_order", { ascending: true });
    setTeams((data as Team[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(team: Team) {
    setEditingId(team.id);
    setForm({
      name: team.name,
      division: team.division ?? "",
      color: team.color ?? "#1d4ed8",
      display_order: team.display_order,
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
      division: form.division || null,
      color: form.color,
      display_order: Number(form.display_order) || 0,
    };

    const { error } = editingId
      ? await supabase.from("teams").update(payload).eq("id", editingId)
      : await supabase.from("teams").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    cancelEdit();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette équipe ? Les matchs liés seront aussi supprimés."))
      return;
    await supabase.from("teams").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Équipes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Crée et gère les équipes de ton club.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-1">
          <label className="text-xs font-medium text-slate-600">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Équipe 1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Division</label>
          <input
            value={form.division}
            onChange={(e) => setForm({ ...form, division: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Régionale 2"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Couleur</label>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="mt-1 h-10 w-full rounded-lg border border-slate-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Ordre d&apos;affichage</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) =>
              setForm({ ...form, display_order: Number(e.target.value) })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {editingId ? "Enregistrer" : "Ajouter l'équipe"}
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
        {error && <p className="text-sm text-red-600 sm:col-span-2 lg:col-span-4">{error}</p>}
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune équipe pour le moment.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: team.color ?? "#1d4ed8" }}
                />
                <div>
                  <p className="font-medium text-slate-800">{team.name}</p>
                  {team.division && (
                    <p className="text-sm text-slate-500">{team.division}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(team)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
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
