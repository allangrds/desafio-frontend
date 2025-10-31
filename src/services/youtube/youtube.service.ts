import { google } from 'googleapis'
import type {
  Video,
  YouTubeVideoItem,
  GetVideosParams,
  SearchVideosParams,
} from '@/types/youtube'
import { fetchWithRetry } from '@/lib/fetch-with-retry'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const transformYouTubeVideo = (item: YouTubeVideoItem): Video => {
  const { id, snippet, statistics, contentDetails } = item

  return {
    id,
    title: snippet.title,
    thumbnailUrl:
      snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || '',
    channelName: snippet.channelTitle,
    views: statistics ? parseInt(statistics.viewCount) : 0,
    duration: contentDetails ? formatDuration(contentDetails.duration) : '0:00',
    href: `https://www.youtube.com/watch?v=${id}`,
  }
}

export const getVideos = async (
  params: GetVideosParams = {},
): Promise<Video[]> => {
  const { maxResults = 3, regionCode = 'US', videoCategoryId } = params

  const response = await fetchWithRetry(
    () =>
      youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        chart: 'mostPopular',
        regionCode,
        videoCategoryId,
        maxResults,
      }),
    { maxRetries: 2, delay: 1000 },
  )

  const items = (response.data.items || []) as YouTubeVideoItem[]
  return items.map(transformYouTubeVideo)
}

/**
 * Pesquisa vídeos do YouTube por termo de busca
 *
 * @remarks
 * Performs a two-step process:
 * 1. Search for videos matching the query
 * 2. Fetch detailed information (views, duration) for found videos
 *
 * Both API calls use retry logic to handle temporary failures.
 */
export const searchVideos = async (
  query: string,
  params: SearchVideosParams = {},
): Promise<Video[]> => {
  const { maxResults = 10, regionCode = 'US' } = params

  // First, search for videos with retry logic
  const searchResponse = await fetchWithRetry(
    () =>
      youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults,
        regionCode,
      }),
    { maxRetries: 2, delay: 1000 },
  )

  const searchItems = searchResponse.data.items || []

  if (searchItems.length === 0) {
    return []
  }

  // Extract video IDs
  const videoIds = searchItems
    .map((item) => item.id?.videoId)
    .filter((id): id is string => !!id)

  // Fetch detailed video information with retry logic
  const videosResponse = await fetchWithRetry(
    () =>
      youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      }),
    { maxRetries: 2, delay: 1000 },
  )

  const videoItems = (videosResponse.data.items || []) as YouTubeVideoItem[]
  return videoItems.map(transformYouTubeVideo)
}
