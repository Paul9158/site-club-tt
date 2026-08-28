import { notFound } from "next/navigation";
import { getCompetition, getCompetitionPhotos } from "@/lib/data";
import { formatDate } from "@/lib/markdown";
import PhotoGallery from "@/components/PhotoGallery";

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competition = await getCompetition(id);
  if (!competition) notFound();

  const photos = await getCompetitionPhotos(id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">{competition.name}</h1>
      <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-slate-500">
        {competition.start_date && (
          <span>
            {formatDate(competition.start_date)}
            {competition.end_date && competition.end_date !== competition.start_date
              ? ` → ${formatDate(competition.end_date)}`
              : ""}
          </span>
        )}
        {competition.location && <span>{competition.location}</span>}
      </div>
      {competition.description && (
        <p className="mt-4 max-w-2xl text-slate-700">
          {competition.description}
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">
          Archives photos
        </h2>
        <div className="mt-4">
          <PhotoGallery photos={photos} />
        </div>
      </section>
    </div>
  );
}
