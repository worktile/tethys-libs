import { inject } from '@angular/core';
import { ThyImageCropperModule } from '@tethys/pro/image-cropper';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyNotifyModule, ThyNotifyService } from 'ngx-tethys/notify';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyFileSizeExceedsContext, ThyUploadModule, THY_UPLOAD_DEFAULT_OPTIONS } from 'ngx-tethys/upload';

export default {
    providers: [
        {
            provide: THY_UPLOAD_DEFAULT_OPTIONS,
            useFactory: () => {
                const notify = inject(ThyNotifyService);
                const thyUploaderConfig = {
                    sizeExceedsHandler: (event: ThyFileSizeExceedsContext) => {
                        if (event.exceedsFiles.length > 0) {
                            notify.warning(`提示`, `上传文件大小不能超过${event.sizeThreshold! / 1024}MB。`);
                        }
                    }
                };
                return thyUploaderConfig;
            }
        }
    ],
    imports: [ThyImageCropperModule, ThyButtonModule, ThySpaceModule, ThyUploadModule, ThyNotifyModule]
};
