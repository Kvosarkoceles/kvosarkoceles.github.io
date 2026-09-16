#!/usr/bin/env bash
# =============================================================================
# Genera los recursos binarios del portafolio:
#   - assets/img/og-image.png        (1200x630, Open Graph / Twitter Card)
#   - assets/img/apple-touch-icon.png (180x180)
#   - cv/Miguel-Mendoza-CV.pdf        (A4, texto seleccionable, compatible con ATS)
#
# Requisitos: ImageMagick 7 (`magick`) y Google Chrome / Chromium.
# Uso:  bash scripts/generate-assets.sh
# =============================================================================
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG="$RAIZ/assets/img"
CV="$RAIZ/cv"

FONT_MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf

ACENTO="#2dd4bf"
ACENTO_2="#38bdf8"
FONDO="#0a0f1a"

mkdir -p "$IMG" "$CV" "$RAIZ/scripts"

# ------------------------------------------------------------------- Chrome

CHROME=""
for c in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
done

if [ -z "$CHROME" ]; then
  echo "ERROR: se requiere Google Chrome o Chromium." >&2
  echo "       Chrome se usa para la imagen Open Graph y para el PDF del CV." >&2
  exit 1
fi

PERFIL_TMP="$(mktemp -d)"
trap 'rm -rf "$PERFIL_TMP"' EXIT

# Ejecuta Chrome headless con el Perfil temporal aislado.
chrome() {
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$PERFIL_TMP" --virtual-time-budget=3000 "$@" >/dev/null 2>&1 \
    || "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
        --user-data-dir="$PERFIL_TMP" --virtual-time-budget=3000 "$@" >/dev/null 2>&1
}

# ------------------------------------------------------------ Imagen Open Graph

echo "→ Generando og-image.png (1200x630)"
chrome --window-size=1200,630 --force-device-scale-factor=1 \
  --default-background-color=ff0a0f1a \
  --screenshot="$IMG/og-image.png" \
  "file://$RAIZ/scripts/og-source.html"

# ------------------------------------------------------------ Icono iOS

if command -v magick >/dev/null 2>&1; then
  echo "→ Generando apple-touch-icon.png (180x180)"
  magick -size 180x180 xc:"$FONDO" \
    -font "$FONT_MONO" -pointsize 34 -fill "$ACENTO" -gravity center \
    -annotate +0+0 "MM" \
    -fill none -stroke "$ACENTO_2" -strokewidth 2 \
    -draw "roundrectangle 3,3 176,176 32,32" \
    "$IMG/apple-touch-icon.png"
else
  echo "AVISO: ImageMagick no está instalado; se omite apple-touch-icon.png." >&2
fi

echo "→ Generando cv/Miguel-Mendoza-CV.pdf"
chrome --no-pdf-header-footer --print-to-pdf="$CV/Miguel-Mendoza-CV.pdf" \
  "file://$CV/print.html"

if [ -f "$CV/Miguel-Mendoza-CV.pdf" ]; then
  echo "   ✓ $(du -h "$CV/Miguel-Mendoza-CV.pdf" | cut -f1) — $CV/Miguel-Mendoza-CV.pdf"
else
  echo "AVISO: Chrome no pudo generar el PDF automáticamente." >&2
  echo "       Genera el PDF desde el navegador imprimiendo cv/print.html." >&2
fi

echo "Listo."
