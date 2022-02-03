import { scaleOrdinal } from 'd3';

import { COLORS_PALETTE } from './map.constants';
import { ColorsScaler } from './map.models';

// TODO: add types
export function initColorScale(data: any): ColorsScaler {
  return scaleOrdinal().range(COLORS_PALETTE).domain(data) as ColorsScaler;
}

// export function initColorScale(data: number[]) {
//   // return scaleOrdinal().range(COLORS_PALETTE).domain(data) as ColorsScaler;
//   const minNumber = data[0];
//   const maxNumber = data[data.length - 1];
//
// }

