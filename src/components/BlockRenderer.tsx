import type { Block, BlockWidth } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import ClickableImage from "@/components/ClickableImage";

// Grille à 6 colonnes : chaque bloc occupe une fraction de la largeur sur
// grand écran (et repasse en pleine largeur sur mobile), pour construire des
// mises en page façon journal (colonnes côte à côte).
const COL_SPAN_CLASS: Record<BlockWidth, string> = {
  full: "md:col-span-6",
  two_thirds: "md:col-span-4",
  half: "md:col-span-3",
  third: "md:col-span-2",
};

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-6">
      {blocks.map((block) => {
        const colClass = COL_SPAN_CLASS[block.width] ?? COL_SPAN_CLASS.full;

        if (block.block_type === "text") {
          return (
            <div
              key={block.id}
              className={`prose-content col-span-1 ${colClass}`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
            />
          );
        }

        if (!block.photo_url) return null;

        return (
          <figure key={block.id} className={`col-span-1 ${colClass}`}>
            <ClickableImage
              src={block.photo_url}
              alt={block.caption ?? ""}
              className={
                block.width === "full"
                  ? "mx-auto block max-h-[520px] w-auto max-w-full rounded-xl border border-slate-200 object-contain"
                  : "block h-auto w-full rounded-xl border border-slate-200 object-cover"
              }
            />
            {block.caption && (
              <figcaption className="mt-2 text-center text-sm text-slate-500">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
