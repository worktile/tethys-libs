import { ThyProCropperModule } from '@tethys/pro/image-cropper';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyUploadModule } from 'ngx-tethys/upload';

export default {
    imports: [ThyProCropperModule, ThyButtonModule, ThySpaceModule, ThyUploadModule, ThyNotifyModule]
};
