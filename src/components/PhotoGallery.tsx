import Image from "next/image";

type Photo = {
  id: string;
  photo_url: string;
  caption?: string | null;
};

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return <p className="text-sm text-slate-400">Aucune photo pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={photo.photo_url}
              alt={photo.caption ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          {photo.caption && (
            <figcaption className="p-2 text-xs text-slate-500">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
