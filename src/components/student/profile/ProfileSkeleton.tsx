import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProfileHeaderSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
    <CardContent className="p-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Avatar skeleton */}
        <Skeleton className="w-32 h-32 rounded-full" />
        
        {/* Info skeleton */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          <Skeleton className="h-8 w-48 mx-auto lg:mx-0" />
          <Skeleton className="h-5 w-64 mx-auto lg:mx-0" />
          <Skeleton className="h-4 w-40 mx-auto lg:mx-0" />
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ProfileStatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i} className="border-0 shadow-md">
        <CardContent className="p-6 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const CourseCardSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-md">
    <Skeleton className="h-40 w-full" />
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
);

export const CoursesTabSkeleton = () => (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <Skeleton className="h-7 w-32" />
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Profile Card */}
      <ProfileHeaderSkeleton />

      {/* Stats */}
      <ProfileStatsSkeleton />

      {/* Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <CoursesTabSkeleton />
        </CardContent>
      </Card>
    </div>
  </div>
);
