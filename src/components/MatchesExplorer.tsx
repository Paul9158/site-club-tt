"use client";

import { useMemo, useState } from "react";
import type { Match, Team } from "@/lib/types";
import MatchCard from "@/components/MatchCard";

export default function MatchesExplorer({
  matches,
  teams,
}: {
  matches: Match[];
  teams: Team[];
}) {
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [period, setPeriod] = useState<"upcoming" | "past">("upcoming");

  const now = useMemo(() => new Date(), []);

  const filtered = matches
    .filter((m) => (teamFilter === "all" ? true : m.team_id === teamFilter))
    .filter((m) => {
      const isUpcoming = new Date(m.match_date) >= now;
      return period === "upcoming" ? isUpcoming : !isUpcoming;
    })
    .sort((a, b) =>
      period === "upcoming"
        ? new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
        : new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
    );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
          <button
            onClick={() => setPeriod("upcoming")}
            className={`rounded-md px-4 py-1.5 transition ${
              period === "upcoming"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500"
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setPeriod("past")}
            className={`rounded-md px-4 py-1.5 transition ${
              period === "past"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500"
            }`}
          >
            Passés
          </button>
        </div>

        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="all">Toutes les équipes</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((m) => <MatchCard key={m.id} match={m} />)
        ) : (
          <p className="text-slate-400">Aucun match trouvé pour ce filtre.</p>
        )}
      </div>
    </div>
  );
}
