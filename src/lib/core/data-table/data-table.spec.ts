import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {
  CdkCellOutlet,
  CdkColumnDef,
  CdkHeaderRowCell,
  CdkHeaderCellDef,
  CdkHeaderRowDef,
  CdkHeaderRow,
  CdkHeaderRowPlaceholder,
  CdkRow,
  CdkRowCell,
  CdkRowCellDef,
  CdkRowDef,
  CdkRowPlaceholder,
  CdkTable,
  CollectionViewer
} from './data-table';
import {DataSource} from './data-source';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

fdescribe('CdkTable', () => {
  let fixture: ComponentFixture<SimpleCdkTableApp>;

  let component: SimpleCdkTableApp, dataSource: FakeDataSource, table: CdkTable;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [
        SimpleCdkTableApp,
        CdkTable, CdkRowDef, CdkRowCellDef, CdkCellOutlet, CdkHeaderCellDef,
        CdkColumnDef, CdkRowCell, CdkRow,
        CdkHeaderRowCell, CdkHeaderRow, CdkHeaderRowDef,
        CdkRowPlaceholder, CdkHeaderRowPlaceholder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleCdkTableApp);
    component = fixture.componentInstance;
    dataSource = component.dataSource as FakeDataSource;
    table = component.table;

    fixture.detectChanges();  // Let the component and table create embedded views
    fixture.detectChanges();  // Let the cells render
  }));

  function getElements(element: HTMLElement, query: string): HTMLElement[] {
    return [].slice.call(element.querySelectorAll(query));
  }

  function getRows() {
    return fixture ? getElements(fixture.nativeElement, '.cdk-row') : [];
  }

  function getRowCells(row: HTMLElement) {
    return row ? getElements(row, '.cdk-row-cell') : [];
  }

  describe('should initialize', () => {
    it('with a connected data source', () => {
      expect(table.dataSource).toBe(dataSource);
      expect(dataSource.isConnected).toBe(true);
    });

    it('with a rendered header with the right number of header cells', () => {
      const header = fixture.nativeElement.querySelector('.cdk-header-row');

      expect(header).not.toBe(undefined);
      expect(header.classList).toContain('customHeaderRowClass');

      const cells = [].slice.call(header.querySelectorAll('.cdk-header-cell'));
      expect(cells.length).toBe(component.columnsToRender.length);
    });

    it('with rendered rows with right number of row cells', () => {
      expect(getRows().length).toBe(dataSource.data.length);
      getRows().forEach(row => {
        expect(row.classList).toContain('customRowClass');
        expect(getRowCells(row).length).toBe(component.columnsToRender.length);
      });
    });
  });

  it('should re-render the rows when the data changes', () => {
    dataSource.addData();
    fixture.detectChanges();

    expect(getRows().length).toBe(dataSource.data.length);

    // Check that the number of cells is correct
    getRows().forEach(row => {
      expect(getRowCells(row).length).toBe(component.columnsToRender.length);
    });
  });
});

interface TestData {
  a: string;
  b: string;
  c: string;
}

class FakeDataSource extends DataSource<TestData> {
  isConnected: boolean = false;

  _dataChange = new BehaviorSubject<TestData[]>([]);
  set data(data: TestData[]) { this._dataChange.next(data); }
  get data() { return this._dataChange.getValue(); }

  constructor() {
    super();
    for (let i = 0; i < 3; i++) { this.addData(); }
  }

  connectTable(viewChange: Observable<CollectionViewer>): Observable<TestData[]> {
    this.isConnected = true;
    return Observable.combineLatest(viewChange, this._dataChange).map((results: any[]) => {
      const [view, data] = results;
      return data;
    });
  }

  addData() {
    const nextIndex = this.data.length + 1;

    let copiedData = this.data.slice();
    copiedData.push({
      a: `a_${nextIndex}`,
      b: `b_${nextIndex}`,
      c: `c_${nextIndex}`
    });

    this.data = copiedData;
  }
}

@Component({
  template: `
    <cdk-table [dataSource]="dataSource">
      <ng-container cdkColumnDef="column_a">
        <cdk-header-cell *cdkHeaderCellDef> Column A</cdk-header-cell>
        <cdk-row-cell *cdkRowCellDef="let row"> {{row.a}}</cdk-row-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_b">
        <cdk-header-cell *cdkHeaderCellDef> Column B</cdk-header-cell>
        <cdk-row-cell *cdkRowCellDef="let row"> {{row.b}}</cdk-row-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_c">
        <cdk-header-cell *cdkHeaderCellDef> Column C</cdk-header-cell>
        <cdk-row-cell *cdkRowCellDef="let row"> {{row.c}}</cdk-row-cell>
      </ng-container>

      <cdk-header-row class="customHeaderRowClass"
                      *cdkHeaderRowDef="columnsToRender"></cdk-header-row>
      <cdk-row class="customRowClass"
               *cdkRowDef="let row; columns: columnsToRender"></cdk-row>
    </cdk-table>
  `
})
class SimpleCdkTableApp {
  dataSource: FakeDataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(CdkTable) table: CdkTable;
}
