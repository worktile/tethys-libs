export interface ThyCropperImageSize {
    width: number | string;
    height: number | string;
}

export interface thyCropDataChangeEvent {
    blob: Blob;
}

export type ThyCropperDragMode = 'crop' | 'move' | 'none';

export type ThyCropperViewMode = 0 | 1 | 2 | 3;

export type ThyCropperShape = 'rect' | 'round';

/**
 * viewMode 视图模式，选项为 0（移动没有限制）、 1（图片只能在图片内移动而不是整个容器） 、2（图片不全部铺满容器） 、3（图片填充整个容器），default：0，
 * aspectRatio 裁剪框宽高比
 * dragMode 拖拽模式，选项为 'crop'（产生一个新的裁剪框） 'move'（移动） 'none'(不处理)
 * cropBoxResizable 是否通过拖动来调整剪裁框的大小
 * zoomable 是否允许放大图片
 * guides 是否显示裁剪框的虚线
 * autoCrop 是否允许初始化自动裁剪
 * zoomOnWheel 是否允许通过鼠标滚轮缩放图片
 * checkCrossOrigin 检查当前图片是否跨域
 * preview 预览的容器 设置了aspectRatio属性，确保将预览容器设置为相同的宽高比
 * crop() 手动显示裁剪框
 * getCroppedCanvas 画一张裁剪的图片
 */
export interface ThyCropperOptions {
    aspectRatio?: number;
    autoCrop?: boolean;
    checkCrossOrigin?: boolean;
    crop?(event: CustomEvent): void;
    cropBoxResizable?: boolean;
    dragMode?: ThyCropperDragMode;
    guides?: boolean;
    movable?: boolean;
    preview?: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | string;
    ready?(event: CustomEvent): void;
    rotatable?: boolean;
    scalable?: boolean;
    viewMode?: ThyCropperViewMode;
    wheelZoomRatio?: number;
    zoom?(event: CustomEvent): void;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean;
    zoomable?: boolean;
    center?: boolean;
}
