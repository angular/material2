import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ProjectionModule, PortalModule} from '../core';

import {MdInput} from './input';
import {MdPlaceholder, MdPlaceholderContent} from './placeholder';


export * from './input';
export * from './placeholder';


@NgModule({
  declarations: [MdPlaceholderContent, MdPlaceholder, MdInput],
  imports: [PortalModule, ProjectionModule, CommonModule],
  exports: [MdPlaceholder, MdInput],
  entryComponents: [MdPlaceholderContent]
})
export class MdInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdInputModule,
      providers: []
    };
  }
}
