import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'fixUrl',
})
export class FixUrlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(url: string): SafeHtml  {
    // console.log('pipe triggered' + url);
    return this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(url));
  }
}
