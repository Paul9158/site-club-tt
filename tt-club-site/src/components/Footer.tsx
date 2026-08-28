import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold text-slate-800">{settings.club_name}</p>
            {settings.address && <p className="mt-1">{settings.address}</p>}
            <div className="mt-1 flex flex-col gap-0.5">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:underline"
                >
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && <span>{settings.contact_phone}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex gap-3">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
            <Link href="/admin/login" className="text-xs text-slate-400 hover:underline">
              Espace administrateur
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} {settings.club_name}
        </p>
      </div>
    </footer>
  );
}
