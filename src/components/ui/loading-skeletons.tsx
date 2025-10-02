import { Skeleton } from "@/components/ui/skeleton";

interface PhotoSkeletonProps {
  count?: number;
}

export function PhotoSkeleton({ count = 8 }: Readonly<PhotoSkeletonProps>) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, idx) => `skeleton-${idx}`).map(
        (id) => (
          <li key={id}>
            <div className="group relative overflow-hidden rounded-md border">
              <Skeleton className="w-full aspect-square" />
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export function RoomHeaderSkeleton() {
  return (
    <header className="mb-6 mx-auto">
      <Skeleton className="h-8 w-64 mx-auto mb-4" />
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </header>
  );
}

export function UploadFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-input flex min-h-56 flex-col items-center rounded-xl border border-dashed p-6">
        <Skeleton className="size-12 rounded-full mb-3" />
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
