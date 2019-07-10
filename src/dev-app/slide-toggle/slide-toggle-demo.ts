/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'slide-toggle-demo',
  templateUrl: 'slide-toggle-demo.html',
  styleUrls: ['slide-toggle-demo.css'],
})
export class SlideToggleDemo {

  firstToggle: boolean;
  customTrueValue: string = 'Yes!!';
  customFalseValue: string = 'No!!';
  secondToggle: string = this.customTrueValue;

  onFormSubmit() {
    alert(`You submitted the form.`);
  }

}
