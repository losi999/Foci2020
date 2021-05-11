import { Pipe, PipeTransform } from '@angular/core';
import { BetResult } from '@foci2020/shared/types/common';

@Pipe({
  name: 'betResultToCssClass',
})
export class BetResultToCssClassPipe implements PipeTransform {

  transform(value: BetResult): string {
    switch (value) {
      case 'nothing': return 'red';
      case 'outcome': return 'yellow';
      case 'goalDifference': return 'blue';
      case 'exactMatch': return 'green';
      default: return 'gray';
    }
  }
}
