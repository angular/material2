/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Input, Optional} from '@angular/core';
import {MdSort, MdSortable} from './sort';
import {MdSortIntl} from './sort-intl';
import {CdkColumnDef} from '../core/data-table/cell';
import {SortDirection} from './sort-direction';
import {coerceBooleanProperty} from '../core';
import {getMdSortHeaderNotContainedWithinMdSortError} from './sort-errors';

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MdSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  moduleId: module.id,
  selector: '[md-sort-header], [mat-sort-header]',
  templateUrl: 'sort-header.html',
  styleUrls: ['sort-header.css'],
  host: {
    '(click)': '_sort.sort(this)',
    '[class.mat-sort-header-sorted]': '_isSorted()',
  }
})
export class MdSortHeader implements MdSortable {
  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('md-sort-header') id: string;

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: 'before' | 'after' = 'after';

  /** Overrides the sort start value of the containing MdSort for this MdSortable. */
  @Input('start') start: SortDirection;

  /** Overrides the disable clear value of the containing MdSort for this MdSortable. */
  @Input()
  get disableClear() { return this._disableClear; }
  set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
  private _disableClear: boolean;

  /** Overrides the reverse order value of the containing MdSort for this MdSortable. */
  @Input()
  get reverseOrder() { return this._reverseOrder; }
  set reverseOrder(v) { this._reverseOrder = coerceBooleanProperty(v); }
  private _reverseOrder: boolean;

  @Input('mat-sort-header')
  get _id() { return this.id; }
  set _id(v: string) { this.id = v; }

  constructor(@Optional() public _sort: MdSort,
              public _intl: MdSortIntl,
              @Optional() public _cdkColumnDef: CdkColumnDef) {
    if (!_sort) {
      throw getMdSortHeaderNotContainedWithinMdSortError();
    }
  }

  ngOnInit() {
    if (!this.id && this._cdkColumnDef) {
      this.id = this._cdkColumnDef.name;
    }

    this._sort.register(this);
  }

  ngOnDestroy() {
    this._sort.unregister(this);
  }

  /** Whether this MdSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    return this._sort.active == this.id && this._sort.direction != '';
  }
}
