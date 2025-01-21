import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thyI18n',
    standalone: true
})
export class ThyI18nPipe implements PipeTransform {
    templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

    transform(expr: string, params?: Record<string, any>): any {
        if (!params) {
            return expr;
        }
        const result = expr.replace(this.templateMatcher, (substring: string, b: string) => {
            return b && params[b] ? params[b] : substring;
        });
        return result;
    }
}
