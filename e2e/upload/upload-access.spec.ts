import { expect, test } from '../../e2e/fixtures/auth'

test.describe('Upload Page Access', () => {
  test('unauthenticated user visiting /upload is redirected to /auth/signin', async ({
    page,
  }) => {
    await page.goto('/upload', { waitUntil: 'networkidle' })

    const currentUrl = page.url()
    expect(
      currentUrl.includes('/auth/signin') ||
        currentUrl.includes('accounts.google.com'),
    ).toBe(true)
  })

  test('authenticated user visiting /upload sees the upload form', async ({
    page,
    authenticatedPage,
  }) => {
    void authenticatedPage // fixture injects the session

    await page.goto('/upload', { waitUntil: 'networkidle' })

    // Verify upload form fields are visible
    await expect(page.locator('#title')).toBeVisible()
    await expect(page.locator('#description')).toBeVisible()
    await expect(page.locator('#privacy')).toBeVisible()
    await expect(page.locator('#file')).toBeVisible()
  })
})
