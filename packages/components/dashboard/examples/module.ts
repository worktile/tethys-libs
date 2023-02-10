import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyProDashboardModule } from '@tethys/pro/dashboard';
import { ThyDashboardBasicNoticeWidgetComponent } from './basic/widgets/notice.component';

export default {
    declarations: [ThyDashboardBasicNoticeWidgetComponent],
    imports: [ThyProDashboardModule, ThyButtonModule]
};
