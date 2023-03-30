import { ThyImageCropperModule } from '@tethys/pro/image-cropper';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyUploadModule } from 'ngx-tethys/upload';

export default {
    imports: [ThyImageCropperModule, ThyButtonModule, ThySpaceModule, ThyUploadModule, ThyNotifyModule]
};
