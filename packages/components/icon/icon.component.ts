import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { icons } from './icons';

@Component({
    selector: 'thy-pro-icon',
    template: ''
})
export class ThyProIconComponent {
    @HostBinding('class.thy-pro-icon') isIcon = true;

    @Input() set thyIconName(name: string) {
        this.setSvg(name);
    }

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    setSvg(name: string) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        } else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
}
