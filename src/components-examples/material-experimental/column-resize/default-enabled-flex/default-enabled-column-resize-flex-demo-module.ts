/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatDefaultEnabledColumnResizeModule} from '@angular/material-experimental/column-resize';

import {DefaultEnabledColumnResizeFlexDemo} from './default-enabled-column-resize-flex-demo';

@NgModule({
  imports: [
    MatDefaultEnabledColumnResizeModule,
    MatTableModule,
  ],
  declarations: [DefaultEnabledColumnResizeFlexDemo],
  exports: [DefaultEnabledColumnResizeFlexDemo],
})
export class DefaultEnabledColumnResizeFlexDemoModule {
}
