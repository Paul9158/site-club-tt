import { notFound } from "next/navigation";
import { getPageBySlug, getPageBlocks, getPagePhotos } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import PhotoGallery from "@/components/PhotoGallery";
import BlockRenderer from "@/components/BlockRenderer";

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const blocks = await getPageBlocks(page.id);
  // Compatibilité avec les pages créées avant l'ajout des blocs.
  const legacyPhotos = blocks.length === 0 ? await getPagePhotos(page.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">{page.title}</h1>

      {blocks.length > 0 ? (
        <div className="mt-6">
          <BlockRenderer blocks={blocks} />
        </div>
      ) : (
        <>
          {page.content && (
            <div
              className="prose-content mt-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
            />
          )}
          {legacyPhotos.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-800">Photos</h2>
              <div className="mt-4">
                <PhotoGallery photos={legacyPhotos} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
