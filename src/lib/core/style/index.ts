import {NgModule} from '@angular/core';
import {CdkFocusClasses, FOCUS_ORIGIN_MONITOR_PROVIDER} from './add-focus-classes';

export * from './add-focus-classes';
export * from './apply-transform';


@NgModule({
  declarations: [CdkFocusClasses],
  exports: [CdkFocusClasses],
  providers: [FOCUS_ORIGIN_MONITOR_PROVIDER],
})
export class StyleModule {}
