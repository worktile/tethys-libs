import { ThyProBoardModule } from '@tethys/pro/board';
import { ThyProBoardBasicExampleComponent } from './basic/basic.component';
import { ThyBoardBasicCardComponent } from './basic/card/card.component';
import { CommonModule } from '@angular/common';
import { ThyProBoardSingleExampleComponent } from './single/single.component';
import { ThyProBoardManualLaneExampleComponent } from './manual-lane/manual-lane.component';

export default {
    imports: [ThyProBoardModule, CommonModule],
    declarations: [
        ThyProBoardBasicExampleComponent,
        ThyBoardBasicCardComponent,
        ThyProBoardSingleExampleComponent,
        ThyProBoardManualLaneExampleComponent
    ]
};
