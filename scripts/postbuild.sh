#!/bin/bash
set -e

OUT="out"

if [ ! -d "$OUT" ]; then
  echo "Build output not found at $OUT"
  exit 1
fi

# GitHub Pages SPA fallback for unknown routes
cp "$OUT/index.html" "$OUT/404.html"

# favicon.ico from generated app icon
if [ -f "$OUT/icon.png" ]; then
  cp "$OUT/icon.png" "$OUT/favicon.ico"
elif [ -f "$OUT/icon" ]; then
  cp "$OUT/icon" "$OUT/favicon.ico"
fi

echo "Postbuild complete: 404.html and favicon.ico copied in $OUT"
