#!/usr/bin/env bash
# Screenshot the rebuild and the live site at the same sizes, in both themes, and run the selftest.
# Usage: ./shoot.sh [outdir]   (needs google-chrome and python3; put licensed fonts in ./fonts first)
# LIVE_IP pins saleh.digital to one origin (useful while DNS still points some resolvers at an old host).
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-screenshots}; mkdir -p "$OUT"
python3 -m http.server 8765 >/dev/null 2>&1 & SRV=$!; trap 'kill $SRV' EXIT; sleep 1
RULES=(); [ -n "${LIVE_IP:-}" ] && RULES=(--host-resolver-rules="MAP saleh.digital $LIVE_IP")
shot() { timeout 90 google-chrome --headless=new --no-sandbox --hide-scrollbars "${RULES[@]}" --window-size="$1" --virtual-time-budget="${3:-${BUDGET:-15000}}" --screenshot="$2" "$4" 2>/dev/null || true; }
L=http://localhost:8765
for s in 1440,900 390,844; do w=${s%,*}
  # round 1: the article and a record page (light, the default)
  shot $s "$OUT/rebuild-$w.png"         "" "$L/index.html"
  shot $s "$OUT/rebuild-record-$w.png"  "" "$L/inner.html"
  shot $s "$OUT/live-$w.png"            "" "https://saleh.digital/"
  shot $s "$OUT/live-record-$w.png"     "" "https://saleh.digital/#/lectures/lead-ux-and-product-design-instructor"
  # round 2: each theme against live (?theme= is the site's own preview switch)
  for t in light dark; do
    shot $s "$OUT/rebuild-$t-$w.png" "" "$L/index.html?theme=$t"
    shot $s "$OUT/live-$t-$w.png"    "" "https://saleh.digital/?theme=$t"
  done
  # Settings › Theme, the switcher, against live
  shot $s "$OUT/rebuild-settings-theme-$w.png" "" "$L/settings.html?page=theme"
  shot $s "$OUT/live-settings-theme-$w.png"    "" "https://saleh.digital/#/settings/theme"
done
# an animation caught mid-flight: the post streaming in (about 450ms of virtual time after load)
shot 1440,900 "$OUT/rebuild-streaming-1440.png" 450 "$L/index.html"
shot 1440,900 "$OUT/live-streaming-1440.png"    "${LIVE_STREAM_MS:-1800}" "https://saleh.digital/"
# sound, haptics and theme switching through the real event paths
timeout 60 google-chrome --headless=new --no-sandbox --autoplay-policy=no-user-gesture-required --window-size=1440,900 \
  --virtual-time-budget=6000 --dump-dom "$L/index.html?selftest" 2>/dev/null \
  | python3 -c "import sys,re; m=re.search(r'<pre id=\"selftest\">(.*?)</pre>', sys.stdin.read(), re.S); print(m.group(1) if m else '{}')" > "$OUT/selftest.json"
cat "$OUT/selftest.json"
