import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFirstLetterUpper',
  standalone: true,
})
export class FirstLetterUpperPipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
