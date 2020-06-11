/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Platform} from '@angular/cdk/platform';
import {DOCUMENT} from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  QueryList
} from '@angular/core';
import {RippleConfig, RippleRenderer, RippleTarget, setLines} from '@angular/material/core';
import {MDCListAdapter, MDCListFoundation} from '@material/list';
import {Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';

function toggleClass(el: Element, className: string, on: boolean) {
  if (on) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }
}

@Directive()
/** @docs-private */
export abstract class MatListItemBase implements AfterContentInit, OnDestroy, RippleTarget {
  @HostBinding('tabindex')
  _tabIndex = -1;

  lines: QueryList<ElementRef<Element>>;

  rippleConfig: RippleConfig = {};

  // TODO(mmalerba): Add @Input for disabling ripple.
  rippleDisabled: boolean;

  private _subscriptions = new Subscription();

  private _rippleRenderer: RippleRenderer;

  protected constructor(public _elementRef: ElementRef<HTMLElement>, protected _ngZone: NgZone,
                        listBase: MatListBase, platform: Platform) {
    this.rippleDisabled = listBase._isNonInteractive;
    if (!listBase._isNonInteractive) {
      this._elementRef.nativeElement.classList.add('mat-mdc-list-item-interactive');
    }
    this._rippleRenderer =
        new RippleRenderer(this, this._ngZone, this._elementRef.nativeElement, platform);
    this._rippleRenderer.setupTriggerEvents(this._elementRef.nativeElement);
  }

  ngAfterContentInit() {
    this._monitorLines();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
    this._rippleRenderer._removeTriggerEvents();
  }

  /**
   * Changes the tabindex of all button and anchor children of this item.
   *
   * This method is used by the `MatInteractiveBaseList` to implement the
   * `setTabIndexForListItemChildren` method on the `MDCListAdapter`
   */
  _setTabIndexForChildren(value: number) {
    this._elementRef.nativeElement.querySelectorAll<HTMLElement>('a, button')
        .forEach(el => el.tabIndex = value);
  }

  /**
   * Subscribes to changes in `MatLine` content children and annotates them appropriately when they
   * change.
   */
  private _monitorLines() {
    this._ngZone.runOutsideAngular(() => {
      this._subscriptions.add(this.lines.changes.pipe(startWith(this.lines))
          .subscribe((lines: QueryList<ElementRef<Element>>) => {
            this._elementRef.nativeElement.classList
                .toggle('mat-mdc-list-item-single-line', lines.length <= 1);
            lines.forEach((line: ElementRef<Element>, index: number) => {
              toggleClass(line.nativeElement,
                  'mdc-list-item__primary-text', index === 0 && lines.length > 1);
              toggleClass(line.nativeElement, 'mdc-list-item__secondary-text', index !== 0);
            });
            setLines(lines, this._elementRef, 'mat-mdc');
          }));
    });
  }
}

@Directive()
/** @docs-private */
export abstract class MatListBase {
  @HostBinding('class.mdc-list--non-interactive')
  _isNonInteractive: boolean = true;
}

@Directive()
export abstract class MatInteractiveListBase extends MatListBase
    implements AfterViewInit, OnDestroy {
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent) {
    const index = this._indexForElement(event.target as HTMLElement);
    this._foundation.handleKeydown(
        event, this._elementAtIndex(index) === event.target, index);
  }

  @HostListener('click', ['$event'])
  _handleClick(event: MouseEvent) {
    this._foundation.handleClick(this._indexForElement(event.target as HTMLElement), false);
  }

  @HostListener('focusin', ['$event'])
  _handleFocusin(event: FocusEvent) {
    this._foundation.handleFocusIn(event, this._indexForElement(event.target as HTMLElement));
  }

  @HostListener('focusout', ['$event'])
  _handleFocusout(event: FocusEvent) {
    this._foundation.handleFocusOut(event, this._indexForElement(event.target as HTMLElement));
  }

  @ContentChildren(MatListItemBase, {descendants: true}) _items: QueryList<MatListItemBase>;

  protected _adapter: MDCListAdapter = {
    getListItemCount: () => this._items.length,
    listItemAtIndexHasClass:
        (index, className) => this._elementAtIndex(index).classList.contains(className),
    addClassForElementIndex:
        (index, className) => this._elementAtIndex(index).classList.add(className),
    removeClassForElementIndex:
        (index, className) => this._elementAtIndex(index).classList.remove(className),
    getAttributeForElementIndex: (index, attr) => this._elementAtIndex(index).getAttribute(attr),
    setAttributeForElementIndex:
        (index, attr, value) => this._elementAtIndex(index).setAttribute(attr, value),
    setTabIndexForListItemChildren:
        (index, value) => this._itemAtIndex(index)._setTabIndexForChildren(Number(value)),
    getFocusedElementIndex: () => this._indexForElement(this._document?.activeElement),
    isFocusInsideList: () => this._element.nativeElement.contains(this._document?.activeElement),
    isRootFocused: () => this._element.nativeElement === this._document?.activeElement,
    focusItemAtIndex: index =>  this._elementAtIndex(index).focus(),

    // The following methods have a dummy implementation in the base class because they are only
    // applicable to certain types of lists. They should be implemented for the concrete classes
    // where they are applicable.
    hasCheckboxAtIndex: () => false,
    hasRadioAtIndex: () => false,
    setCheckedCheckboxOrRadioAtIndex: () => {},
    isCheckboxCheckedAtIndex: () => false,

    // TODO(mmalerba): Determine if we need to implement these.
    getPrimaryTextAtIndex: () => '',
    notifyAction: () => {},
  };

  protected _foundation: MDCListFoundation;

  protected _document: Document;

  private _itemsArr: MatListItemBase[] = [];

  private _subscriptions = new Subscription();

  constructor(protected _element: ElementRef<HTMLElement>, @Inject(DOCUMENT) document: any) {
    super();
    this._document = document;
    this._isNonInteractive = false;
    this._foundation = new MDCListFoundation(this._adapter);
  }

  ngAfterViewInit() {
    this._foundation.init();
    const first = this._itemAtIndex(0);
    if (first) {
      first._elementRef.nativeElement.tabIndex = 0;
    }
    this._foundation.layout();
    this._subscriptions.add(
        this._items.changes.subscribe(() => this._itemsArr = this._items.toArray()));
  }

  ngOnDestroy() {
    this._foundation.destroy();
    this._subscriptions.unsubscribe();
  }

  private _itemAtIndex(index: number): MatListItemBase {
    return this._itemsArr[index];
  }

  private _elementAtIndex(index: number): HTMLElement {
    return this._itemAtIndex(index)._elementRef.nativeElement;
  }

  private _indexForElement(element: Element | null) {
    return element ?
        this._itemsArr.findIndex(i => i._elementRef.nativeElement.contains(element)) : -1;
  }
}

