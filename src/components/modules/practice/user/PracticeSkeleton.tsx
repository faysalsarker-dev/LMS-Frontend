import { Skeleton } from "@/components/ui/skeleton";

export const PracticeSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="w-full aspect-video sm:aspect-[3/1] rounded-2xl mb-6" />
        <Skeleton className="h-8 sm:h-10 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full max-w-xl mb-2" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>

      {/* Section title skeleton */}
      <Skeleton className="h-6 w-48 mb-4" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-square rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
};
