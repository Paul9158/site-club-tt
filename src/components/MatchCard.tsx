import type { Match } from "@/lib/types";
import { formatDate } from "@/lib/markdown";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  a_venir: { label: "À venir", className: "bg-blue-100 text-blue-700" },
  joue: { label: "Joué", className: "bg-green-100 text-green-700" },
  reporte: { label: "Reporté", className: "bg-amber-100 text-amber-700" },
  annule: { label: "Annulé", className: "bg-red-100 text-red-700" },
};

export default function MatchCard({ match }: { match: Match }) {
  const status = STATUS_LABELS[match.status] ?? STATUS_LABELS.a_venir;
  const hasScore = match.score_us !== null && match.score_them !== null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          {match.teams?.name && (
            <span
              className="rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: match.teams.color ?? "#1d4ed8" }}
            >
              {match.teams.name}
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 ${status.className}`}>
            {status.label}
          </span>
          {match.competition_type && (
            <span className="text-slate-400">{match.competition_type}</span>
          )}
        </div>
        <p className="text-base font-semibold text-slate-800">
          {match.is_home ? "🏠" : "🚌"}{" "}
          {settingsAwareLabel(match)}
        </p>
        <p className="text-sm text-slate-500">
          {formatDate(match.match_date)}
          {match.location ? ` · ${match.location}` : ""}
        </p>
        {match.notes && <p className="text-sm text-slate-500 italic">{match.notes}</p>}
      </div>
      {hasScore && (
        <div className="self-start rounded-lg bg-slate-100 px-4 py-2 text-center sm:self-center">
          <p className="text-xl font-bold text-slate-800">
            {match.score_us} - {match.score_them}
          </p>
        </div>
      )}
    </div>
  );
}

function settingsAwareLabel(match: Match) {
  return match.is_home ? `vs ${match.opponent}` : `à ${match.opponent}`;
}
