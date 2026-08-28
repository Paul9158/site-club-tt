import Link from "next/link";
import {
  getTeams,
  getUpcomingMatches,
  getCompetitions,
  getAllPages,
} from "@/lib/data";

export default async function AdminHome() {
  const [teams, upcoming, competitions, pages] = await Promise.all([
    getTeams(),
    getUpcomingMatches(),
    getCompetitions(),
    getAllPages(),
  ]);

  const cards = [
    { label: "Équipes", value: teams.length, href: "/admin/equipes" },
    { label: "Matchs à venir", value: upcoming.length, href: "/admin/matchs" },
    {
      label: "Compétitions",
      value: competitions.length,
      href: "/admin/competitions",
    },
    { label: "Pages personnalisées", value: pages.length, href: "/admin/pages" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Tableau de bord</h1>
      <p className="mt-1 text-sm text-slate-500">
        Toutes les modifications faites ici apparaissent immédiatement sur le
        site public.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
