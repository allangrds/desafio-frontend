export type User = {
  name: string
  picture: string
  email: string
  channelTitle: string
}

export type Tokens = {
  accessToken: string
  refreshToken?: string
  expiryDate?: number
}

export type SessionData = {
  user: User
  tokens: Tokens
}
