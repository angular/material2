/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  ContentChildren,
  Directive,
  Input,
  QueryList, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {SimpleDataSource} from './simple-data-source';
import {MdPaginator} from '../paginator/index';

/**
 * Material table that uses a simple interface.
 */
@Directive({
  selector: 'md-simple-column, mat-simple-column',
  host: {
    'class': 'mat-simple-column',
  },
})
export class MdSimpleColumn<T> {
  @Input() headerText: string;
  @Input() property: string;
}


/**
 * Material table that uses a simple interface.
 */
@Component({
  moduleId: module.id,
  selector: 'md-simple-table, mat-simple-table',
  templateUrl: 'simple-table.html',
  styleUrls: ['simple-table.css'],
  host: {
    'class': 'mat-simple-table',
  },
  encapsulation: ViewEncapsulation.None,
})
export class MdSimpleTable<T> {
  _dataSource = new SimpleDataSource<T>();

  columnProperties: {headerText: string, property: string}[] = [];
  columnIds: string[];

  @ViewChild(MdPaginator) paginator: MdPaginator;

  @Input() tableTitle: string;

  @Input()
  set pageSize(pageSize: number) {
    this.paginator.pageSize = pageSize;
    this._dataSource.refresh();
  }
  get pageSize(): number { return this.paginator.pageSize; }

  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  @Input()
  set data(data: T[]) { this._dataSource.data = data; }
  get data(): T[] { return this._dataSource.data; }

  @ContentChildren(MdSimpleColumn) columns: QueryList<MdSimpleColumn<T>>;

  ngAfterContentChecked() {
    this.columnProperties = this.columns.map(column => {
      return {
        headerText: column.headerText,
        property: column.property
      };
    });
    this.columnIds = this.columnProperties.map(column => column.property);
  }
}
