import Image from "next/image";
import type { Block } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";

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
          <figure key={block.id} className="mx-auto w-full max-w-2xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image
                src={block.photo_url}
                alt={block.caption ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
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
