import Link from "next/link";
import { getCompetitions } from "@/lib/data";
import { formatDateShort } from "@/lib/markdown";

export const metadata = { title: "Compétitions" };

export default async function CompetitionsPage() {
  const competitions = await getCompetitions();
  const upcoming = competitions.filter((c) => c.is_upcoming);
  const past = competitions.filter((c) => !c.is_upcoming);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Compétitions</h1>
      <p className="mt-1 text-slate-500">
        Les prochaines compétitions du club et les archives photos des
        éditions passées.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">À venir</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {upcoming.length > 0 ? (
            upcoming.map((c) => <CompetitionCard key={c.id} competition={c} />)
          ) : (
            <p className="text-slate-400">Aucune compétition à venir.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Archives</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {past.length > 0 ? (
            past.map((c) => <CompetitionCard key={c.id} competition={c} />)
          ) : (
            <p className="text-slate-400">Aucune archive pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function CompetitionCard({
  competition,
}: {
  competition: {
    id: string;
    name: string;
    location: string | null;
    start_date: string | null;
    description: string | null;
  };
}) {
  return (
    <Link
      href={`/competitions/${competition.id}`}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <p className="font-semibold text-slate-800">{competition.name}</p>
      {competition.start_date && (
        <p className="mt-1 text-sm text-slate-500">
          {formatDateShort(competition.start_date)}
        </p>
      )}
      {competition.location && (
        <p className="text-sm text-slate-500">{competition.location}</p>
      )}
      {competition.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {competition.description}
        </p>
      )}
    </Link>
  );
}
