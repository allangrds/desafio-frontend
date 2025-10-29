import { VideoPreviewSkeleton } from '@/components/shared/video-preview/video-preview-skeleton'

export type VideoListSkeletonProps = {
  quantity: number
}

export const VideoListSkeleton = ({ quantity }: VideoListSkeletonProps) => (
  <div
    className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse`}
  >
    {Array.from({ length: quantity }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <VideoPreviewSkeleton key={index} />
    ))}
  </div>
)
