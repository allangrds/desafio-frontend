import { test as base } from '@playwright/test'

export const test = base.extend<{ authenticatedPage: undefined }>({
  authenticatedPage: async ({ page }, use) => {
    await page.request.post('/api/test/session', {
      data: {
        user: {
          name: 'Test User',
          picture: '',
          email: 'test@example.com',
          channelTitle: 'Test Channel',
        },
        tokens: {
          accessToken: 'mock-access-token',
        },
      },
    })
    await use(undefined)
    await page.request.delete('/api/test/session')
  },
})

export { expect } from '@playwright/test'
