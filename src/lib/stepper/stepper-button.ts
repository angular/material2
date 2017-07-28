/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive} from '@angular/core';
import {CdkStepper, CdkStepperNext, CdkStepperPrevious} from '@angular/cdk/stepper';
import {MdStepper} from './stepper';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  selector: 'button[mdStepperNext], button[matStepperNext]',
  host: {
    '(click)': '_stepper.next()',
    'type': 'button'
  },
  providers: [{provide: CdkStepper, useExisting: MdStepper}]
})
export class MdStepperNext extends CdkStepperNext { }

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  selector: 'button[mdStepperPrevious], button[matStepperPrevious]',
  host: {'(click)': '_stepper.previous()', 'type': 'button'},
  providers: [{provide: CdkStepper, useExisting: MdStepper}]
})
export class MdStepperPrevious extends CdkStepperPrevious { }
