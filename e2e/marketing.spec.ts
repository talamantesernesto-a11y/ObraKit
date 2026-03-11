import { test, expect } from '@playwright/test'

test.describe('Marketing pages', () => {
  test('homepage loads and shows ObraKit branding', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ObraKit/i)
  })

  test('lien waivers page loads', async ({ page }) => {
    await page.goto('/lien-waivers')
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Auth pages', () => {
  test('login page loads with email input', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })
})
