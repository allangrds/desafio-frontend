import { Readable } from 'node:stream'
import { google } from 'googleapis'

import { fetchWithRetry } from '@/lib/fetch-with-retry'
import type {
  GetVideosParams,
  SearchVideosParams,
  UploadedVideo,
  Video,
  VideoPrivacy,
  YouTubeVideoItem,
} from '@/types/youtube'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'

  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const seconds = match[3] ? parseInt(match[3], 10) : 0

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
    views: statistics ? parseInt(statistics.viewCount, 10) : 0,
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

export const searchVideos = async (
  query: string,
  params: SearchVideosParams = {},
): Promise<Video[]> => {
  const { maxResults = 10, regionCode = 'US' } = params

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

  const videoIds = searchItems
    .map((item) => item.id?.videoId)
    .filter((id): id is string => !!id)

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

export const uploadVideo = async (
  accessToken: string,
  file: File,
  title: string,
  description: string,
  privacy: VideoPrivacy,
): Promise<UploadedVideo> => {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const stream = Readable.from(buffer)

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: privacy,
      },
    },
    media: {
      body: stream,
    },
  })

  const videoId = response.data.id || ''
  const videoTitle = response.data.snippet?.title || title
  const videoDescription = response.data.snippet?.description || description
  const videoPrivacy = (response.data.status?.privacyStatus ||
    privacy) as VideoPrivacy

  return {
    id: videoId,
    title: videoTitle,
    description: videoDescription,
    privacy: videoPrivacy,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  }
}
