import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
})
export class ExcerptPipe implements PipeTransform {

  transform(content: string): unknown {
    const postSummary = content.replace(/(<([^>]+)>)/gi, '');
    if (postSummary.length > 300) {
      return postSummary.substr(0, 300) + ' [...]';
    } else {
      return postSummary;
    }
  }

}
