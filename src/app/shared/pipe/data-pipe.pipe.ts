import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPipe'
})
export class DataPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }
}
