# CV / Portafolio web — Miguel Ángel Mendoza Enríquez

Sitio de CV y portafolio profesional de **Miguel Ángel Mendoza Enríquez**, Desarrollador Full
Stack / Web Developer. Construido con **HTML, CSS y JavaScript nativos** (sin frameworks, sin
build, sin dependencias) y publicado en **GitHub Pages**.

> **Ver en vivo:** https://kvosarkoceles.github.io/
> **CV en PDF:** https://kvosarkoceles.github.io/cv/Miguel-Mendoza-CV.pdf

---

## Índice

1. [Análisis de las plantillas de referencia](#1-análisis-de-las-plantillas-de-referencia)
2. [Propuesta de diseño](#2-propuesta-de-diseño)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Tecnologías](#4-tecnologías)
5. [Instalación y ejecución local](#5-instalación-y-ejecución-local)
6. [Generar el PDF y las imágenes](#6-generar-el-pdf-y-las-imágenes)
7. [Deployment en GitHub Pages](#7-deployment-en-github-pages)
8. [SEO](#8-seo)
9. [Accesibilidad y rendimiento](#9-accesibilidad-y-rendimiento)
10. [Datos de contacto y personalización](#10-datos-de-contacto-y-personalización)
11. [Nota sobre las plantillas](#11-nota-sobre-las-plantillas)

---

## 1. Análisis de las plantillas de referencia

Se descargaron y revisaron **468 plantillas** del repositorio
[`durgeshsamariya/awesome-github-profile-readme-templates`](https://github.com/durgeshsamariya/awesome-github-profile-readme-templates)
(carpeta `templates/`, conservada en el repositorio de perfil). El análisis combinó una medición de
patrones sobre el conjunto completo con una lectura cualitativa de ejemplos representativos.

### 1.1 Medición sobre las 468 plantillas

| Patrón detectado | Plantillas | % | Lectura |
| :--- | ---: | ---: | :--- |
| Usan `<img>` (HTML embebido) | 421 | 90 % | El HTML crudo es la norma, no la excepción |
| `github-readme-stats` (widgets de estadísticas) | 350 | 75 % | Muy popular, pero depende de un servicio externo |
| Cabecera centrada (`align="center"`) | 341 | 73 % | Convención clara para el encabezado |
| `shields.io` (badges) | 299 | 64 % | El recurso estándar para tecnología y contacto |
| Encabezados `##` | 315 | 67 % | La jerarquía por secciones es universal |
| `<h1>` en HTML | 157 | 34 % | Se usa para centrar y animar el nombre |
| GIFs (Giphy) | 136 | 29 % | Ruido visual y peso |
| `readme-typing-svg` (texto animado) | 85 | 18 % | Efecto llamativo, poca señal profesional |
| `devicons` / rejillas `<kbd>` | 77 | 16 % | Buenas para mostrar logos, malas para leer |
| Tablas Markdown | 43 | 9 % | La minoría; infrautilizadas para datos |

### 1.2 Qué aporta cada referencia y qué se descartó

| Plantilla de referencia | Elemento aprovechado | Qué se descartó y por qué |
| :--- | :--- | :--- |
| **7oSkaaa** | Jerarquía por secciones con encabezados cortos (`About me`, `My Skills`, `Connect with me`) y agrupación de habilidades por categoría. Es la estructura más fácil de escanear del conjunto. | GIFs decorativos, contadores de visitas y rejillas de iconos sin texto. |
| **STI / grupo de plantillas con badges** (Abdallah Elsawy, 7oSkaaa) | Fila de badges de contacto con `shields.io` bajo el nombre: resuelve “cómo me contactan” en un segundo. | Badges masivos sin agrupación lógica y widgets de estadísticas como centro visual. |
| **JayantGoel001** | Tarjetas de información y divisores que separan bloques temáticos. | Fondos animados, ASCII art, adornos laterales y GIFs grandes: encarecen la carga y distraen del contenido. |
| **trinib** | Idea de cabecera con identidad propia. | Terminal animada, Spotify, banners y emojis repetidos: es una demo de widgets, no un CV. |
| **israelias / rednafi / monkindey** (“README como código”) | Concepto de personalidad técnica y uso de tipografía monoespaciada como acento de identidad. | El contenido en bloques de código es ilegible para reclutadores no técnicos y opaco para un ATS. |
| **Plantillas con tablas** | Uso de tablas para datos comparables (stack, proyectos). | Tablas usadas como decoración en lugar de como estructura de datos. |

### 1.3 Conclusión del análisis

Lo que **funciona** en la mayoría de plantillas es coincidente: **cabecera clara, contacto
inmediato, stack agrupado por categorías, experiencia con fechas visibles y jerarquía por
secciones**. Lo que **no funciona** para un perfil profesional es el exceso de imágenes animadas y
widgets: compiten con la información, dependen de servicios de terceros y aportan poco a quien
tiene 30 segundos para evaluar un perfil.

---

## 2. Propuesta de diseño

Combinación elegida: **estructura informativa de `7oSkaaa` + badges de contacto agrupados + tablas
de datos para el stack y los proyectos**, con una capa visual propia inspirada en el dominio real
del perfil: **GPS, telemetría y monitoreo en tiempo real**.

### 2.1 Decisiones y su justificación

| Decisión | Por qué |
| :--- | :--- |
| **Estética “panel de monitoreo”**: fondo oscuro azul-noche, un solo acento turquesa-cian, retícula técnica sutil. | Es coherente con la experiencia real (telemetría, rastreo, alertas), en lugar de un degradado genérico. Da identidad sin ruido. |
| **Paleta restringida**: un acento y una escala de neutros. | Jerarquía visual por color, no por cantidad de colores. Facilita el contraste y el modo claro. |
| **Tipografía mixta**: sans del sistema para el contenido, monoespaciada solo para metadatos (categorías, fechas, stack). | La mono aporta el tono técnico; el texto largo se mantiene cómodo de leer. Además, cero fuentes externas = cero latencia. |
| **Sin GIFs ni SVG animados.** | Rendimiento, accesibilidad y foco: las animaciones se limitan a entradas sutiles activadas por scroll, desactivables por `prefers-reduced-motion`. |
| **Iconografía propia en un sprite SVG local** (24 iconos geométricos). | Consistencia estética, un solo archivo, sin peticiones externas ni logos de terceros. Los chips siempre llevan **texto**, así que el stack es greppable y accesible. |
| **Jerarquía de contenido en el orden pedido**: nombre → rol → stack → experiencia → proyectos → GitHub → contacto. | Es el recorrido real de un reclutador y se respeta tanto en el HTML del sitio como en el `README.md` de perfil. |
| **Modo oscuro por defecto + modo claro**, persistido en `localStorage` y con detección del sistema. | Preferencia del usuario, sin parpadeo (script de tema en línea antes del primer pintado). |
| **Un solo archivo CSS y uno de JS**, sin frameworks. | Rendimiento, mantenibilidad y cero dependencias que actualizar. |
| **PDF generado desde HTML propio** (`cv/print.html`). | Texto seleccionable y compatible con ATS, y el PDF se regenera con un comando cuando cambie el contenido. |
| **Estructura semántica y contenido en texto plano**, no en imágenes. | Los ATS y los lectores de pantalla leen el contenido completo. |

### 2.2 Estructura final del documento

```
Cabecera fija        marca · navegación por secciones · botón de tema · botón "CV PDF"
Hero                 nombre → rol → resumen → ubicación → CTA (PDF) → enlaces → stack principal
01 Perfil            relato profesional + tarjeta de datos rápidos
02 Experiencia       timeline: Sitrack México, Freelance (T7Group / CÍMAC), STI Solutions,
                     Grupo Digital Systems, CIMAC, experiencia previa
03 Proyectos         tarjetas: Farmacia Dulce Esperanza, Sistema de monitoreo GPS, RoadSentinel
04 Habilidades       seis categorías: backend, frontend, bases de datos, cloud, integraciones, datos
05 Educación         UNAM + nota de experiencia previa
06 Contacto          correo, GitHub, LinkedIn, ubicación + CTA de descarga
Pie                  autoría y enlaces
```

---

## 3. Estructura del proyecto

```
kvosarkoceles.github.io/
├── index.html                       # Documento único, semántico
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .nojekyll                        # Evita que GitHub Pages procese el sitio con Jekyll
├── assets/
│   ├── css/styles.css               # Tokens, componentes, responsive, impresión
│   ├── js/main.js                   # Tema, navegación, scroll, animaciones
│   ├── icons/sprite.svg             # 24 iconos SVG propios
│   └── img/
│       ├── favicon.svg
│       ├── apple-touch-icon.png
│       └── og-image.png             # 1200x630 Open Graph
├── cv/
│   ├── Miguel-Mendoza-CV.pdf        # Generado (no editar a mano)
│   └── print.html                   # Fuente del PDF, optimizada para impresión
├── scripts/
│   ├── generate-assets.sh           # Regenera PDF, OG image y apple-touch-icon
│   └── og-source.html               # Plantilla de la imagen Open Graph
└── README.md                        # Este documento
```

**Decisiones de estructura y por qué:**

1. **El sitio vive en la raíz del repositorio.** Al llamarse `<usuario>.github.io`, GitHub Pages
   publica este repositorio en el dominio `https://kvosarkoceles.github.io/` (sin subcarpeta), así
   que `index.html` tiene que estar en la raíz.
2. **No hay workflow de despliegue.** En un repositorio de sitio de usuario, GitHub Pages publica
   automáticamente la rama por defecto: no hace falta GitHub Actions ni elegir carpeta de
   publicación.
3. **`.nojekyll`**: evita el procesado con Jekyll, que es innecesario aquí y puede alterar archivos.
4. **`cv/print.html` acompaña al PDF**: es la **fuente real** del documento. Editar el PDF a mano lo
   volvería inconsistente con el sitio.

El **CV de perfil de GitHub** (el `README.md` con los gráficos y las tarjetas de estadísticas) vive
en el repositorio `Kvosarkoceles/Kvosarkoceles`, con sus propios `assets/` (banner, divisor y pie).

---

## 4. Tecnologías

- **HTML5 semántico** (`header`, `nav`, `main`, `section`, `article`, `ol`, `dl`, `footer`).
- **CSS3**: custom properties, Grid, Flexbox, `clamp()`, `color-mix()` con *fallback*,
  `mask-image`, `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`,
  `@media print`. Un único archivo, sin preprocesador.
- **JavaScript nativo**: `IntersectionObserver`, `localStorage`, `matchMedia`,
  `requestAnimationFrame`. Sin dependencias ni *build step*.
- **SVG** para iconografía (sprite local) y elementos de marca.
- **GitHub Pages** (repositorio de sitio de usuario) para la publicación, sin GitHub Actions.
- **ImageMagick** y **Google Chrome headless** solo para generar recursos (`scripts/`).

---

## 5. Instalación y ejecución local

No hay dependencias ni compilación. Basta servir la raíz del repositorio con cualquier servidor
estático (abrir `index.html` con `file://` también funciona, pero algunos navegadores bloquean
`<use>` con sprite externo y `site.webmanifest`).

```bash
# Opción 1: Python (viene preinstalado en Linux y macOS)
python3 -m http.server 8080

# Opción 2: Node.js
npx --yes serve . -l 8080

# Opción 3: PHP
php -S localhost:8080
```

Abrir `http://localhost:8080`.

---

## 6. Generar el PDF y las imágenes

```bash
bash scripts/generate-assets.sh
```

El script produce:

| Archivo | Origen | Herramienta |
| :--- | :--- | :--- |
| `cv/Miguel-Mendoza-CV.pdf` | `cv/print.html` | Chrome / Chromium headless |
| `assets/img/og-image.png` | `scripts/og-source.html` | Chrome / Chromium headless |
| `assets/img/apple-touch-icon.png` | `scripts/generate-assets.sh` | ImageMagick 7 (`magick`) |
Requisitos: `google-chrome` (o `chromium`) para el PDF y la imagen Open Graph, e ImageMagick 7
(`magick`) para el icono. Si Chrome no está disponible, el PDF puede generarse desde el navegador
imprimiendo `cv/print.html` como PDF.

**Flujo de actualización del CV:** editar el contenido en `index.html` (sitio) y en
`cv/print.html` (PDF), luego ejecutar el script. El README de perfil es otro repositorio
(`Kvosarkoceles/Kvosarkoceles`) y se edita aparte.

---

## 7. Deployment en GitHub Pages

Este repositorio es un **sitio de usuario**: se llama `<usuario>.github.io`, así que GitHub Pages
lo publica en la raíz del dominio `https://kvosarkoceles.github.io/` y **no necesita workflow ni
configuración de carpeta**.

### Pasos (una sola vez)

1. Subir los cambios a la rama `main`:

   ```bash
   git add -A
   git commit -m "Sitio de CV y portafolio"
   git push -u origin main
   ```

2. En GitHub: **Settings → Pages**.
3. En **Source**, elegir **Deploy from a branch** → rama `main` → carpeta **`/ (root)`**. Guardar.
4. Esperar el primer despliegue (Actions → `pages build and deployment`) y abrir
   `https://kvosarkoceles.github.io/`.

Cada `push` a `main` republica el sitio automáticamente.

### Comprobar el despliegue

```bash
curl -I https://kvosarkoceles.github.io/
curl -I https://kvosarkoceles.github.io/cv/Miguel-Mendoza-CV.pdf
curl -s https://kvosarkoceles.github.io/robots.txt
```

### Dominio propio (opcional)

Añadir un archivo `CNAME` en la raíz con el dominio (por ejemplo `miguelmendoza.mx`) y configurar
en el DNS un registro `A` hacia las IP de GitHub Pages, o un `CNAME` a `kvosarkoceles.github.io`
si se usa un subdominio.

---

## 8. SEO

- **`<title>`** descriptivo con nombre, rol y tecnologías clave.
- **`meta description`** de ~300 caracteres con el perfil y las tecnologías principales.
- **`meta keywords`** (sin *keyword stuffing*) y `author`.
- **Open Graph** completo (`og:type=profile`, título, descripción, URL, imagen 1200×630, `og:locale`
  `es_MX`) y **Twitter Card** `summary_large_image`.
- **Datos estructurados JSON-LD** (`schema.org/Person`): nombre, puesto, ubicación, educación,
  `sameAs` y `knowsAbout`.
- **HTML semántico** con jerarquía de encabezados correcta (`h1` único).
- **`canonical`**, `lang="es-MX"`, `robots.txt` y `sitemap.xml`.
- **Favicon SVG**, `apple-touch-icon` y `site.webmanifest`.
- **`404.html`** con `noindex` y enlace de regreso.
- **Títulos y textos que incluyen términos de búsqueda reales** de reclutamiento: *Full Stack
  Developer, Web Developer, Software Developer, PHP, Laravel, CodeIgniter, JavaScript, React,
  Angular, Node.js, Python, PostgreSQL, MySQL, MongoDB, AWS, Docker, REST API, GPS, Telemetría,
  Geolocalización, MQTT*.

---

## 9. Accesibilidad y rendimiento

**Accesibilidad**

- Enlace “Saltar al contenido principal” y jerarquía de encabezados correcta.
- Navegación con `aria-current` en la sección activa, menú móvil con `aria-expanded` y cierre con
  `Escape`.
- Botón de tema con `aria-pressed` y `aria-label` dinámicos.
- Iconos decorativos con `aria-hidden`, enlaces con texto siempre visible.
- Foco visible con `:focus-visible`; contraste reforzado con `prefers-contrast: more`.
- Animaciones desactivables con `prefers-reduced-motion: reduce`.
- Contenido y secciones en texto plano (no en imágenes).

**Rendimiento**

- Cero dependencias, cero fuentes externas, cero peticiones de terceros: solo 1 HTML, 1 CSS, 1 JS,
  1 sprite SVG y 3 imágenes.
- CSS con `will-change` acotado y animaciones sobre `opacity`/`transform`.
- `IntersectionObserver` para revelar contenido y para marcar la sección activa, sin escuchar
  *scroll* de forma costosa (el progreso usa `requestAnimationFrame`).
- `scroll-behavior: smooth` desactivado automáticamente si el usuario prefiere menos movimiento.

---

## 10. Datos de contacto y personalización

El correo y el LinkedIn reales **ya están configurados** en el sitio y el CV. Los marcadores que
quedan por resolver son los de la tabla, todos ellos de contenido de proyectos.

| Marcador | Dónde | Acción |
| :--- | :--- | :--- |
| LinkedIn | `index.html`, `cv/print.html` y el `README.md` del repo de perfil | Ya configurado: `linkedin.com/in/miguel-angel-mendoza-enríquez-604574238` |
| Correo | `index.html`, `cv/print.html` y el `README.md` del repo de perfil | Ya configurado: `sarkoceles@ciencias.unam.mx` |
| Enlaces `Repositorio` de cada proyecto | `index.html`, sección Proyectos, y la tabla del `README.md` de perfil | URL de cada repositorio |
| `Demo` de cada proyecto | `index.html`: `<span class="project-link is-disabled">` | Convertir en `<a href="…">` cuando exista demo. Farmacia Dulce Esperanza ya apunta a `https://farma-web-rho.vercel.app/` |
| `Estado` de cada proyecto | `index.html`: bloque comentado `<span class="status">` | Descomentar y fijar el valor real |
| `apple-touch-icon.png` | `assets/img/` | Se regenera con `scripts/generate-assets.sh` |
| URLs `raw.githubusercontent.com/Kvosarkoceles/Kvosarkoceles/main/assets/…` | `README.md` del repo de perfil (banner, divisor y pie) | Se usan URLs absolutas porque GitHub no siempre resuelve rutas relativas al mostrar el README en el perfil. Si cambias de rama o de usuario, actualiza esas referencias |

El estado de los proyectos se dejó **preparado pero desactivado** de forma deliberada: no se
inventa el estado de avance de un proyecto.

### Recursos gráficos del README de perfil

El README de perfil usa tres SVG propios (`assets/`) más servicios externos:

| Recurso | Servicio | Nota |
| :--- | :--- | :--- |
| Banner, divisor y pie | **propios** (`assets/*.svg`) | Sin dependencias; editables a mano |
| Texto animado | `readme-typing-svg.demolab.com` | Dominio vigente (el de `herokuapp` quedó obsoleto) |
| Iconos de tecnologías | `skillicons.dev` | Dos filas: backend/frontend y datos/cloud |
| Badges | `shields.io` | Solo para stack y contacto |
| Estadísticas y lenguajes | `github-profile-summary-cards.vercel.app` | Datos reales de la API de GitHub |
| Racha de contribuciones | `github-readme-streak-stats.herokuapp.com` | Datos reales de la API de GitHub |
| Visitas al perfil | `komarev.com` | Contador opcional; se puede borrar sin afectar nada |

**Servicios descartados por no estar disponibles:** `github-readme-stats.vercel.app` (devuelve
503 de forma intermitente), `github-readme-activity-graph.vercel.app` y `github-profile-trophy.vercel.app`
(402, requieren plan de pago). Si prefieres esas tarjetas, requieren desplegar una instancia propia.

---

## 11. Nota sobre las plantillas

Las 468 plantillas de `awesome-github-profile-readme-templates` se usaron **únicamente como
referencia de diseño y estructura**. No se copió contenido ni código de ninguna de ellas: los
textos, el marcado, el CSS, el JavaScript y la iconografía de este portafolio son originales y
están escritos para el perfil de Miguel Ángel Mendoza Enríquez.

Todo el contenido profesional proviene de la información aportada por el autor del perfil. No se
añadieron empresas, puestos, fechas, certificaciones, métricas, clientes, tecnologías ni
estadísticas que no estuvieran confirmadas.

---

<div align="center">
<sub>© Miguel Ángel Mendoza Enríquez · Desarrollador Full Stack · Ciudad de México</sub>
</div>
