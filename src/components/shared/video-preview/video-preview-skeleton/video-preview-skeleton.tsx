import { Skeleton } from '@/components/ui/skeleton'

export const VideoPreviewSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse" aria-busy="true">
    <Skeleton className="h-80 w-full rounded-lg" />
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-full rounded" />
    </div>
  </div>
)
