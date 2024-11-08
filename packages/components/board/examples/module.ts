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

export default {
    imports: [ThyProBoardModule, CommonModule],
    declarations: [
        ThyProBoardBasicExampleComponent,
        ThyBoardBasicCardComponent,
        ThyProBoardSingleExampleComponent,
        ThyProBoardCustomTemplateExampleComponent,
        ThyProBoardVirtualScrollExampleComponent,
        ThyProBoardScrollLoadExampleComponent,
        ThyProBoardMultiExampleComponent,
        ThyProBoardDragExampleComponent
    ]
};
