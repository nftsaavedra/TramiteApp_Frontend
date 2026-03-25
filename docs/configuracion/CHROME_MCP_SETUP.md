# 🌐 Chrome DevTools MCP - Configuración

**Fecha**: March 20, 2026  
**Estado**: ✅ **INSTALADO Y CONFIGURADO**  
**Versión**: Latest (2026)

---

## ✅ Instalación Completada

### Paquete Instalado
```bash
npm install -g chrome-devtools-mcp@latest
```

**Ubicación**: Global (disponible en todo el sistema)  
**Estado**: ✅ Activo

---

## 🔧 Configuración Requerida

### Opción 1: Para Claude Desktop / AI Assistants

Si usas Claude Desktop u otro AI assistant que soporta MCP:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {}
    }
  }
}
```

**Archivos de configuración según plataforma:**

- **Claude Desktop**: `~/.claude.json` o `%APPDATA%\Claude\claude.json`
- **VS Code Extensions**: `.vscode/mcp.json` en tu proyecto
- **Cherry Studio**: Configuración interna del plugin
- **Otros**: Seguir documentación específica

---

### Opción 2: Uso Directo desde Terminal

El MCP ya está instalado globalmente. Puedes usarlo directamente:

```bash
# Iniciar servidor MCP
npx chrome-devtools-mcp@latest

# Conectar a Chrome existente (puerto 9222)
npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222

# Modo headless (sin UI)
npx chrome-devtools-mcp@latest --headless

# Con viewport personalizado
npx chrome-devtools-mcp@latest --viewport 1920x1080
```

---

## 🚀 Preparar Chrome para Debugging

### Paso 1: Cerrar Chrome Completamente

```powershell
taskkill /F /IM chrome.exe
```

### Paso 2: Iniciar Chrome con Remote Debugging

**Opción A - Chrome Normal:**
```powershell
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="D:\chrome-debug-profile"
```

**Opción B - Usando el propio MCP (Auto-connect):**
```bash
npx chrome-devtools-mcp@latest --autoConnect --channel stable
```

### Verificar Conexión

Abre en tu navegador:
```
http://127.0.0.1:9222/json/version
```

Deberías ver información de la versión de Chrome.

---

## 🛠️ Herramientas Disponibles

### Input Automation (9 tools)
- `click` - Click en elementos
- `drag` - Arrastrar elementos
- `fill` - Rellenar inputs
- `fill_form` - Rellenar formularios completos
- `handle_dialog` - Manejar diálogos
- `hover` - Hover sobre elementos
- `press_key` - Presionar teclas
- `type_text` - Escribir texto
- `upload_file` - Subir archivos

### Navigation (6 tools)
- `close_page` - Cerrar páginas
- `list_pages` - Listar páginas abiertas
- `navigate_page` - Navegar a URLs
- `new_page` - Abrir nueva pestaña
- `select_page` - Seleccionar página activa
- `wait_for` - Esperar por texto

### Emulation (2 tools)
- `emulate` - Emular dispositivos/red
- `resize_page` - Cambiar tamaño de ventana

### Performance (4 tools) ⭐ **ÚTIL PARA SPRINT 3**
- `performance_analyze_insight` - Analizar métricas de performance
- `performance_start_trace` - Iniciar trace de performance
- `performance_stop_trace` - Detener trace
- `take_memory_snapshot` - Capturar snapshot de memoria

### Network (2 tools)
- `get_network_request` - Obtener request específica
- `list_network_requests` - Listar todas las requests

### Debugging (6 tools)
- `evaluate_script` - Ejecutar JavaScript
- `get_console_message` - Leer consola
- `lighthouse_audit` - Auditoría Lighthouse
- `list_console_messages` - Listar mensajes de consola
- `take_screenshot` - Capturar pantalla
- `take_snapshot` - Snapshot del DOM

---

## 💡 Ejemplos de Uso con AI Assistant

Una vez configurado en tu AI assistant, podrás pedir:

### Testing Básico
```
- "Abre http://localhost:5174 y toma una screenshot"
- "Haz click en el botón de login"
- "Rellena el formulario con datos de prueba"
- "Extrae todos los errores de la consola"
```

### Performance (SPRINT 3) ⭐
```
- "Ejecuta un performance trace de la página de inicio"
- "Analiza los Core Web Vitals (LCP, FID, CLS)"
- "Identifica cuellos de botella en la carga"
- "Toma un memory snapshot para detectar leaks"
```

### Accessibility
```
- "Ejecuta un lighthouse audit de accesibilidad"
- "Verifica el contraste de colores"
- "Revisa la navegación por teclado"
```

### Responsive
```
- "Emula un iPhone 14 Pro y toma screenshot"
- "Prueba en viewport 375x667 (móvil)"
- "Verifica breakpoints en 768px y 1024px"
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to Chrome"

**Solución:**
1. Verifica que Chrome esté corriendo con `--remote-debugging-port=9222`
2. Ejecuta: `netstat -ano | findstr :9222` (debe mostrar LISTENING)
3. Reinicia Chrome con los flags correctos

### Error: "MCP server not found"

**Solución:**
```bash
# Reinstalar
npm uninstall -g chrome-devtools-mcp
npm install -g chrome-devtools-mcp@latest

# Verificar instalación
npx chrome-devtools-mcp@latest --version
```

### Error: "Permission denied"

**Solución (Windows):**
- Ejecuta PowerShell como Administrador
- O instala sin `-g` (local por proyecto)

---

## 📊 Configuración Actual del Proyecto

### Estado:
- ✅ **Paquete instalado**: Global (`npm install -g`)
- ✅ **Version**: Latest (2026)
- ⬜ **Configuración en AI assistant**: Pendiente (depende de qué uses)
- ✅ **Listo para usar**: Vía terminal o config manual

### Archivos Creados:
- `CHROME_MCP_SETUP.md` - Esta guía

### Próximos Pasos:
1. Configurar en tu AI assistant específico (si es necesario)
2. Iniciar Chrome con remote debugging
3. **¡Listo para Sprint 3!**

---

## 🎯 Integración con Sprint 3

Ahora que el Chrome DevTools MCP está instalado, podemos usarlo para:

### Performance Testing Automatizado
```bash
# Desde tu AI assistant:
"Ejecuta performance_start_trace en http://localhost:5174"
"Analiza LCP y CLS con performance_analyze_insight"
"Toma screenshots de los problemas encontrados"
```

### Network Analysis
```bash
# Para debugging de APIs:
"Lista todas las network requests"
"Busca requests fallidas al endpoint /api/users"
"Muestra el timing de cada request"
```

### Accessibility Audits
```bash
# WCAG compliance:
"Ejecuta lighthouse_audit con categoría accessibility"
"Reporta todas las violaciones AA"
```

---

**Recursos Oficiales:**
- GitHub: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Docs: https://github.com/ChromeDevTools/chrome-devtools-mcp/tree/main/docs
- Tool Reference: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md

---

**Estado**: ✅ **CONFIGURACIÓN COMPLETADA**  
**Listo para**: Sprint 3 - Performance Polish  
**Próximo paso**: Iniciar Chrome y ejecutar auditoría de performance
