/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule, MatRippleModule} from '@angular/material/core';
import {A11yModule} from '@angular/cdk/a11y';
import {MatFabModule} from '@angular/material/fab';
import {
  MatAnchor,
  MatButton,
  MatButtonCssMatStyler,
  MatIconButtonCssMatStyler,
  MatRaisedButtonCssMatStyler
} from './button';


@NgModule({
  imports: [
    CommonModule,
    MatRippleModule,
    MatCommonModule,
    MatFabModule,
    A11yModule,
  ],
  exports: [
    MatButton,
    MatAnchor,
    MatCommonModule,
    MatFabModule,
    MatButtonCssMatStyler,
    MatRaisedButtonCssMatStyler,
    MatIconButtonCssMatStyler,
  ],
  declarations: [
    MatButton,
    MatAnchor,
    MatButtonCssMatStyler,
    MatRaisedButtonCssMatStyler,
    MatIconButtonCssMatStyler,
  ],
})
export class MatButtonModule {}
