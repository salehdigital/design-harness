#!/usr/bin/env bash
# WebGL self-test: serve this folder, start headless Chrome with SwiftShader, read back the #gl canvas.
# usage: tools/gl-selftest.sh [outdir]   (CHROME=... to pick a binary; NOGL=1 to check the no-WebGL fallback)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:-screenshots}; mkdir -p "$OUT"
CHROME=${CHROME:-$(command -v google-chrome || command -v chromium || echo /opt/google/chrome/chrome)}
python3 -m http.server 8765 >/dev/null 2>&1 & SRV=$!
PROF=$(mktemp -d)
if [ "${NOGL:-}" = 1 ]; then GLF="--disable-webgl --disable-3d-apis"; SUF=-nogl; else GLF="--enable-unsafe-swiftshader --use-angle=swiftshader"; SUF=; fi
"$CHROME" --headless=new --no-sandbox --disable-dev-shm-usage --no-first-run --user-data-dir="$PROF" \
  --remote-debugging-port=9333 $GLF about:blank >/dev/null 2>&1 & CHR=$!
trap 'kill $CHR $SRV 2>/dev/null; wait $CHR 2>/dev/null; rm -rf "$PROF" 2>/dev/null || true' EXIT
for i in $(seq 1 30); do curl -sf localhost:9333/json/version >/dev/null && break; sleep 0.5; done
for p in index inner settings; do
  node tools/gl-selftest.mjs "http://localhost:8765/$p.html?selftest=gl" 60000 2>/dev/null | head -1 > "$OUT/selftest-gl-$p$SUF.json"
  echo "$p: $(cat "$OUT/selftest-gl-$p$SUF.json")"
done
