import { test, expect } from '@playwright/test'

test.describe('Autenticación - Flujos Críticos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('debería mostrar formulario de login correctamente', async ({ page }) => {
    // Verificar elementos del formulario
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="correo"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"]')
    const submitButton = page.locator('button[type="submit"], button:has-text("Ingresar"), button:has-text("Login")')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('debería validar campos requeridos', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    // Intentar enviar sin datos
    await submitButton.click()
    
    // Debería mostrar errores de validación o no enviar
    await page.waitForTimeout(1000)
    
    // Verificar que seguimos en login (no redirigió)
    await expect(page).toHaveURL(/.*login.*/)
  })

  test('debería intentar login con credenciales inválidas', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="correo"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"]')
    const submitButton = page.locator('button[type="submit"]')

    await emailInput.fill('usuario@invalido.com')
    await passwordInput.fill('contraseña-incorrecta')
    await submitButton.click()

    // Esperar respuesta del servidor
    await page.waitForTimeout(2000)

    // Debería mostrar error o permanecer en login
    const hasError = await page.locator('text=error, text=Error, text=inválido, text=incorrect').isVisible().catch(() => false)
    const stillOnLogin = await page.url().includes('login')
    
    expect(hasError || stillOnLogin).toBeTruthy()
  })

  test('debería navegar a forgot-password', async ({ page }) => {
    const forgotLink = page.locator('a[href*="forgot"], a:has-text("olvid"), a:has-text("recuper")')
    
    if (await forgotLink.isVisible()) {
      await forgotLink.click()
      await expect(page).toHaveURL(/.*forgot.*/)
    }
  })
})
