import Link from "next/link";
import {
  getSiteSettings,
  getUpcomingMatches,
  getPastMatches,
  getCompetitions,
} from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import MatchCard from "@/components/MatchCard";

export default async function Home() {
  const [settings, upcoming, past, competitions] = await Promise.all([
    getSiteSettings(),
    getUpcomingMatches(4),
    getPastMatches(3),
    getCompetitions(),
  ]);

  const upcomingCompetitions = competitions.filter((c) => c.is_upcoming);

  return (
    <div>
      <section
        className="px-4 py-16 text-center text-white sm:py-20"
        style={{
          background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})`,
        }}
      >
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          {settings.club_name}
        </h1>
        {settings.about_text && (
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            {settings.about_text}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/matches"
            className="rounded-full bg-white px-5 py-2 font-semibold text-slate-800 shadow hover:bg-slate-100"
          >
            Voir les matchs
          </Link>
          <Link
            href="/competitions"
            className="rounded-full border border-white/70 px-5 py-2 font-semibold text-white hover:bg-white/10"
          >
            Compétitions
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Prochains matchs
          </h2>
          <Link href="/matches" className="text-sm font-medium text-blue-700 hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {upcoming.length > 0 ? (
            upcoming.map((m) => <MatchCard key={m.id} match={m} />)
          ) : (
            <p className="text-slate-400">Aucun match programmé pour le moment.</p>
          )}
        </div>
      </section>

      {upcomingCompetitions.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            Prochaines compétitions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {upcomingCompetitions.map((c) => (
              <Link
                key={c.id}
                href={`/competitions/${c.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <p className="font-semibold text-slate-800">{c.name}</p>
                {c.start_date && (
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(c.start_date).toLocaleDateString("fr-FR")}
                  </p>
                )}
                {c.location && (
                  <p className="text-sm text-slate-500">{c.location}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Derniers résultats
          </h2>
          <Link href="/matches" className="text-sm font-medium text-blue-700 hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {past.length > 0 ? (
            past.map((m) => <MatchCard key={m.id} match={m} />)
          ) : (
            <p className="text-slate-400">Pas encore de résultats.</p>
          )}
        </div>
      </section>

      {settings.about_text && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div
            className="prose-content rounded-xl border border-slate-200 bg-slate-50 p-6"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(settings.about_text),
            }}
          />
        </section>
      )}
    </div>
  );
}
