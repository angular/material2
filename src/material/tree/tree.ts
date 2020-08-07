/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CdkTree} from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  IterableDiffers,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatTreeNodeOutlet} from './outlet';

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  selector: 'mat-tree',
  exportAs: 'matTree',
  template: `<ng-container matTreeNodeOutlet></ng-container>`,
  styleUrls: ['tree.css'],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTree for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{provide: CdkTree, useExisting: MatTree}]
})
export class MatTree<T> extends CdkTree<T> {
  @HostBinding('attr.role') _role = 'tree';

  // Outlets within the tree's template where the dataNodes will be inserted.
  @ViewChild(MatTreeNodeOutlet, {static: true}) _nodeOutlet: MatTreeNodeOutlet;

  constructor(_differs: IterableDiffers,
              _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef<HTMLElement>) {
    super(_differs, _changeDetectorRef, _elementRef);
    _elementRef.nativeElement.classList.add('mat-tree');
  }
}
