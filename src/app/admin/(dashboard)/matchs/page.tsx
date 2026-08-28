"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match, Team } from "@/lib/types";
import { formatDate } from "@/lib/markdown";

const EMPTY_FORM = {
  team_id: "",
  opponent: "",
  is_home: true,
  match_date: "",
  location: "",
  competition_type: "Championnat",
  status: "a_venir" as Match["status"],
  score_us: "",
  score_them: "",
  notes: "",
};

export default function MatchesAdminPage() {
  const supabase = createClient();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: matchData }, { data: teamData }] = await Promise.all([
      supabase
        .from("matches")
        .select("*, teams(*)")
        .order("match_date", { ascending: false }),
      supabase.from("teams").select("*").order("display_order"),
    ]);
    setMatches((matchData as unknown as Match[]) ?? []);
    setTeams((teamData as Team[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(match: Match) {
    setEditingId(match.id);
    setForm({
      team_id: match.team_id ?? "",
      opponent: match.opponent,
      is_home: match.is_home,
      match_date: toLocalInputValue(match.match_date),
      location: match.location ?? "",
      competition_type: match.competition_type ?? "Championnat",
      status: match.status,
      score_us: match.score_us?.toString() ?? "",
      score_them: match.score_them?.toString() ?? "",
      notes: match.notes ?? "",
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
      team_id: form.team_id || null,
      opponent: form.opponent,
      is_home: form.is_home,
      match_date: form.match_date ? new Date(form.match_date).toISOString() : null,
      location: form.location || null,
      competition_type: form.competition_type || null,
      status: form.status,
      score_us: form.score_us === "" ? null : Number(form.score_us),
      score_them: form.score_them === "" ? null : Number(form.score_them),
      notes: form.notes || null,
    };

    const { error } = editingId
      ? await supabase.from("matches").update(payload).eq("id", editingId)
      : await supabase.from("matches").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    cancelEdit();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce match ?")) return;
    await supabase.from("matches").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Matchs</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ajoute les prochains matchs et renseigne les scores une fois joués.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label className="text-xs font-medium text-slate-600">Équipe</label>
          <select
            required
            value={form.team_id}
            onChange={(e) => setForm({ ...form, team_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Choisir une équipe</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Adversaire</label>
          <input
            required
            value={form.opponent}
            onChange={(e) => setForm({ ...form, opponent: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Club adverse"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Domicile / Extérieur</label>
          <select
            value={form.is_home ? "home" : "away"}
            onChange={(e) => setForm({ ...form, is_home: e.target.value === "home" })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="home">Domicile</option>
            <option value="away">Extérieur</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Date et heure</label>
          <input
            type="datetime-local"
            required
            value={form.match_date}
            onChange={(e) => setForm({ ...form, match_date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Lieu</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Salle Jean Jaurès"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Type</label>
          <input
            value={form.competition_type}
            onChange={(e) => setForm({ ...form, competition_type: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Championnat / Coupe / Amical"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Statut</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Match["status"] })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="a_venir">À venir</option>
            <option value="joue">Joué</option>
            <option value="reporte">Reporté</option>
            <option value="annule">Annulé</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Score (nous)</label>
          <input
            type="number"
            value={form.score_us}
            onChange={(e) => setForm({ ...form, score_us: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Score (adverse)</label>
          <input
            type="number"
            value={form.score_them}
            onChange={(e) => setForm({ ...form, score_them: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-xs font-medium text-slate-600">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {editingId ? "Enregistrer" : "Ajouter le match"}
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
        {error && (
          <p className="text-sm text-red-600 sm:col-span-2 lg:col-span-3">{error}</p>
        )}
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun match pour le moment.</p>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {match.teams?.name ?? "Équipe"} {match.is_home ? "vs" : "à"}{" "}
                  {match.opponent}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(match.match_date, true)}
                  {match.location ? ` · ${match.location}` : ""} ·{" "}
                  {match.status}
                  {match.score_us !== null && match.score_them !== null
                    ? ` · ${match.score_us}-${match.score_them}`
                    : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(match)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
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

function toLocalInputValue(isoDate: string) {
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
