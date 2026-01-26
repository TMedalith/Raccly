# 🦉 GUÍA DE BÚHOS PARA MEMORALAB

## ✅ BÚHOS YA INTEGRADOS EN LA LANDING PAGE

### 1. **OwlLogo** (Header + Footer)
- **Ubicación:** Logo principal en header fijo y footer
- **Estilo:** Minimalista, frontal, colores verde/emerald
- **Animaciones:** 
  - Rotación sutil de cabeza (-5° a 5°)
  - Parpadeo de ojos cada 4 segundos
  - Movimiento de orejas
- **Tamaño:** 40x40px (header), 32x32px (footer)

---

### 2. **OwlFlying** (Hero Background)
- **Ubicación:** Esquina superior derecha del Hero
- **Estilo:** Silueta volando con alas extendidas
- **Animaciones:**
  - Flotación vertical (-15px a 0)
  - Movimiento horizontal sutil
  - Aleteo de alas (rotación ±8°)
- **Opacidad:** 20% para efecto decorativo sutil
- **Tamaño:** 128x128px

---

### 3. **OwlChat** (Feature Card - AI Chat)
- **Ubicación:** Primera feature card
- **Estilo:** Búho con ojos grandes, pestañas, burbujas de chat
- **Colores:** Gradiente azul (#60a5fa → #3b82f6)
- **Detalles únicos:**
  - Pestañas negras en ambos ojos
  - Burbujas de chat animadas flotando
  - Alas con plumas detalladas
- **Animaciones:**
  - Hover: scale 1.1 + rotación 5°
  - Burbujas: opacidad pulsante
- **Tamaño:** 80x80px

---

### 4. **OwlScientist** (Feature Card - Knowledge Graphs)
- **Ubicación:** Segunda feature card
- **Estilo:** Búho con gafas científicas, nodos de red
- **Colores:** Gradiente verde (#10b981 → #059669)
- **Detalles únicos:**
  - Gafas redondas con montura negra
  - Puente entre lentes
  - Nodos y conexiones de red decorativos (opacidad animada)
  - Plumas detalladas en pecho (líneas horizontales)
- **Animaciones:**
  - Hover: scale 1.1 + rotación -5°
  - Nodos: fade in/out (0.3 - 0.7)
- **Tamaño:** 80x80px

---

### 5. **OwlAstronaut** (Feature Card - Mission Insights)
- **Ubicación:** Tercera feature card
- **Estilo:** Búho con casco espacial, panel de control
- **Colores:** Gradiente púrpura (#a78bfa → #7c3aed)
- **Detalles únicos:**
  - Visor transparente con reflejo animado
  - Panel de control en pecho (3 botones: verde, amarillo, rojo)
  - Estrellas rotando alrededor (360° lento)
  - Líneas del traje espacial
- **Animaciones:**
  - Hover: scale 1.1 + elevación -5px
  - Reflejo del visor: opacidad 0.2-0.6
  - Estrellas: rotación continua 20s
- **Tamaño:** 80x80px

---

### 6. **OwlMini** (Stats Banner - 4 variantes)
- **Ubicación:** Encima de cada estadística
- **Variantes:**
  1. **reading** → 608 NASA Papers (búho con libro)
  2. **sitting** → 99.9% Uptime (búho sentado)
  3. **flying** → 50M+ Data Points (búho volando)
  4. **celebrating** → 4.9★ Rating (búho festejando con líneas)
- **Colores:** Blanco (para contraste con fondo verde oscuro)
- **Tamaño:** 40x40px
- **Estilo:** Iconos minimalistas, simple line art

---

### 7. **Búho Durmiendo** (Footer)
- **Ubicación:** Esquina inferior derecha del footer
- **Estilo:** Búho en rama con ojos cerrados, "ZZZ" animados
- **Detalles únicos:**
  - Rama horizontal debajo
  - Ojos cerrados (líneas curvas)
  - Alas cubriendo el cuerpo
  - 3 letras "Z" con fade in/out
  - Respiración suave (movimiento vertical)
- **Opacidad:** 30% decorativo
- **Tamaño:** 60x60px

---

## 🎨 PROMPTS PARA GENERAR MÁS BÚHOS CON GEMINI

### Estilo Base (copiar en todos los prompts):
```
Style: Cute flat design illustration, professional tech look, 
similar to educational app mascot, smooth gradients, 
simple geometric shapes, friendly expression, 
2D vector style, transparent background PNG
```

---

### 📝 PROMPTS ESPECÍFICOS:

#### 1. Búho Profesor/Tutor (para sección "How It Works")
```
Create a cute owl character wearing round glasses and holding a pointer stick,
professor/teacher style, friendly wise expression, gradient green colors 
(#10b981 to #059669), wearing a small academic cap, standing pose,
background transparent, flat design illustration, professional but approachable,
tech startup mascot style, 2D vector aesthetic, smooth gradients
```

#### 2. Búho Curioso (para Product Demo)
```
Design a curious owl peeking from the side, head tilted 15 degrees,
one eye bigger showing interest, looking at a screen/interface,
gradient emerald green (#059669), cute big eyes with sparkle,
side profile view, wings slightly visible, small size suitable for UI decoration,
flat design, transparent background, playful but professional style
```

#### 3. Búhos Avatar Set (para Testimonials - 3 variantes)
```
Create 3 circular owl avatars for researcher profiles:

Avatar 1: Female owl with lab coat, wearing safety goggles on head,
holding a plant leaf, plant biologist theme, friendly smile,
green gradient background, circular frame

Avatar 2: Male owl with communication headset, mission control theme,
professional serious expression, space mission planner vibe,
blue-gray gradient background, circular frame

Avatar 3: Professor owl with academic graduation cap, wise expression,
holding a book, research director theme, scholarly appearance,
purple gradient background, circular frame

All: Same cute flat design style, consistent proportions, 
professional mascot quality, transparent background PNGs
```

#### 4. Búho Confundido (para página 404/Error)
```
Illustrate a confused cute owl scratching its head with one wing,
tilted head, question marks (?) floating around, 
puzzled expression with big innocent eyes,
gradient green colors, error state illustration,
sympathetic and friendly vibe, "oops" moment,
flat design, transparent background, larger illustration size
```

#### 5. Búho Pensando (para Loading State)
```
Create an owl in thinking pose, one wing touching chin/beak area,
thoughtful expression, small animated dots (...) nearby,
gradient green colors, suitable for loading spinner animation,
simple clean design, works well when rotating,
flat style, transparent background, medium size
```

#### 6. Búho Celebrando (para Success States)
```
Design a cheerful owl with wings spread up in celebration,
big happy smile, confetti or stars around it,
gradient green colors with yellow accents,
success/achievement illustration, energetic pose,
flat design, transparent background, victory/completion theme
```

#### 7. Búhos Navegación (para diferentes secciones)
```
Set of 4 small owl icons for navigation menu:
1. Chat owl - with speech bubble
2. Explore owl - with magnifying glass
3. Analytics owl - with graph/chart
4. Settings owl - with gear

All: Minimal style, consistent size, green monochrome,
suitable for sidebar icons, 24x24px, line art with fills,
transparent background
```

---

## 🎯 CONFIGURACIÓN DE COLORES PARA GEMINI

Especifica siempre estos colores en tus prompts:

```
Primary Green: #10b981 (emerald-500)
Dark Green: #059669 (emerald-600)
Light Green: #d1fae5 (emerald-100)
Accent Yellow (beak): #fbbf24 (amber-400)
Accent Orange (feet): #f59e0b (amber-500)
Eyes: Black pupils with white shine
Background: Always transparent PNG
```

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Tamaños recomendados:
- **Logos:** 128x128px mínimo (exportar SVG)
- **Feature Icons:** 256x256px (PNG transparent)
- **Decorativos:** 512x512px (PNG transparent)
- **Avatares:** 200x200px circular
- **Mini Icons:** 64x64px

### Formato de salida:
- **Preferido:** SVG (editable, escalable)
- **Alternativo:** PNG transparente alta resolución
- **Evitar:** JPG (no permite transparencia)

### Instrucciones adicionales para Gemini:
```
Export settings:
- Format: PNG with transparency OR SVG
- Resolution: 2x minimum (retina ready)
- Color mode: RGB
- No background
- Clean edges (no artifacts)
- Centered composition
```

---

## 🚀 INTEGRACIÓN EN EL CÓDIGO

### Cómo agregar un nuevo búho SVG:

1. Abre `src/shared/components/OwlIcons.tsx`
2. Copia la estructura de cualquier búho existente
3. Ajusta el `viewBox` según tu diseño
4. Modifica paths, circles, ellipses según tu SVG
5. Agrega animaciones con Framer Motion
6. Exporta el componente

### Ejemplo básico:
```typescript
export const OwlNuevo = ({ className = "w-16 h-16" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    whileHover={{ scale: 1.1 }}
  >
    {/* Tu SVG aquí */}
  </motion.svg>
);
```

### Cómo usar en la página:
```typescript
import { OwlNuevo } from '@/shared/components/OwlIcons';

// En tu JSX:
<OwlNuevo className="w-20 h-20" />
```

---

## 💡 TIPS CREATIVOS

### Poses recomendadas por sección:
- **Hero:** Volando, confiado, heroico
- **Features:** Específico a la función (chat, ciencia, espacio)
- **Testimonials:** Profesional, avatar circular
- **Stats:** Mini, celebrando logros
- **Footer:** Relajado, durmiendo, descansando
- **Loading:** Pensando, girando
- **Error:** Confundido, apologético
- **Success:** Feliz, celebrando

### Expresiones faciales:
- **Ojos grandes:** Inocencia, curiosidad
- **Pestañas:** Feminidad, elegancia
- **Gafas:** Inteligencia, profesionalismo
- **Sonrisa:** Amigable, accesible
- **Serio:** Profesional, confiable

---

## 📊 CHECKLIST DE CALIDAD

Antes de usar un búho nuevo, verifica:

- [ ] ¿Los colores coinciden con la paleta de MemoraLab?
- [ ] ¿El estilo es consistente con los búhos existentes?
- [ ] ¿Tiene fondo transparente?
- [ ] ¿La expresión es apropiada para su uso?
- [ ] ¿El tamaño es adecuado para su ubicación?
- [ ] ¿Funciona bien en hover/animaciones?
- [ ] ¿Se ve bien en modo claro Y oscuro?
- [ ] ¿Es accesible (contraste suficiente)?

---

¡Ahora tienes todo lo que necesitas para crear una familia completa de búhos para MemoraLab! 🦉✨
