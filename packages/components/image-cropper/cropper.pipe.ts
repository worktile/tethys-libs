import { Pipe, PipeTransform } from '@angular/core';
import { isString } from '@tethys/cdk/is';
import { ThyCropperImageSize } from './cropper.entity';

@Pipe({
    name: 'thyCropperSizeText'
})
export class ThyCropperSizeTextPipe implements PipeTransform {
    transform(size: ThyCropperImageSize, previewSizes?: ThyCropperImageSize[]): string {
        if (size || previewSizes) {
            const currentSize = previewSizes ? previewSizes[0] : size;
            const width = parseFloat(currentSize.width as string);
            const height = parseFloat(currentSize.height as string);
            return width + 'X' + height;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'thyCropperSizeStyle'
})
export class ThyCropperSizeStylePipe implements PipeTransform {
    transform(size: ThyCropperImageSize) {
        if (size) {
            const { width, height } = size;
            if (width && height) {
                const stringWidth = isString(width) ? width : `${width}px`;
                const stringHeight = isString(height) ? height : `${height}px`;
                return { width: `${stringWidth}`, height: `${stringHeight}` };
            } else {
                return { width: '100%', height: '100%' };
            }
        } else {
            return { width: '100%', height: '100%' };
        }
    }
}
