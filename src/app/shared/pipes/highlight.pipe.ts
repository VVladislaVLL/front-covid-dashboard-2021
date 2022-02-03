import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'appHighlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, query: string | string[]): SafeHtml {
    const html = this.getHighlightedHtml(value.toString(), query);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private getHighlightedHtml(
    value: string,
    query: string | string[],
  ): string {
    if (!query || !value || query.length === 0) {
      return value;
    }
    const queries = Array.isArray(query) ? query : [query];
    const regexpArr = queries.map((q) => new RegExp(`(${q})`, 'ig'));
    const areAllQueriesMatch = regexpArr.every(regexp => regexp.test(value));

    if (areAllQueriesMatch) {
      return regexpArr.reduce((resultHtml, regexp) => {
        resultHtml = resultHtml.replace(regexp, '<span class="highlight-text">$1</span>');

        return resultHtml;
      }, value);
    }
    return value;
  }
}
