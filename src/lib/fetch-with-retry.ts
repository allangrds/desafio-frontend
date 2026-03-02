type RetryOptions = {
  maxRetries?: number
  delay?: number
  backoff?: boolean
}

export const fetchWithRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const { maxRetries = 2, delay = 1000, backoff = true } = options

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries) {
        break
      }

      const waitTime = backoff ? delay * 2 ** attempt : delay

      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError || new Error('Failed after retries')
}
