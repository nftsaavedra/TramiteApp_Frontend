import { test, expect } from '@playwright/test'

test.describe('Tramite App - Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que la página carga
    await expect(page).toHaveTitle(/Tramite/)
    
    // Verificar elementos principales
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Buscar botón o link de login
    const loginButton = page.locator('a[href*="login"], button:has-text("Login"), button:has-text("Ingresar")')
    
    if (await loginButton.isVisible()) {
      await loginButton.click()
      
      // Esperar navegación a login
      await expect(page).toHaveURL(/.*login.*/)
      
      // Verificar formulario de login
      const emailInput = page.locator('input[type="email"], input[name="email"]')
      await expect(emailInput).toBeVisible()
    }
  })

  test('should display responsive layout on mobile', async ({ page }) => {
    // Emular dispositivo móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Verificar que el contenido es visible en móvil
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
    
    // Verificar menú hamburguesa (si existe)
    const mobileMenu = page.locator('[aria-label*="menu"], button[aria-expanded]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      // Menú debería abrirse
    }
  })

  test('should not have any console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    
    // No debería haber errores
    expect(errors).toHaveLength(0)
  })
})
