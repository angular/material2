/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ContentChildren, QueryList} from '@angular/core';
import {MdStep} from './step';
import {MdStepper} from './stepper';

@Component({
  moduleId: module.id,
  selector: 'md-horizontal-stepper, mat-horizontal-stepper',
  templateUrl: 'stepper-horizontal.html',
  styleUrls: ['stepper.scss'],
  inputs: ['selectedIndex'],
  host: {
    'class': 'mat-stepper-horizontal',
    'role': 'tablist',
  },
  providers: [{provide: MdStepper, useExisting: MdHorizontalStepper}]
})
export class MdHorizontalStepper extends MdStepper {
  /** Steps that the horizontal stepper holds. */
  @ContentChildren(MdStep) _steps: QueryList<MdStep>;
}
