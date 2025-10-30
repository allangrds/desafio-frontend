import Image from 'next/image'
import Link from 'next/link'

export type VideoPreviewProps = {
  title: string
  thumbnailUrl: string
  channelName: string
  views: number
  duration: string
  href: string
}

function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`
  }

  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K`
  }

  return views.toString()
}

export const VideoPreview = ({
  title,
  thumbnailUrl,
  channelName,
  views,
  duration,
  href,
}: VideoPreviewProps) => (
  <article className={'group flex flex-col gap-3 cursor-pointer'}>
    <Link
      href={href}
      className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Image
        src={thumbnailUrl}
        alt={`Thumbnail for ${title}`}
        fill
        className="object-cover transition-transform duration-200 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
        {duration}
      </div>
    </Link>

    <div className="flex flex-col gap-1">
      <Link
        href={href}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
      >
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
      </Link>

      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
        {channelName}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-500">
        {formatViews(views)} views
      </p>
    </div>
  </article>
)
