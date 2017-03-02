import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule, CompatibilityModule} from '../core';
import {MdMenu} from './menu-directive';
import {MdMenuItem} from './menu-item';
import {MdMenuInputItem} from './menu-input-item';
import {MdMenuTrigger} from './menu-trigger';
import {MdRippleModule} from '../core/ripple/ripple';
export {MdMenu} from './menu-directive';
export {MdMenuItem} from './menu-item';
export {MdMenuInputItem} from './menu-input-item';
export {MdMenuTrigger} from './menu-trigger';
export {MdMenuPanel} from './menu-panel';
export {MenuPositionX, MenuPositionY} from './menu-positions';


@NgModule({
  imports: [OverlayModule, CommonModule, MdRippleModule, CompatibilityModule],
  exports: [MdMenu, MdMenuItem, MdMenuInputItem, MdMenuTrigger, CompatibilityModule],
  declarations: [MdMenu, MdMenuItem, MdMenuInputItem, MdMenuTrigger],
})
export class MdMenuModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdMenuModule,
      providers: [],
    };
  }
}
