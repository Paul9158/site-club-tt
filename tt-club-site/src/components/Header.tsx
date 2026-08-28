import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getNavPages } from "@/lib/data";

export default async function Header() {
  const [settings, pages] = await Promise.all([
    getSiteSettings(),
    getNavPages(),
  ]);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/matches", label: "Matchs" },
    { href: "/competitions", label: "Compétitions" },
    ...pages.map((p) => ({ href: `/pages/${p.slug}`, label: p.title })),
  ];

  return (
    <header
      className="text-white shadow-md"
      style={{ backgroundColor: settings.primary_color }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={settings.club_name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full bg-white object-contain p-1"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-800">
              🏓
            </span>
          )}
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            {settings.club_name}
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium sm:text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 transition hover:bg-white/15"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
