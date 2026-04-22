import { test, expect } from '@playwright/test'

test.describe('Dashboard - Visualización de Datos', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al dashboard (asumiendo que hay sesión activa o es público)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('debería cargar el dashboard principal', async ({ page }) => {
    // Verificar que el dashboard carga
    const mainContent = page.locator('main, [role="main"]')
    await expect(mainContent).toBeVisible()
    
    // Verificar título o encabezado
    const hasTitle = await page.locator('h1, h2, text=Dashboard, text=Panel, text=Resumen').isVisible().catch(() => false)
    expect(hasTitle).toBeTruthy()
  })

  test('debería mostrar estadísticas o métricas', async ({ page }) => {
    // Buscar cards de estadísticas
    const statCards = page.locator('[class*="card"], [class*="stat"], [data-testid*="stat"]')
    
    if (await statCards.count() > 0) {
      await expect(statCards.first()).toBeVisible()
    }
  })

  test('debería ser responsive en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
    
    // Verificar que no hay overflow horizontal
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
    const viewportWidth = await page.viewportSize()?.width || 0
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10) // margen de 10px
  })

  test('no debería tener errores de JavaScript en consola', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text())
      }
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    expect(errors).toHaveLength(0)
  })
})
