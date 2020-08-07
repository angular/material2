/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MatCellDef, MatColumnDef, MatHeaderCellDef, MatTable} from '@angular/material/table';
import {
  Component,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Inject,
} from '@angular/core';

import {MatSelection} from './selection';

/**
 * Column that adds row selecting checkboxes and a select-all checkbox if `matSelectionMultiple` is
 * `true`.
 *
 * Must be used within a parent `MatSelection` directive.
 */
@Component({
  selector: 'mat-selection-column',
  template: `
    <ng-container matColumnDef>
      <th mat-header-cell *matHeaderCellDef class="mat-selection-column-header">
        <mat-checkbox *ngIf="selection.multiple"
            matSelectAll
            #allToggler="matSelectAll"
            [indeterminate]="allToggler.indeterminate | async"></mat-checkbox>
      </th>
      <td mat-cell *matCellDef="let row; let i = $index" class="mat-selection-column-cell">
        <mat-checkbox
            matSelectionToggle
            [matSelectionToggleValue]="row"
            [matSelectionToggleIndex]="i"></mat-checkbox>
      </td>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['selection-column.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MatSelectionColumn<T> implements OnInit, OnDestroy {
  /** Column name that should be used to reference this column. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;

    this._syncColumnDefName();
  }
  private _name: string;

  @ViewChild(MatColumnDef, {static: true}) private readonly _columnDef: MatColumnDef;
  @ViewChild(MatCellDef, {static: true}) private readonly _cell: MatCellDef;
  @ViewChild(MatHeaderCellDef, {static: true}) private readonly _headerCell: MatHeaderCellDef;

  constructor(
      @Optional() @Inject(MatTable) private _table: MatTable<T>,
      @Optional() @Inject(MatSelection) readonly selection: MatSelection<T>,
  ) {}

  ngOnInit() {
    if (!this.selection && isDevMode()) {
      throw Error('MatSelectionColumn: missing MatSelection in the parent');
    }

    this._syncColumnDefName();

    if (this._table) {
      this._columnDef.cell = this._cell;
      this._columnDef.headerCell = this._headerCell;
      this._table.addColumnDef(this._columnDef);
    } else if (isDevMode()) {
      throw Error('MatSelectionColumn: missing parent table');
    }
  }

  ngOnDestroy() {
    if (this._table) {
      this._table.removeColumnDef(this._columnDef);
    }
  }

  private _syncColumnDefName() {
    if (this._columnDef) {
      this._columnDef.name = this._name;
    }
  }
}
