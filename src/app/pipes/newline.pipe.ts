import { Pipe, PipeTransform } from '@angular/core';

// テキスト中の改行をBRタグに置換するパイプ
@Pipe({
  name: 'newline'
})
export class NewlinePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\r\n|\r|\n/g, '<br>');
  }
}
