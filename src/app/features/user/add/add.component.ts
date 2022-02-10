import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-user-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class UserAddComponent implements OnInit {
    constructor(private dialog: ThyDialog) {}

    ngOnInit(): void {}

    cancel() {
        this.dialog.close();
    }
}
