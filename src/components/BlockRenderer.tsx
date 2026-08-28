import type { Block } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import ClickableImage from "@/components/ClickableImage";

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) =>
        block.block_type === "text" ? (
          <div
            key={block.id}
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
          />
        ) : block.photo_url ? (
          <figure key={block.id} className="mx-auto w-full">
            <ClickableImage
              src={block.photo_url}
              alt={block.caption ?? ""}
              className="mx-auto block max-h-[520px] w-auto max-w-full rounded-xl border border-slate-200 object-contain"
            />
            {block.caption && (
              <figcaption className="mt-2 text-center text-sm text-slate-500">
                {block.caption}
              </figcaption>
            )}
          </figure>
        ) : null
      )}
    </div>
  );
}
