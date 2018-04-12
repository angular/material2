/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'virtual-scroll-demo',
  templateUrl: 'virtual-scroll-demo.html',
  styleUrls: ['virtual-scroll-demo.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VirtualScrollDemo {
  fixedSizeData = Array(10000).fill(50);
  increasingSizeData = Array(10000).fill(0).map((_, i) => (1 + Math.floor(i / 1000)) * 20);
  decreasingSizeData = Array(10000).fill(0)
      .map((_, i) => (1 + Math.floor((10000 - i) / 1000)) * 20);
  randomData = Array(10000).fill(0).map(() => Math.round(Math.random() * 100));
}
