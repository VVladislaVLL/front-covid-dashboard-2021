import { Pipe, PipeTransform } from '@angular/core';

import { pxToRem } from 'src/app/utils';

@Pipe({
  name: 'appPxToRem',
})
export class PxToRemPipe implements PipeTransform {
  transform(value: number): number {
    return pxToRem(value);
  }
}
