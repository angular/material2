/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'gestures-demo',
  templateUrl: 'gestures-demo.html',
  styleUrls: ['gestures-demo.css'],
})
export class GesturesDemo {
  panCount: number = 0;
  pressCount: number = 0;
  longpressCount: number = 0;
  swipeCount: number = 0;
  slideCount: number = 0;
}
