import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.club_name,
    description:
      settings.about_text ?? `Site officiel du club ${settings.club_name}`,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-white">{children}</body>
    </html>
  );
}
