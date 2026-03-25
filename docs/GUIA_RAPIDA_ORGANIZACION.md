# 📁 Guía Rápida - Organización de Documentación

**Propósito:** Estándar para mantener la documentación organizada y evitar archivos `.md` regados en el proyecto.

---

## ⚡ Regla de Oro

> **NUNCA crees archivos `.md` en la raíz del proyecto o carpetas de código.**  
> **SIEMPRE usa la estructura `docs/` con sus subcarpetas.**

---

## 🎯 ¿Dónde va cada archivo?

### 1. ¿Es una auditoría de código?
**Ejemplos:** Auditoría de UX, auditoría de rutas, auditoría de i18n

```
✅ docs/auditorias/AUDITORIA_[TEMA].md
❌ AUDITORIA_[TEMA].md (en la raíz)
```

---

### 2. ¿Es un sprint completado?
**Ejemplos:** Sprint de accesibilidad, sprint de performance

```
✅ docs/sprints/SPRINT_[N]_[TEMA].md
❌ SPRINT_[N]_[TEMA].md (en la raíz)
```

---

### 3. ¿Es una guía técnica o patrón?
**Ejemplos:** Guía de clamp(), estándar de contenedores, correcciones aplicadas

```
✅ docs/guias/[TEMA]_[ACCION].md
❌ [TEMA]_[ACCION].md (en la raíz)
```

---

### 4. ¿Es configuración de herramientas?
**Ejemplos:** Setup de MCP, skills instalados, reportes de testing

```
✅ docs/configuracion/[HERRAMIENTA]_SETUP.md
❌ [HERRAMIENTA]_SETUP.md (en la raíz)
```

---

## 🚀 Flujo Rápido para Nueva Documentación

### Paso 1: Identificar Categoría

¿Qué tipo de documento es?
- Auditoría → `auditorias/`
- Sprint → `sprints/`
- Guía → `guias/`
- Configuración → `configuracion/`

### Paso 2: Nombrar Archivo

Usa las convenciones:
- Mayúsculas sostenidas
- Guiones bajos para separar palabras
- Sufijos descriptivos

### Paso 3: Crear en la Carpeta Correcta

```bash
# Ejemplo: Crear nueva auditoría
New File → docs/auditorias/AUDITORIA_PERFORMANCE.md

# Ejemplo: Crear nueva guía
New File → docs/guias/PERFORMANCE_OPTIMIZATION.md
```

### Paso 4: Usar Template

Copia el template apropiado desde `docs/README.md`

### Paso 5: Actualizar Índice

Agrega el archivo a la tabla en `docs/README.md`

### Paso 6: Commit

```bash
git add docs/auditorias/AUDITORIA_PERFORMANCE.md
git commit -m "docs(auditorias): add performance audit report"
```

---

## 📋 Convenciones de Nombres

### Auditorías
```
AUDITORIA_[TEMA]_[DETALLE OPCIONAL].md

Ejemplos:
✅ AUDITORIA_I18N_ESPANOL.md
✅ AUDITORIA_ROUTES_COMPLETA.md
❌ i18n-audit.md (muy informal)
❌ AuditoriaI18n.md (sin guiones)
```

### Sprints
```
SPRINT_[NUMERO]_[TEMA_PRINCIPAL].md

Ejemplos:
✅ SPRINT_2_ACCESSIBILITY.md
✅ SPRINT_5_TESTING_SUITE.md
❌ sprint2.md (muy genérico)
❌ Sprint-2-Accessibility.md (formato inconsistente)
```

### Guías
```
[TEMA]_[ACCION/PROPOSITO].md

Ejemplos:
✅ CLAMP_GUIDE_RAPIDO.md
✅ CONTAINER_STANDARDIZATION.md
✅ FIXED_WIDTHS_ELIMINATED.md
❌ como-usar-clamp.md (informal)
❌ GuiaDeClamp.md (sin separadores claros)
```

### Configuraciones
```
[HERRAMIENTA]_SETUP.md o [HERRAMIENTA]_CONFIG.md

Ejemplos:
✅ CHROME_MCP_SETUP.md
✅ SKILLS_INSTALADOS.md
❌ config-mcp.md (muy informal)
❌ MCP_Configuration.md (mezcla idiomas)
```

---

## 🎨 Templates Rápidos

### Template Mínimo - Auditoría

```markdown
# 🔍 [Título de la Auditoría]

**Fecha:** DD/MM/YYYY  
**Estado:** ✅ COMPLETADO  

---

## 📊 Resumen

[2-3 oraciones describiendo el objetivo]

---

## 🔧 Cambios Realizados

[Lista de cambios principales]

---

## 📈 Resultados

[Métricas o resultados clave]
```

### Template Mínimo - Sprint

```markdown
# 🏃 Sprint [N] - [Tema]

**Fechas:** DD/MM al DD/MM/YYYY  
**Estado:** ✅ COMPLETADO  

---

## ✅ Tareas Completadas

- [ ] Tarea 1
- [ ] Tarea 2

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| Total tareas | X |
```

### Template Mínimo - Guía

```markdown
# 📖 [Título de la Guía]

**Tipo:** Guía Técnica  
**Actualizado:** DD/MM/YYYY  

---

## 🎯 Propósito

[Para qué sirve esta guía]

---

## 💡 Ejemplo

### Correcto ✅
```tsx
// Código correcto
```

### Incorrecto ❌
```tsx
// Código incorrecto
```
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo poner notas temporales aquí?

**No.** Las notas temporales van en tu bloc de notas personal, no en el repositorio.

### ¿Qué hago si el archivo queda muy largo?

Divídelo en múltiples archivos:
- `AUDITORIA_UX_ADAPTATIVA.md` → General
- `AUDITORIA_UX_CONTENEDORES.md` → Específico

### ¿Necesito actualizar docs/README.md siempre?

**Sí.** Cada vez que agregues un archivo nuevo, actualiza la tabla correspondiente.

### ¿Puedo mover archivos antiguos después?

**Sí.** De hecho, ¡eso acabamos de hacer! Movimos 23 archivos a la estructura nueva.

---

## 🔍 Checklist Antes de Crear Archivo

Antes de crear un nuevo `.md`, verifica:

- [ ] ¿Realmente necesito documentar esto?
- [ ] ¿Ya existe un archivo similar que pueda actualizar?
- [ ] ¿Estoy usando la carpeta correcta?
- [ ] ¿El nombre sigue las convenciones?
- [ ] ¿Usé el template apropiado?
- [ ] ¿Actualicé docs/README.md?

---

## 🎯 Beneficios de esta Organización

### Para Ti

✅ Fácil encontrar tus propios documentos  
✅ Plantillas claras para seguir  
✅ Historial preservado en git  

### Para el Equipo

✅ Onboarding más rápido de nuevos devs  
✅ Conocimiento compartido y organizado  
✅ Referencias técnicas accesibles  

### Para el Proyecto

✅ Repositorio limpio y profesional  
✅ Documentación mantenible  
✅ Menos duplicación de contenido  

---

## 📞 ¿Dudas?

Si tienes dudas sobre dónde va algo o cómo nombrarlo:

1. Revisa `docs/README.md`
2. Mira ejemplos de archivos existentes
3. Pregunta al equipo

---

*Última actualización: 25 de Marzo, 2026*  
*Esta guía evoluciona con el proyecto - contribuye mejoras!*
