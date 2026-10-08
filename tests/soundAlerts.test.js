import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { soundAlerts } from '../src/services/soundAlerts.js';

describe('Sound Alerts Service', () => {
  it('manages mute toggle correctly', () => {
    assert.equal(soundAlerts.isMuted(), false);
    const muted = soundAlerts.toggleMute();
    assert.equal(muted, true);
    assert.equal(soundAlerts.isMuted(), true);
    soundAlerts.toggleMute();
    assert.equal(soundAlerts.isMuted(), false);
  });

  it('safely handles playback without AudioContext in Node environment', () => {
    assert.doesNotThrow(() => {
      soundAlerts.playRadarPulse();
      soundAlerts.playSevereWarningBeep();
    });
  });
});
