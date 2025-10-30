import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('Home page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Results page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/results?search=react')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
