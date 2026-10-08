import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTemperature,
  convertTemp,
  formatWindSpeed,
  getWindDirection,
  getWeatherDetailsByCode,
} from '../src/services/weatherUtils.js';

describe('Weather Utils - Temperature Conversion', () => {
  it('formats Celsius correctly', () => {
    assert.equal(formatTemperature(20, 'C'), '20°C');
    assert.equal(formatTemperature(0, 'C'), '0°C');
    assert.equal(formatTemperature(-5, 'C'), '-5°C');
  });

  it('converts and formats Fahrenheit correctly', () => {
    assert.equal(formatTemperature(0, 'F'), '32°F');
    assert.equal(formatTemperature(25, 'F'), '77°F');
    assert.equal(formatTemperature(100, 'F'), '212°F');
  });

  it('handles invalid or missing values gracefully', () => {
    assert.equal(formatTemperature(null), '--');
    assert.equal(formatTemperature(undefined), '--');
    assert.equal(formatTemperature(NaN), '--');
  });

  it('calculates numerical converted temperature', () => {
    assert.equal(convertTemp(20, 'C'), 20);
    assert.equal(convertTemp(20, 'F'), 68);
  });
});

describe('Weather Utils - Wind Conversion', () => {
  it('formats wind speed in km/h and mph', () => {
    assert.equal(formatWindSpeed(50, 'C'), '50 km/h');
    assert.equal(formatWindSpeed(50, 'F'), '31 mph');
    assert.equal(formatWindSpeed(null), '--');
  });

  it('converts degrees to cardinal directions', () => {
    assert.equal(getWindDirection(0), 'Nord (N)');
    assert.equal(getWindDirection(90), 'Est (E)');
    assert.equal(getWindDirection(180), 'Sud (S)');
    assert.equal(getWindDirection(270), 'Ouest (O)');
    assert.equal(getWindDirection(null), 'N/A');
  });
});

describe('Weather Utils - WMO Weather Codes', () => {
  it('interprets clear sky code (0)', () => {
    const day = getWeatherDetailsByCode(0, true);
    assert.equal(day.label, 'Ciel dégagé');
    assert.equal(day.theme, 'sunny');

    const night = getWeatherDetailsByCode(0, false);
    assert.equal(night.label, 'Nuit claire');
    assert.equal(night.theme, 'night');
  });

  it('interprets thunderstorm codes (95, 96, 99)', () => {
    const storm = getWeatherDetailsByCode(95, true);
    assert.equal(storm.theme, 'storm');
    assert.equal(storm.label, 'Orage modéré');

    const hailStorm = getWeatherDetailsByCode(99, true);
    assert.equal(hailStorm.label, 'Orage avec grêle');
  });
});
