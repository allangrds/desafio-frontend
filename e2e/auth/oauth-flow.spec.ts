import { test, expect } from '@playwright/test'

test.describe('OAuth Authentication Flow', () => {
  test('navigating to /auth/signin triggers redirect to Google OAuth', async ({
    page,
  }) => {
    let googleRedirectUrl: string | null = null

    // Listen for any navigation requests to Google
    page.on('request', (request) => {
      const url = request.url()
      if (url.includes('accounts.google.com')) {
        googleRedirectUrl = url
      }
    })

    // Navigate to signin — expect it to redirect to Google
    try {
      await page.goto('/auth/signin', {
        waitUntil: 'networkidle',
        timeout: 10000,
      })
    } catch {
      // Navigation may fail as it redirects to an external URL (Google)
    }

    // Either we captured a request to Google, or the page URL now contains google
    const currentUrl = page.url()
    expect(
      googleRedirectUrl !== null || currentUrl.includes('accounts.google.com'),
    ).toBe(true)
  })

  test('unauthenticated user navigating to /upload is redirected to /auth/signin', async ({
    page,
  }) => {
    await page.goto('/upload', { waitUntil: 'networkidle' })

    // Should be redirected to /auth/signin (which may then redirect to Google)
    const currentUrl = page.url()
    expect(
      currentUrl.includes('/auth/signin') ||
        currentUrl.includes('accounts.google.com'),
    ).toBe(true)
  })
})
