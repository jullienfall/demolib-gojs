import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// component
import { GojsComponent } from './gojs.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: 'gojs', component: GojsComponent }])
    ],
    declarations: [GojsComponent]
})
export class GojsModule {}
