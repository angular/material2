/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
  Input,
  ContentChildren,
  OnDestroy,
  QueryList,
  AfterContentInit,
  Directive,
  ChangeDetectionStrategy,
} from '@angular/core';
import {auditTime} from '@angular/cdk/rxjs';
import {of as observableOf} from 'rxjs/observable/of';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Subscription} from 'rxjs/Subscription';
import {MdLine, MdLineSetter} from '../core';
import {coerceToNumber} from './grid-list-measure';
import {matchedMedia, processResponsiveValues} from './grid-util';

@Component({
  moduleId: module.id,
  selector: 'md-grid-tile, mat-grid-tile',
  host: {
    'class': 'mat-grid-tile',
  },
  templateUrl: 'grid-tile.html',
  styleUrls: ['grid-list.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdGridTile implements OnDestroy, AfterContentInit {
  _rowspan: number = 1;
  _colspan: number = 1;

  _responsiveColspan = {};
  _responsiveRowspan = {};

  _currentColspan: number = 1;
  _currentRowspan: number = 1;

  /** Subscription for window.resize event **/
  private _resizeSubscription: Subscription;

  constructor(private _renderer: Renderer2, private _element: ElementRef) {}

  /** Amount of rows that the grid tile takes up. */
  @Input()
  get rowspan() { return this._currentRowspan; }
  set rowspan(value) {
    this._rowspan = coerceToNumber(value);
    this._calculateRowspan();
  }

  /** Amount of columns that the grid tile takes up. */
  @Input()
  get colspan() { return this._currentColspan; }
  set colspan(value) {
    this._colspan = coerceToNumber(value);
    this._calculateColspan();
  }

  @Input()
  set responsiveColspan(value: {}) {
    this._responsiveColspan = processResponsiveValues(value);
    this._calculateColspan();
  }

  @Input()
  set responsiveRowspan(value: {}) {
    this._responsiveRowspan = processResponsiveValues(value);
    this._calculateRowspan();
  }

  /** Track resize event */
  ngAfterContentInit() {
    let resize = typeof window !== 'undefined' ?
      auditTime.call(fromEvent(window, 'resize'), 150) :
      observableOf(null);
    this._resizeSubscription = resize.subscribe(() => {
      this._onResize();
    });
  }

  _onResize() {
    this._calculateColspan();
    this._calculateRowspan();
  }


  /** Destroy resize subscription */
  ngOnDestroy() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
  }

  /**
   * Sets the style of the grid-tile element.  Needs to be set manually to avoid
   * "Changed after checked" errors that would occur with HostBinding.
   */
  _setStyle(property: string, value: string): void {
    this._renderer.setStyle(this._element.nativeElement, property, value);
  }

  private _calculateRowspan() {
    this._currentRowspan = matchedMedia(this._responsiveRowspan, this._rowspan);
  }

  private _calculateColspan() {
    this._currentColspan = matchedMedia(this._responsiveColspan, this._colspan);
  }
}

@Component({
  moduleId: module.id,
  selector: 'md-grid-tile-header, mat-grid-tile-header, md-grid-tile-footer, mat-grid-tile-footer',
  templateUrl: 'grid-tile-text.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdGridTileText implements AfterContentInit {
  /**
   *  Helper that watches the number of lines in a text area and sets
   * a class on the host element that matches the line count.
   */
  _lineSetter: MdLineSetter;
  @ContentChildren(MdLine) _lines: QueryList<MdLine>;

  constructor(private _renderer: Renderer2, private _element: ElementRef) {}

  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
  }
}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-grid-avatar], [mat-grid-avatar], [mdGridAvatar], [matGridAvatar]',
  host: {'class': 'mat-grid-avatar'}
})
export class MdGridAvatarCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-grid-tile-header, mat-grid-tile-header',
  host: {'class': 'mat-grid-tile-header'}
})
export class MdGridTileHeaderCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-grid-tile-footer, mat-grid-tile-footer',
  host: {'class': 'mat-grid-tile-footer'}
})
export class MdGridTileFooterCssMatStyler {}
