/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, Directive, ViewEncapsulation} from '@angular/core';
import {
  CDK_ROW_TEMPLATE, CdkFooterRow, CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';

/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[matHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef}],
  inputs: ['columns: matHeaderRowDef'],
})
export class MatHeaderRowDef extends CdkHeaderRowDef { }

/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[matFooterRowDef]',
  providers: [{provide: CdkFooterRowDef, useExisting: MatFooterRowDef}],
  inputs: ['columns: matFooterRowDef'],
})
export class MatFooterRowDef extends CdkFooterRowDef { }

/**
 * Data row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[matRowDef]',
  providers: [{provide: CdkRowDef, useExisting: MatRowDef}],
  inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
})
export class MatRowDef<T> extends CdkRowDef<T> {
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'mat-header-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'mat-header-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'matHeaderRow',
})
export class MatHeaderRow extends CdkHeaderRow { }

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'mat-footer-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'mat-footer-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'matFooterRow',
})
export class MatFooterRow extends CdkFooterRow { }

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'mat-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'mat-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'matRow',
})
export class MatRow extends CdkRow { }
