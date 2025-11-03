/* My component video type */
export type Video = {
  id: string
  title: string
  thumbnailUrl: string
  channelName: string
  views: number
  duration: string
  href: string
}

/* Youtube's API video snippet */
export type YouTubeVideoSnippet = {
  title: string
  description: string
  channelTitle: string
  thumbnails: {
    default?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    high?: { url: string; width: number; height: number }
    standard?: { url: string; width: number; height: number }
    maxres?: { url: string; width: number; height: number }
  }
  publishedAt: string
}

/* Youtube's API video statistics */
export type YouTubeVideoStatistics = {
  viewCount: string
  likeCount: string
  commentCount: string
}

/* Youtube's API video content details */
export type YouTubeVideoContentDetails = {
  duration: string // Formato ISO 8601 (ex: PT15M30S)
}

/* Youtube's API video item */
export type YouTubeVideoItem = {
  kind: 'youtube#video'
  id: string
  snippet: YouTubeVideoSnippet
  statistics?: YouTubeVideoStatistics
  contentDetails?: YouTubeVideoContentDetails
}

/* Youtube's API response for video list */
export type YouTubeApiResponse = {
  kind: 'youtube#videoListResponse'
  items: YouTubeVideoItem[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  nextPageToken?: string
  prevPageToken?: string
}

export type GetVideosParams = {
  maxResults?: number
  regionCode?: string
  videoCategoryId?: string
}

export type SearchVideosParams = {
  maxResults?: number
  regionCode?: string
}

export type VideoPrivacy = 'public' | 'private' | 'unlisted'

export type UploadVideoData = {
  title: string
  description?: string
  privacy: VideoPrivacy
  file: File
}

export type UploadedVideo = {
  id: string
  title: string
  description: string
  privacy: VideoPrivacy
  url: string
}

export type UploadProgress = {
  percentage: number
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  message?: string
}
