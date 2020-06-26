import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  declarations: [PopoverComponent],
  // entryComponents: [PopoverComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [PopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
