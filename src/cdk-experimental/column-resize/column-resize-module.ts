/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';

import {CdkColumnResize} from './column-resize-directives/column-resize';
import {CdkColumnResizeFlex} from './column-resize-directives/column-resize-flex';
import {
  CdkDefaultEnabledColumnResize
} from './column-resize-directives/default-enabled-column-resize';
import {
  CdkDefaultEnabledColumnResizeFlex
} from './column-resize-directives/default-enabled-column-resize-flex';

@NgModule({
  declarations: [CdkDefaultEnabledColumnResize, CdkDefaultEnabledColumnResizeFlex],
  exports: [CdkDefaultEnabledColumnResize, CdkDefaultEnabledColumnResizeFlex],
})
export class CdkColumnResizeDefaultEnabledModule {}

@NgModule({
  declarations: [CdkColumnResize, CdkColumnResizeFlex],
  exports: [CdkColumnResize, CdkColumnResizeFlex],
})
export class CdkColumnResizeModule {}
