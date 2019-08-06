/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {CopyToClipboard} from './copy-to-clipboard';

@NgModule({declarations: [CopyToClipboard], imports: [CommonModule], exports: [CopyToClipboard]})
export class ClipboardModule {
}
