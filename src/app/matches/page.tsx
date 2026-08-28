import { getMatches, getTeams } from "@/lib/data";
import MatchesExplorer from "@/components/MatchesExplorer";

export const metadata = { title: "Matchs" };

export default async function MatchesPage() {
  const [matches, teams] = await Promise.all([getMatches(), getTeams()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Matchs</h1>
      <p className="mt-1 text-slate-500">
        Retrouvez les prochains matchs et les résultats passés, par équipe.
      </p>
      <div className="mt-6">
        <MatchesExplorer matches={matches} teams={teams} />
      </div>
    </div>
  );
}
