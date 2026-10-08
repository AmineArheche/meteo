import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  RADAR_COLOR_SCHEMES,
  DBZ_SCALE,
  getRadarTileTemplate,
  getSatelliteTileTemplate,
  getAdjacentFrameIndices,
} from '../src/services/radarService.js';

describe('Radar Service - Palettes & dBZ Scale', () => {
  it('provides official RainViewer color schemes', () => {
    assert.ok(RADAR_COLOR_SCHEMES.length >= 6);
    const universal = RADAR_COLOR_SCHEMES.find((s) => s.id === 2);
    assert.ok(universal, 'Doppler Universel should exist');
    assert.equal(universal.name, 'Doppler Universel');
  });

  it('provides complete dBZ meteorological scale', () => {
    assert.ok(DBZ_SCALE.length >= 7);
    const extreme = DBZ_SCALE.find((s) => s.dbz === 70);
    assert.ok(extreme, '70 dBZ extreme storm should exist');
    assert.equal(extreme.label, 'Supercellule extrême');
  });
});

describe('Radar Service - Tile URL Builder', () => {
  it('constructs correct RainViewer Doppler tile URL with options', () => {
    const host = 'https://tilecache.rainviewer.com';
    const path = '/v2/radar/1728394800';
    const tileUrl = getRadarTileTemplate(host, path, 2, true, true);

    assert.equal(tileUrl, 'https://tilecache.rainviewer.com/v2/radar/1728394800/256/{z}/{x}/{y}/2/1_1.png');
  });

  it('constructs correct satellite infrared tile URL', () => {
    const host = 'https://tilecache.rainviewer.com';
    const path = '/v2/satellite/1728394800';
    const tileUrl = getSatelliteTileTemplate(host, path);

    assert.equal(tileUrl, 'https://tilecache.rainviewer.com/v2/satellite/1728394800/256/{z}/{x}/{y}/0/0_0.png');
  });

  it('returns empty string if host or path is missing', () => {
    assert.equal(getRadarTileTemplate('', '/path'), '');
    assert.equal(getRadarTileTemplate('https://example.com', ''), '');
    assert.equal(getSatelliteTileTemplate(null, null), '');
  });

  it('calculates adjacent frame prefetch indices with wraparound', () => {
    const indices = getAdjacentFrameIndices(5, 10, 2);
    assert.deepEqual(indices, [3, 4, 5, 6, 7]);

    const wrapIndices = getAdjacentFrameIndices(0, 10, 1);
    assert.deepEqual(wrapIndices, [9, 0, 1]);
  });
});
