/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  IterableDiffers,
  ViewEncapsulation
} from '@angular/core';
import {CDK_TABLE_TEMPLATE, CdkTable} from '@angular/cdk/table';

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-table, table[mat-table]',
  exportAs: 'matTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.css'],
  host: {
    'class': 'mat-table',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatTable<T> extends CdkTable<T> {
  // TODO(andrewseguin): Remove this explicitly set ctor when the compiler knows how to properly
  // build the es6 version of the class. Currently sets ctorParameters to empty due to a fixed bug.
  // https://github.com/angular/tsickle/pull/760 - tsickle PR that fixed this
  // https://github.com/angular/angular/pull/23531 - updates compiler-cli to fixed version
  constructor(protected _differs: IterableDiffers,
              protected _changeDetectorRef: ChangeDetectorRef,
              protected _elementRef: ElementRef,
              @Attribute('role') role: string) {
    super(_differs, _changeDetectorRef, _elementRef, role);
  }
}
