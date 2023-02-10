import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyProDashboardModule } from '@tethys/pro/dashboard';
import { ThyDashboardBasicNoticeWidgetComponent } from './basic/widgets/notice/notice.component';
import { ThyDashboardBasicLinksWidgetComponent } from './basic/widgets/links/links.component';

export default {
    declarations: [ThyDashboardBasicNoticeWidgetComponent, ThyDashboardBasicLinksWidgetComponent],
    imports: [ThyProDashboardModule, ThyButtonModule]
};
