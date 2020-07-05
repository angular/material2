/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkMenu} from './menu';
import {CdkMenuBar} from './menu-bar';
import {CdkMenuPanel} from './menu-panel';
import {CdkMenuItem} from './menu-item';
import {CdkMenuGroup} from './menu-group';
import {CdkMenuItemRadio} from './menu-item-radio';
import {CdkMenuItemCheckbox} from './menu-item-checkbox';
import {CdkMenuItemTrigger} from './menu-item-trigger';
import {TYPE_AHEAD_DEBOUNCE, defaultTypeAheadDebounce} from './menu-key-manager';

const EXPORTED_DECLARATIONS = [
  CdkMenuBar,
  CdkMenu,
  CdkMenuPanel,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuItemCheckbox,
  CdkMenuItemTrigger,
  CdkMenuGroup,
];
@NgModule({
  imports: [OverlayModule],
  exports: EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS,
  providers: [{provide: TYPE_AHEAD_DEBOUNCE, useValue: defaultTypeAheadDebounce}],
})
export class CdkMenuModule {}
