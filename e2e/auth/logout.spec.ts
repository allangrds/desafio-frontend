import { test, expect } from '../../e2e/fixtures/auth'

test.describe('Logout Flow', () => {
  test('trigger logout → user redirected to home page', async ({
    page,
    authenticatedPage,
  }) => {
    void authenticatedPage

    // Navigate to upload to confirm we're authenticated
    await page.goto('/upload', { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/upload')

    // Trigger logout by navigating to the logout API endpoint
    await page.goto('/api/auth/logout', { waitUntil: 'networkidle' })

    // Should be redirected to home page
    expect(page.url()).toMatch(/http:\/\/localhost:3000\/?$/)
  })

  test('after logout, navigating to /upload redirects to /auth/signin', async ({
    page,
    authenticatedPage,
  }) => {
    void authenticatedPage

    // Logout first
    await page.goto('/api/auth/logout', { waitUntil: 'networkidle' })

    // Attempt to access upload page
    await page.goto('/upload', { waitUntil: 'networkidle' })

    // Should be redirected away from upload
    const currentUrl = page.url()
    expect(
      currentUrl.includes('/auth/signin') ||
        currentUrl.includes('accounts.google.com'),
    ).toBe(true)
  })
})
