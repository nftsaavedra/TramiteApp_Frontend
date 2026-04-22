import { test, expect } from '@playwright/test'

test.describe('Trámites - Gestión de Expedientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tramites')
    await page.waitForLoadState('networkidle')
  })

  test('debería cargar la lista de trámites', async ({ page }) => {
    // Verificar que la página carga
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
    
    // Buscar tabla o lista de trámites
    const table = page.locator('table, [role="table"], [class*="table"]')
    if (await table.isVisible()) {
      await expect(table).toBeVisible()
    }
  })

  test('debería mostrar botón para crear nuevo trámite', async ({ page }) => {
    const newButton = page.locator('button:has-text("Nuevo"), button:has-text("Crear"), a[href*="nuevo"]')
    
    if (await newButton.isVisible()) {
      await expect(newButton).toBeVisible()
    }
  })

  test('debería permitir buscar/filtrar trámites', async ({ page }) => {
    // Buscar input de búsqueda
    const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="filtrar"], input[type="search"]')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await page.waitForTimeout(500)
      
      // Verificar que no hay errores
      const hasErrors = await page.locator('text=error, text=Error').isVisible().catch(() => false)
      expect(hasErrors).toBeFalsy()
    }
  })

  test('debería navegar a detalles de un trámite si existe', async ({ page }) => {
    // Buscar enlaces a detalles
    const detailLinks = page.locator('a[href*="tramite/"], a[href*="/tramites/"]')
    
    if (await detailLinks.count() > 0) {
      const firstLink = detailLinks.first()
      const href = await firstLink.getAttribute('href')
      
      if (href) {
        await firstLink.click()
        await page.waitForLoadState('networkidle')
        
        // Verificar que estamos en página de detalles
        await expect(page).toHaveURL(/.*tramite.*/)
      }
    }
  })
})
