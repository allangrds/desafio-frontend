import { expect, test } from '../../e2e/fixtures/auth'

// Use a specific locator for the upload form submit button (not the header search button)
const UPLOAD_SUBMIT = 'button:has-text("Upload Video"):not([aria-label])'

test.describe('Upload Form Flow', () => {
  test.describe('Successful and Error Flows', () => {
    test('fill title + attach valid MP4 → mock success response → success card visible', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      await page.goto('/upload', { waitUntil: 'networkidle' })

      await page.route('**/api/videos', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'v1',
            title: 'My Video',
            description: '',
            privacy: 'public',
            url: 'https://youtu.be/v1',
          }),
        })
      })

      await page.fill('#title', 'My Video')

      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'sample.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(
        page.getByRole('link', { name: 'View on YouTube' }),
      ).toBeVisible({ timeout: 20000 })
      await expect(page.getByText('My Video', { exact: false })).toBeVisible()
    })

    test('fill form → mock API returns 500 → error message visible', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      await page.goto('/upload', { waitUntil: 'networkidle' })

      await page.route('**/api/videos', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to upload video' }),
        })
      })

      await page.fill('#title', 'My Video')

      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'sample.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(
        page.getByText('Failed to upload video. Please try again.'),
      ).toBeVisible({ timeout: 15000 })
      await expect(
        page.getByRole('link', { name: 'View on YouTube' }),
      ).not.toBeVisible()
    })
  })

  test.describe('Form Validation', () => {
    test('submit without title → title validation error visible, no API call', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      let apiCalled = false
      await page.route('**/api/videos', (route) => {
        apiCalled = true
        route.abort()
      })

      await page.goto('/upload', { waitUntil: 'networkidle' })

      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'sample.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(page.getByText('Title is required')).toBeVisible()
      expect(apiCalled).toBe(false)
    })

    test('attach file > 100MB → file size validation error visible', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      let apiCalled = false
      await page.route('**/api/videos', (route) => {
        apiCalled = true
        route.abort()
      })

      await page.goto('/upload', { waitUntil: 'networkidle' })

      await page.fill('#title', 'Test Video')

      // Attach a small file then override its size via JS to simulate 101MB
      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'large.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.evaluate(() => {
        const input = document.querySelector('#file') as HTMLInputElement
        const originalFile = input.files?.[0]
        if (!originalFile) return

        const oversizedFile = new File([new ArrayBuffer(0)], 'large.mp4', {
          type: 'video/mp4',
        })
        Object.defineProperty(oversizedFile, 'size', {
          value: 101 * 1024 * 1024,
          writable: false,
        })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(oversizedFile)
        input.files = dataTransfer.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(page.getByText('Max file size is 100MB')).toBeVisible()
      expect(apiCalled).toBe(false)
    })

    test('attach .avi file (wrong MIME type) → format validation error visible', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      let apiCalled = false
      await page.route('**/api/videos', (route) => {
        apiCalled = true
        route.abort()
      })

      await page.goto('/upload', { waitUntil: 'networkidle' })

      await page.fill('#title', 'Test Video')

      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'video.avi',
        mimeType: 'video/avi',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(
        page.getByText('Only .mp4, .webm, .ogg and .mov formats are supported'),
      ).toBeVisible()
      expect(apiCalled).toBe(false)
    })

    test('enter 101-character title → title length validation error visible', async ({
      page,
      authenticatedPage,
    }) => {
      void authenticatedPage

      let apiCalled = false
      await page.route('**/api/videos', (route) => {
        apiCalled = true
        route.abort()
      })

      await page.goto('/upload', { waitUntil: 'networkidle' })

      await page.fill('#title', 'a'.repeat(101))

      const fileInput = page.locator('#file')
      await fileInput.setInputFiles({
        name: 'sample.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.alloc(1024, 0),
      })

      await page.locator(UPLOAD_SUBMIT).click()

      await expect(
        page.getByText('Title must be 100 characters or less'),
      ).toBeVisible()
      expect(apiCalled).toBe(false)
    })
  })
})
