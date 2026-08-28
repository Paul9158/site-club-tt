import { notFound } from "next/navigation";
import { getPageBySlug, getPagePhotos } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import PhotoGallery from "@/components/PhotoGallery";

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const photos = await getPagePhotos(page.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">{page.title}</h1>
      {page.content && (
        <div
          className="prose-content mt-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
        />
      )}
      {photos.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800">Photos</h2>
          <div className="mt-4">
            <PhotoGallery photos={photos} />
          </div>
        </section>
      )}
    </div>
  );
}
