/**
 * Tipos para integração com YouTube Data API v3
 */

/**
 * Representa um vídeo formatado para uso nos componentes da aplicação
 * Compatível com VideoPreviewProps
 */
export type Video = {
  id: string
  title: string
  thumbnailUrl: string
  channelName: string
  views: number
  duration: string
  href: string
}

/**
 * Snippet de vídeo retornado pela YouTube API
 */
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

/**
 * Estatísticas de um vídeo do YouTube
 */
export type YouTubeVideoStatistics = {
  viewCount: string
  likeCount: string
  commentCount: string
}

/**
 * Detalhes de conteúdo de um vídeo do YouTube
 */
export type YouTubeVideoContentDetails = {
  duration: string // Formato ISO 8601 (ex: PT15M30S)
}

/**
 * Item de vídeo retornado pela YouTube API
 */
export type YouTubeVideoItem = {
  kind: 'youtube#video'
  id: string
  snippet: YouTubeVideoSnippet
  statistics?: YouTubeVideoStatistics
  contentDetails?: YouTubeVideoContentDetails
}

/**
 * Resposta da YouTube API para listagem de vídeos
 */
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

/**
 * Parâmetros para buscar vídeos
 */
export type GetVideosParams = {
  maxResults?: number
  regionCode?: string
  videoCategoryId?: string
}

/**
 * Parâmetros para pesquisar vídeos
 */
export type SearchVideosParams = {
  maxResults?: number
  regionCode?: string
}
