import { DEFAULT_FONT_SIZE } from '../models';

export function pxToRem(size: number, currentFontSize = DEFAULT_FONT_SIZE): number {
  return size / currentFontSize;
}
