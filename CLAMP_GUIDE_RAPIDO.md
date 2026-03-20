# 📐 Guía Rápida - UX Adaptativa con Clamp()

## Fórmulas Pre-calculadas

Usa estas fórmulas directamente en tu código:

---

### 📝 Tipografía

```css
/* Textos pequeños */
--text-xs: clamp(0.75rem, 0.6875rem + 0.3125vw, 0.875rem);
--text-sm: clamp(0.8125rem, 0.75rem + 0.3125vw, 0.9375rem);

/* Textos base */
--text-base: clamp(0.875rem, 0.8125rem + 0.375vw, 1rem);
--text-lg: clamp(0.9375rem, 0.875rem + 0.375vw, 1.125rem);

/* Títulos */
--text-xl: clamp(1rem, 0.9375rem + 0.375vw, 1.25rem);
--text-2xl: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);
--text-3xl: clamp(1.25rem, 1.125rem + 0.75vw, 1.75rem);
--text-4xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
--text-5xl: clamp(1.75rem, 1.5rem + 1.5vw, 2.5rem);
```

---

### 📏 Spacing

```css
/* Spacing mínimo */
--spacing-xs: clamp(0.5rem, 0.4375rem + 0.3125vw, 0.75rem);

/* Spacing pequeño */
--spacing-sm: clamp(0.75rem, 0.625rem + 0.625vw, 1rem);

/* Spacing medio */
--spacing-md: clamp(1rem, 0.875rem + 0.625vw, 1.5rem);

/* Spacing grande */
--spacing-lg: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);

/* Spacing muy grande */
--spacing-xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
--spacing-2xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);
```

---

### 🔲 Container Max-Width

```tsx
// Size 'sm' - Contenedores estrechos
max-w-[clamp(24rem, 20rem + 20vw, 40rem)]

// Size 'md' - Contenedores medianos
max-w-[clamp(40rem, 35rem + 25vw, 48rem)]

// Size 'lg' - Contenedores estándar (REFERENCIA)
max-w-[clamp(48rem, 40rem + 30vw, 64rem)]

// Size 'xl' - Contenedores amplios
max-w-[clamp(64rem, 55rem + 35vw, 80rem)]

// Size '2xl' - Contenedores muy amplios
max-w-[clamp(80rem, 70rem + 40vw, 96rem)]

// Size 'full' - Sin límite
max-w-none
```

---

### ↔️ Padding Responsivo

```css
/* Padding lateral para contenedores */
padding-inline: clamp(1rem, 0.75rem + 1.25vw, 2rem);

/* Padding vertical para secciones */
padding-block: clamp(1.5rem, 1.25rem + 1.25vw, 3rem);

/* Padding interno de componentes */
padding: clamp(0.5rem, 0.4375rem + 0.3125vw, 1rem);
```

---

### 📱 Gap para Layouts

```css
/* Gap pequeño (móvil primero) */
gap: clamp(0.5rem, 0.4375rem + 0.3125vw, 1rem);

/* Gap mediano (espaciado estándar) */
gap: clamp(1rem, 0.875rem + 0.625vw, 1.5rem);

/* Gap grande (layouts amplios) */
gap: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
```

---

## 🎯 Casos de Uso Comunes

### 1. Página Principal (Container LG)

```tsx
<Container size="lg">
  <div className="space-y-[clamp(1rem,0.875rem+0.625vw,1.5rem)] py-[clamp(1.5rem,1.25rem+1.25vw,3rem)]">
    {/* Contenido */}
  </div>
</Container>
```

### 2. Títulos de Sección

```tsx
<h2 className="text-2xl font-bold tracking-tight">
  Título de la sección
</h2>
<p className="text-muted-foreground">
  Descripción o subtítulo
</p>
```

*Nota: Los tamaños text-2xl ya usan clamp() en styles/index.css*

### 3. Login Page

```tsx
<div className="w-full max-w-[clamp(26rem,24rem+10vw,30rem)] space-y-[clamp(1.5rem,1.25rem+1.25vw,3rem)]">
  {/* Formulario */}
</div>
```

### 4. Grid Adaptativo

```css
.adaptive-grid {
  grid-template-columns: repeat(
    auto-fit,
    minmax(clamp(280px, 250px + 15vw, 400px), 1fr)
  );
}
```

---

## 🧮 Calculadora de Clamp()

### Fórmula Base

```
clamp(mínimo, ideal, máximo)

Donde:
- mínimo = valor para mobile (320px viewport)
- ideal = valor_base + (pendiente × vw)
- máximo = valor para desktop (1920px viewport)
```

### Calcular Pendiente

```
pendiente = (máximo - mínimo) / (1920 - 320)
          = (máximo - mínimo) / 1600

Ejemplo:
Queremos que crezca de 16px a 20px
pendiente = (20 - 16) / 1600 = 0.0025

Expresión final: 1rem + 0.25vw
```

### Ejemplos Prácticos

**Ejemplo 1: Font-size 16px → 18px**
```
mínimo = 16px = 1rem
máximo = 18px = 1.125rem
pendiente = (18-16)/1600 = 0.00125
expresión = 1rem + 0.125vw

Resultado: clamp(1rem, 1rem + 0.125vw, 1.125rem)
```

**Ejemplo 2: Padding 20px → 40px**
```
mínimo = 20px = 1.25rem
máximo = 40px = 2.5rem
pendiente = (40-20)/1600 = 0.0125
expresión = 1.25rem + 1.25vw

Resultado: clamp(1.25rem, 1.25rem + 1.25vw, 2.5rem)
```

---

## ✅ Checklist para Nueva Página

Al crear una nueva página, aplicar:

- [ ] Envolver en `<Container size="lg">`
- [ ] Agregar `py-[clamp(1.5rem,1.25rem+1.25vw,3rem)]`
- [ ] Usar `space-y-[clamp(1rem,0.875rem+0.625vw,1.5rem)]` entre elementos
- [ ] Títulos usan clases semánticas (h1, h2, etc.)
- [ ] Párrafos heredan estilos globales
- [ ] Botones mantienen sizing estándar

---

## 🚫 Cuándo NO usar Clamp()

### ❌ No usar en:

1. **Componentes atómicos UI**
   - Buttons: `h-9 px-4 py-2` (mantener fijo)
   - Inputs: `h-9` (mantener fijo)
   - Badges: `h-5` (mantener fijo)

2. **Tablas de datos internas**
   - Cell padding: `px-4 py-2` (consistencia)
   - Row height: mantener fijo

3. **Iconos**
   - `size-4`, `size-5`, `size-6` (proporciones fijas)

### ✅ Sí usar en:

1. **Layout containers**
   - Padding de páginas
   - Max-width de contenedores
   - Gap entre secciones

2. **Tipografía**
   - Títulos y subtítulos
   - Texto de párrafos
   - Headings

3. **Spacing estructural**
   - Margen entre secciones
   - Padding de cards
   - Gap de grids

---

## 📊 Valores de Referencia Rápidos

### Viewports de Referencia

```
Mobile:   320px  (100% = 320px)
Tablet:   768px  (100% = 768px)
Desktop:  1920px (100% = 1920px)
```

### Conversiones Útiles

```
1vw @ 320px  = 3.2px
1vw @ 768px  = 7.68px
1vw @ 1920px = 19.2px
```

### Atajos Mentales

```
0.3125vw ≈ 0.5px en mobile, 6px en desktop
0.625vw  ≈ 1px en mobile, 12px en desktop
1.25vw   ≈ 2px en mobile, 24px en desktop
```

---

## 🔍 Debugging

### Si el texto se ve muy pequeño:

```css
/* Aumentar el valor mínimo */
ANTES: clamp(0.875rem, 0.8125rem + 0.375vw, 1rem)
DESPUÉS: clamp(1rem, 0.875rem + 0.375vw, 1.125rem)
```

### Si el texto crece demasiado:

```css
/* Reducir la pendiente vw */
ANTES: clamp(1rem, 0.9375rem + 0.5vw, 1.5rem)
DESPUÉS: clamp(1rem, 0.9375rem + 0.375vw, 1.25rem)
```

### Si el spacing es inconsistente:

```css
/* Usar la misma fórmula en todos lados */
padding: clamp(1rem, 0.875rem + 0.625vw, 1.5rem);
gap: clamp(1rem, 0.875rem + 0.625vw, 1.5rem);
```

---

## 📚 Recursos Adicionales

- **Calculadora online:** https://clamp-generate.netlify.app/
- **Documentación MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()
- **Tailwind CSS:** https://tailwindcss.com/docs/responsive-design

---

**Última actualización:** 20 de Marzo, 2026  
**Versión:** 1.0.0  
**Mantenimiento:** Equipo de desarrollo
