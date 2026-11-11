#!/usr/bin/env bash
# Screenshot the rebuild and the live site at the same sizes.
# Usage: ./shoot.sh [outdir]   (needs google-chrome and python3; put licensed fonts in ./fonts first)
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-screenshots}; mkdir -p "$OUT"
python3 -m http.server 8765 >/dev/null 2>&1 & SRV=$!; trap 'kill $SRV' EXIT; sleep 1
# LIVE_IP pins saleh.digital to one origin (useful while DNS still points some resolvers at an old host)
RULES=(); [ -n "${LIVE_IP:-}" ] && RULES=(--host-resolver-rules="MAP saleh.digital $LIVE_IP")
shot() { timeout 60 google-chrome --headless=new --no-sandbox --hide-scrollbars "${RULES[@]}" --window-size="$1" --virtual-time-budget="${BUDGET:-10000}" --screenshot="$2" "$3" 2>/dev/null; }
for s in 1440,900 390,844; do w=${s%,*}
  shot $s "$OUT/rebuild-$w.png"         "http://localhost:8765/index.html"
  shot $s "$OUT/rebuild-record-$w.png"  "http://localhost:8765/inner.html"
  shot $s "$OUT/live-$w.png"            "https://saleh.digital/"
  shot $s "$OUT/live-record-$w.png"     "https://saleh.digital/#/lectures/lead-ux-and-product-design-instructor"
done
