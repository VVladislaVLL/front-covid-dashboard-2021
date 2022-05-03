import { BLUE_COLORS, GREEN_COLORS, RED_COLORS } from './map.constants';
import { InfoField } from 'src/app/models';

export function getColorPalette(field: InfoField): string[] {
  switch (field) {
    case InfoField.Vaccinated:
      return  BLUE_COLORS;
    case InfoField.Recovered:
      return  GREEN_COLORS;
    case InfoField.Infected:
    case InfoField.Dead:
    case InfoField.Sick:
    default:
      return  RED_COLORS;
  }
}

export function getColor(coefficient: number, field: InfoField): string {
  const colorPalette = getColorPalette(field);
  if (coefficient === 0 || isNaN(coefficient)) {
    return colorPalette[0];
  }

  if (coefficient > 0 && coefficient <= 0.01) {
    return colorPalette[1];
  }

  if (coefficient > 0.01 && coefficient <= 0.05) {
    return colorPalette[2];

  }

  if (coefficient > 0.05 && coefficient <= 0.1) {
    return colorPalette[3];

  }
  if (coefficient > 0.1 && coefficient <= 0.15) {
    return colorPalette[4];

  }
  if (coefficient > 0.15 && coefficient <= 0.2) {
    return colorPalette[5];

  }

  if (coefficient > 0.2 && coefficient <= 0.25) {
    return colorPalette[6];

  }

  if (coefficient > 0.25 && coefficient <= 0.3) {
    return colorPalette[7];

  }

  if (coefficient > 0.3 && coefficient <= 0.35) {
    return colorPalette[8];

  }

  if (coefficient > 0.35 && coefficient <= 0.4) {
    return colorPalette[9];

  }

  if (coefficient > 0.4 && coefficient <= 0.45) {
    return colorPalette[10];
  }

  if (coefficient > 0.4 && coefficient <= 0.45) {
    return colorPalette[11];
  }

  if (coefficient > 0.45 && coefficient <= 0.5) {
    return colorPalette[12];
  }

  if (coefficient > 0.5 && coefficient <= 0.55) {
    return colorPalette[13];
  }

  if (coefficient > 0.55 && coefficient <= 0.6) {
    return colorPalette[14];
  }

  if (coefficient > 0.6 && coefficient <= 0.65) {
    return colorPalette[15];
  }

  if (coefficient > 0.65 && coefficient <= 0.7) {
    return colorPalette[16];
  }

  if (coefficient > 0.7 && coefficient <= 0.75) {
    return colorPalette[17];
  }

  if (coefficient > 0.75 && coefficient <= 0.8) {
    return colorPalette[18];
  }

  if (coefficient > 0.8 && coefficient <= 0.85) {
    return colorPalette[19];
  }

  if (coefficient > 0.85 && coefficient <= 0.9) {
    return colorPalette[20];
  }
  return colorPalette[21];
}

