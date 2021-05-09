import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'betResultToCssClass',
})
export class BetResultToCssClassPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 0: return 'red';
      case 1: return 'yellow';
      case 2: return 'blue';
      case 3: return 'green';
      default: return 'gray';
    }
  }
}
