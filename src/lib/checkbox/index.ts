import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MdRippleModule, MdCommonModule, FocusOriginMonitor, ObserveContentModule} from '../core';
import {MdCheckbox} from './checkbox';


@NgModule({
  imports: [CommonModule, MdRippleModule, MdCommonModule, ObserveContentModule],
  exports: [MdCheckbox, MdCommonModule],
  declarations: [MdCheckbox],
  providers: [FocusOriginMonitor]
})
export class MdCheckboxModule {}


export * from './checkbox';
