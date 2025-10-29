import { google } from 'googleapis'
import type { Video, YouTubeVideoItem, GetVideosParams } from '@/types/youtube'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

/**
 * Converte duração ISO 8601 (PT15M30S) para formato legível (15:30)
 */
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

/**
 * Transforma item da API YouTube em nosso tipo Video
 */
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

/**
 * Busca vídeos do YouTube com parâmetros customizáveis
 */
export const getVideos = async (
  params: GetVideosParams = {},
): Promise<Video[]> => {
  const { maxResults = 3, regionCode = 'US', videoCategoryId } = params

  const response = await youtube.videos.list({
    part: ['snippet', 'statistics', 'contentDetails'],
    chart: 'mostPopular',
    regionCode,
    videoCategoryId,
    maxResults,
  })

  const items = (response.data.items || []) as YouTubeVideoItem[]
  return items.map(transformYouTubeVideo)
}
