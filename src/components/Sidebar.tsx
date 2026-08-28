import Image from "next/image";
import { getSiteSettings } from "@/lib/data";

export default async function Sidebar() {
  const settings = await getSiteSettings();

  if (!settings.sidebar_enabled) return null;

  const content = (
    <div className="flex h-full w-16 flex-col items-center gap-4 py-6 text-white md:w-24">
      {settings.sidebar_image_url && (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white md:h-14 md:w-14">
          <Image
            src={settings.sidebar_image_url}
            alt=""
            fill
            className="object-contain p-1"
          />
        </div>
      )}
      {settings.sidebar_text && (
        <p
          className="text-xs font-semibold tracking-wide md:text-sm"
          style={{ writingMode: "vertical-rl" }}
        >
          {settings.sidebar_text}
        </p>
      )}
    </div>
  );

  return (
    <aside
      className="sticky top-0 h-screen shrink-0"
      style={{ backgroundColor: settings.sidebar_background_color }}
    >
      {settings.sidebar_link_url ? (
        <a
          href={settings.sidebar_link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </aside>
  );
}
