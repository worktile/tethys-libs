import { ThyProBoardModule } from '@tethys/pro/board';
import { ThyProBoardBasicExampleComponent } from './basic/basic.component';
import { ThyBoardBasicCardComponent } from './basic/card/card.component';
import { CommonModule } from '@angular/common';
import { ThyProBoardSingleExampleComponent } from './single/single.component';
import { ThyProBoardCustomTemplateExampleComponent } from './custom-template/custom-template.component';
import { ThyProBoardVirtualScrollExampleComponent } from './virtual-scroll/virtual-scroll.component';
import { ThyProBoardMultiExampleComponent } from './multi/multi.component';
import { ThyProBoardDragExampleComponent } from './drag/drag.component';
import { ThyProBoardScrollLoadExampleComponent } from './scroll-load/scroll-load.component';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyBoardCustomTemplateAddComponent } from './custom-template/add/add.component';
import { FormsModule } from '@angular/forms';

export default {
    imports: [ThyProBoardModule, CommonModule, FormsModule, ThyIconModule, ThySharedModule, ThyButtonModule],
    declarations: [
        ThyProBoardBasicExampleComponent,
        ThyBoardBasicCardComponent,
        ThyProBoardSingleExampleComponent,
        ThyProBoardCustomTemplateExampleComponent,
        ThyBoardCustomTemplateAddComponent,
        ThyProBoardVirtualScrollExampleComponent,
        ThyProBoardScrollLoadExampleComponent,
        ThyProBoardMultiExampleComponent,
        ThyProBoardDragExampleComponent
    ]
};
