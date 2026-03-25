# 📚 Documentación del Proyecto - tramite_frontend

Esta carpeta contiene **toda la documentación técnica** del proyecto, organizada por categorías para facilitar su búsqueda y mantenimiento.

---

## 📁 Estructura de Directorios

```
docs/
├── auditorias/          # Informes de auditoría de código
├── sprints/             # Reportes de sprints completados
├── guias/               # Guías técnicas y referencias
└── configuracion/       # Configuraciones y setups especiales
```

---

## 📋 Contenido por Carpeta

### 📊 `auditorias/` - Informes de Auditoría

Contiene informes detallados de auditorías de código realizadas:

| Archivo | Descripción |
|---------|-------------|
| `AUDITORIA_UX_ADAPTATIVA.md` | Auditoría de UX con clamp() para responsividad fluida |
| `AUDITORIA_CONTENEDORES_OPTIMIZACION.md` | Optimización de contenedores y layouts |
| `AUDITORIA_ROUTES_COMPLETA.md` | Auditoría completa de todas las rutas |
| `AUDITORIA_I18N_ESPANOL.md` | Traducción de textos al español (i18n) |

**Cuándo crear nuevos archivos:** Después de cada auditoría significativa de código.

---

### 🏃 `sprints/` - Reportes de Sprints

Documentación de sprints completados con métricas y entregables:

| Archivo | Descripción |
|---------|-------------|
| `SPRINT_1_COMPLETED.md` | Primer sprint - Setup inicial |
| `SPRINT_2_ACCESSIBILITY.md` | Sprint 2 - Mejoras de accesibilidad |
| `SPRINT_3_PERFORMANCE.md` | Sprint 3 - Optimización de rendimiento |
| `SPRINT_4_ACCESSIBILITY_COMPLETE.md` | Sprint 4 - Accesibilidad completa |
| `SPRINT_5_TESTING_SUITE.md` | Sprint 5 - Suite de testing |

**Cuándo crear nuevos archivos:** Al finalizar cada sprint, incluyendo resumen de tareas, métricas y lecciones aprendidas.

---

### 📖 `guias/` - Guías Técnicas

Referencias técnicas y guías de implementación:

| Archivo | Descripción |
|---------|-------------|
| `CLAMP_GUIDE_RAPIDO.md` | Guía rápida de uso de clamp() |
| `CONTAINER_STANDARDIZATION.md` | Estándar de contenedores y layouts |
| `CORRECCIONES_ACCESSIBILITY_APPLIED.md` | Correcciones de accesibilidad aplicadas |
| `FIXED_WIDTHS_ELIMINATED.md` | Eliminación de anchos fijos |
| `IMPLEMENTACION_COMPLETA_*.md` | Implementaciones específicas completas |
| `RESUMEN_*.md` | Resúmenes ejecutivos de implementaciones |
| `README_UX_ADAPTATIVA.md` | Guía de UX adaptativa |

**Cuándo crear nuevos archivos:** Cuando se establezcan nuevos patrones o estándares técnicos.

---

### ⚙️ `configuracion/` - Configuraciones

Configuraciones especiales y documentación de herramientas:

| Archivo | Descripción |
|---------|-------------|
| `CHROME_MCP_SETUP.md` | Configuración de Chrome DevTools MCP |
| `SKILLS_INSTALADOS.md` | Skills instalados en el proyecto |
| `TEST_REPORT_CHROME_MCP.md` | Reportes de testing con MCP |

**Cuándo crear nuevos archivos:** Al configurar nuevas herramientas o integraciones.

---

## 🎯 Criterios de Organización

### ✅ Lo que VA en `docs/`

- Informes de auditoría de código
- Reportes de sprints completados
- Guías técnicas y patrones de diseño
- Documentación de configuraciones especiales
- Resúmenes ejecutivos de implementaciones
- Referencias de estándares del proyecto

### ❌ Lo que NO VA en `docs/`

- README principal del proyecto (va en raíz)
- CHANGELOG (va en raíz)
- LICENSE (va en raíz)
- Documentación de API externa (si existe)
- Notas temporales o borradores

---

## 📝 Convenciones de Nomenclatura

### Archivos de Auditoría
```
AUDITORIA_[TEMA]_[DETALLE].md
Ejemplo: AUDITORIA_I18N_ESPANOL.md
```

### Reportes de Sprint
```
SPRINT_[NUMERO]_[TEMA].md
Ejemplo: SPRINT_2_ACCESSIBILITY.md
```

### Guías Técnicas
```
[TEMA]_GUIDE_[TIPO].md o [TEMA]_[ACCION].md
Ejemplo: CLAMP_GUIDE_RAPIDO.md, CONTAINER_STANDARDIZATION.md
```

### Configuraciones
```
[HERRAMIENTA]_SETUP.md o [HERRAMIENTA]_CONFIG.md
Ejemplo: CHROME_MCP_SETUP.md
```

---

## 🔄 Flujo de Trabajo para Nueva Documentación

### 1. Identificar el Tipo

¿Qué tipo de documentación es?
- ¿Auditoría de código? → `auditorias/`
- ¿Sprint completado? → `sprints/`
- ¿Guía/patrón técnico? → `guias/`
- ¿Configuración de herramienta? → `configuracion/`

### 2. Nombrar el Archivo

Seguir las convenciones de nomenclatura anteriores.

### 3. Crear con Template

Usar el template apropiado según el tipo (ver abajo).

### 4. Actualizar este README

Agregar el nuevo archivo a la tabla correspondiente.

### 5. Commit

Hacer commit con mensaje descriptivo siguiendo Conventional Commits.

---

## 📋 Templates por Tipo

### Template para Auditorías

```markdown
# 🔍 [Título de la Auditoría]

**Fecha:** DD de Mes, YYYY  
**Estado:** ✅ COMPLETADO  
**Alcance:** Qué se auditó

---

## 📊 Resumen Ejecutivo

Breve descripción del objetivo y resultados.

### Métricas Generales

| Categoría | Cantidad |
|-----------|----------|
| ... | ... |

---

## 🔧 Hallazgos y Soluciones

Detalle de problemas encontrados y soluciones aplicadas.

---

## 📈 Métricas de Mejora

Comparativa antes/después.

---

## 🏆 Beneficios Obtenidos

Lista de beneficios logrados.

---

## ✅ Verificación

Build status y verificaciones realizadas.
```

### Template para Sprints

```markdown
# 🏃 Sprint [Número] - [Tema Principal]

**Fecha de Inicio:** DD/MM/YYYY  
**Fecha de Fin:** DD/MM/YYYY  
**Estado:** ✅ COMPLETADO  

---

## 📋 Objetivos del Sprint

Lista de objetivos planificados.

---

## ✅ Tareas Completadas

Lista de tareas realizadas con descripciones breves.

---

## 📊 Métricas del Sprint

| Métrica | Valor |
|---------|-------|
| Tareas completadas | X |
| Bugs corregidos | Y |
| ... | ... |

---

## 🎯 Entregables Principales

Lista de entregables clave.

---

## 📚 Lecciones Aprendidas

Reflexiones sobre lo aprendido en el sprint.
```

### Template para Guías Técnicas

```markdown
# 📖 [Título de la Guía]

**Tipo:** Guía Técnica / Patrón de Diseño  
**Última actualización:** DD/MM/YYYY  

---

## 🎯 Propósito

Descripción breve del propósito de esta guía.

---

## 📋 Estándar Aplicado

Explicación del estándar o patrón.

---

## 💡 Ejemplos de Código

### Ejemplo Correcto ✅

```tsx
// Código correcto
```

### Ejemplo Incorrecto ❌

```tsx
// Código incorrecto
```

---

## 🔧 Implementación

Pasos para aplicar este estándar.

---

## 📚 Referencias

Enlaces a documentación relevante.
```

---

## 🚀 Mantenimiento

### Revisión Periódica

Cada 3 meses, revisar:
- Documentos obsoletos (para archivar o eliminar)
- Información desactualizada
- Oportunidades de consolidación

### Archivado

Documentos antiguos o no relevantes se mueven a:
```
docs/_archivo/ (con guion bajo para ordenamiento)
```

---

## 📞 Preguntas Frecuentes

### ¿Puedo poner notas personales aquí?

**No.** Esta carpeta es para documentación técnica formal. Usa tu bloc de notas personal para ideas temporales.

### ¿Qué hago si tengo un borrador?

Guarda borradores en tu directorio personal temporal. Solo mueve a `docs/` cuando esté finalizado y revisado.

### ¿Actualizo este README cada vez?

**Sí.** Cada vez que agregues un archivo nuevo, actualiza la tabla correspondiente en este README.

---

## ✨ Beneficios de esta Organización

✅ **Búsqueda rápida:** Sabes exactamente dónde buscar  
✅ **Mantenimiento sencillo:** Fácil de limpiar y actualizar  
✅ **Historial claro:** Evolución del proyecto documentada  
✅ **Onboarding eficiente:** Nuevos devs encuentran todo rápido  
✅ **Repositorio limpio:** Sin archivos .md regados por todas partes  

---

*Última actualización: 25 de Marzo, 2026*  
*Mantenido por: Equipo de Desarrollo*
