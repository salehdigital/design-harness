---
title: Sound
slug: sound
status: published
description: Audio feedback system.
chips:
  - Foundation
  - Sound
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Subtle audio feedback for UI interactions. Sounds are brief, soft, and user-controllable.

## Sound Characteristics

- **Volume**: 20–40% of maximum
- **Duration**: 50–200ms
- **Frequency**: 200–800 Hz (warm mid-range tones)
- **Waveform**: Sine or triangle (soft, round)

## Interaction Sounds

**Switch toggle**: 400 Hz, 80ms
**Button click**: 300 Hz, 60ms
**Save success**: 500 Hz → 600 Hz (rising chirp), 120ms
**Error**: 250 Hz, 100ms (lower, duller)

## Implementation

Web Audio API with gain control:
```js
const audioContext = new AudioContext();
function playTone(freq, duration, volume = 0.3) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}
```

## User Control

Sound toggle in settings or nav:
```js
const soundEnabled = localStorage.getItem('sound') !== 'off';
if (soundEnabled) playTone(400, 80);
```

Default: on, but easily disabled.

## Principles

- **Quiet**: Never jarring or loud (see `memories/quiet-sound.md`)
- **Opt-out**: Respect user preference
- **Functional**: Confirm actions, don't decorate

## Related

See `intelligence/skills/generative-sound.md` for implementation procedure.
