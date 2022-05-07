import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTimes',
})
export class TimesPipe implements PipeTransform {
  transform(value: number): Iterable<any> {
    const iterable: Iterable<any> = {} as Iterable<any>;
    iterable[Symbol.iterator] = function* () {
      let n = 0;
      while (n < value) {
        yield ++n;
      }
    };
    return iterable;
  }
}
