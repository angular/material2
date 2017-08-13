/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ViewChild,
  Component,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ContentChildren,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
  AfterContentInit,
  AfterContentChecked,
  OnDestroy,
  Optional,
} from '@angular/core';
import {HammerInput} from '../core';
import {Directionality, Direction} from '@angular/cdk/bidi';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {map} from '@angular/cdk/rxjs';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MdTab} from './tab';
import {merge} from 'rxjs/observable/merge';
import {CanDisableRipple, mixinDisableRipple} from '../core/common-behaviors/disable-ripple';
import {CanColor, mixinColor, ThemePalette} from '../core/common-behaviors/color';


/** Used to generate unique ID's for each tab component */
let nextId = 0;

/** A simple change event emitted on focus or selection changes. */
export class MdTabChangeEvent {
  index: number;
  tab: MdTab;
}

/** Possible positions for the tab header. */
export type MdTabHeaderPosition = 'above' | 'below';

// Boilerplate for applying mixins to MdTabGroup.
/** @docs-private */
export class MdTabGroupBase {
  constructor(public _renderer: Renderer2, public _elementRef: ElementRef) {}
}
export const _MdTabGroupMixinBase = mixinColor(mixinDisableRipple(MdTabGroupBase), 'primary');

/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
@Component({
  moduleId: module.id,
  selector: 'md-tab-group, mat-tab-group',
  templateUrl: 'tab-group.html',
  styleUrls: ['tab-group.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['color', 'disableRipple'],
  host: {
    'class': 'mat-tab-group',
    '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
    '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
  }
})
export class MdTabGroup extends _MdTabGroupMixinBase implements AfterContentInit,
    AfterContentChecked, AfterViewChecked, OnDestroy, CanColor, CanDisableRipple {

  @ContentChildren(MdTab) _tabs: QueryList<MdTab>;

  @ViewChild('tabBodyWrapper') _tabBodyWrapper: ElementRef;

  /** Whether this component has been initialized. */
  private _isInitialized: boolean = false;

  /** The tab index that should be selected after the content has been checked. */
  private _indexToSelect: number | null = 0;

  /** Snapshot of the height of the tab body wrapper before another tab is activated. */
  private _tabBodyWrapperHeight: number = 0;

  /** Subscription to tabs being added/removed. */
  private _tabsSubscription: Subscription;

  /** Subscription to changes in the tab labels. */
  private _tabLabelSubscription: Subscription;

  /** Whether the tab group should grow to the size of the active tab. */
  @Input()
  get dynamicHeight(): boolean { return this._dynamicHeight; }
  set dynamicHeight(value: boolean) { this._dynamicHeight = coerceBooleanProperty(value); }
  private _dynamicHeight: boolean = false;

  /** @deprecated */
  @Input('md-dynamic-height')
  get _dynamicHeightDeprecated(): boolean { return this._dynamicHeight; }
  set _dynamicHeightDeprecated(value: boolean) { this._dynamicHeight = value; }

  /** The index of the active tab. */
  @Input()
  set selectedIndex(value: number | null) { this._indexToSelect = value; }
  get selectedIndex(): number | null { return this._selectedIndex; }
  private _selectedIndex: number | null = null;

  /** Position of the tab header. */
  @Input() headerPosition: MdTabHeaderPosition = 'above';

  /** Background color of the tab group. */
  @Input()
  get backgroundColor(): ThemePalette { return this._backgroundColor; }
  set backgroundColor(value: ThemePalette) {
    let nativeElement = this._elementRef.nativeElement;

    this._renderer.removeClass(nativeElement, `mat-background-${this.backgroundColor}`);

    if (value) {
      this._renderer.addClass(nativeElement, `mat-background-${value}`);
    }

    this._backgroundColor = value;
  }
  private _backgroundColor: ThemePalette;

  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() get selectedIndexChange(): Observable<number> {
    return map.call(this.selectChange, event => event.index);
  }

  /** Event emitted when focus has changed within a tab group. */
  @Output() focusChange: EventEmitter<MdTabChangeEvent> = new EventEmitter<MdTabChangeEvent>();

  /** Event emitted when the tab selection has changed. */
  @Output() selectChange: EventEmitter<MdTabChangeEvent> = new EventEmitter<MdTabChangeEvent>(true);

  private _groupId: number;

  constructor(_renderer: Renderer2,
              elementRef: ElementRef,
              private _changeDetectorRef: ChangeDetectorRef,
              @Optional() private _dir: Directionality) {
    super(_renderer, elementRef);
    this._groupId = nextId++;
  }

  /**
   * After the content is checked, this component knows what tabs have been defined
   * and what the selected index should be. This is where we can know exactly what position
   * each tab should be in according to the new selected index, and additionally we know how
   * a new selected tab should transition in (from the left or right).
   */
  ngAfterContentChecked(): void {
    // Clamp the next selected index to the bounds of 0 and the tabs length. Note the `|| 0`, which
    // ensures that values like NaN can't get through and which would otherwise throw the
    // component into an infinite loop (since Math.max(NaN, 0) === NaN).
    let indexToSelect = this._indexToSelect =
        Math.min(this._tabs.length - 1, Math.max(this._indexToSelect || 0, 0));

    // If there is a change in selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this._selectedIndex != indexToSelect && this._selectedIndex != null) {
      this.selectChange.emit(this._createChangeEvent(indexToSelect));
    }

    // Setup the position for each tab and optionally setup an origin on the next selected tab.
    this._tabs.forEach((tab: MdTab, index: number) => {
      tab.position = index - indexToSelect;

      // If there is already a selected tab, then set up an origin for the next selected tab
      // if it doesn't have one already.
      if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
        tab.origin = indexToSelect - this._selectedIndex;
      }
    });

    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    this._subscribeToTabLabels();

    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      this._subscribeToTabLabels();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this._tabsSubscription) {
      this._tabsSubscription.unsubscribe();
    }

    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }
  }

  /**
   * Waits one frame for the view to update, then updates the ink bar
   * Note: This must be run outside of the zone or it will create an infinite change detection loop.
   */
  ngAfterViewChecked(): void {
    this._isInitialized = true;
  }

  _focusChanged(index: number): void {
    this.focusChange.emit(this._createChangeEvent(index));
  }

  private _createChangeEvent(index: number): MdTabChangeEvent {
    const event = new MdTabChangeEvent;
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }

  /**
   * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
   * on the MdTab component, whereas the data binding is inside the MdTabGroup. In order for the
   * binding to be updated, we need to subscribe to changes in it and trigger change detection
   * manually.
   */
  private _subscribeToTabLabels(): void {
    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }

    this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._labelChange)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  /** Returns a unique id for each tab label element */
  _getTabLabelId(i: number): string {
    return `md-tab-label-${this._groupId}-${i}`;
  }

  /** Returns a unique id for each tab content element */
  _getTabContentId(i: number): string {
    return `md-tab-content-${this._groupId}-${i}`;
  }

  /**
   * Sets the height of the body wrapper to the height of the activating tab if dynamic
   * height property is true.
   */
  _setTabBodyWrapperHeight(tabHeight: number): void {
    if (!this._dynamicHeight || !this._tabBodyWrapperHeight) { return; }

    this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height',
        this._tabBodyWrapperHeight + 'px');

    // This conditional forces the browser to paint the height so that
    // the animation to the new height can have an origin.
    if (this._tabBodyWrapper.nativeElement.offsetHeight) {
      this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height',
          tabHeight + 'px');
    }
  }

  /** Removes the height of the tab body wrapper. */
  _removeTabBodyWrapperHeight(): void {
    this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
    this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', '');
  }

  /** Body content was swiped left/right */
  _bodyContentSwiped(event: HammerInput): void {
    if (this.selectedIndex === null) {
      this.selectedIndex = 0;
    }

    if (event.direction === 2 || event.direction === 4) {
      let direction = event.direction === 4 ? 'right' : 'left';
      if (this._dir.value === 'rtl') {
        direction = direction === 'left' ? 'right' : 'left';
      }

      if (this.selectedIndex !== 0 && direction === 'right') {
        this._setActiveItemByIndex(this.selectedIndex - 1, -1);
      } else if (this.selectedIndex < this._tabs.length && direction === 'left') {
        this._setActiveItemByIndex(this.selectedIndex + 1, 1);
      }
    }
  }

  /**
   * Sets the active item to the first enabled item starting at the index specified. If the
   * item is disabled, it will move in the fallbackDelta direction until it either
   * finds an enabled item or encounters the end of the list.
   */
  private _setActiveItemByIndex(index: number,
                                fallbackDelta: number,
                                items = this._tabs.toArray()): void {
    if (!items[index]) { return; }
    while (items[index].disabled) {
      index += fallbackDelta;
      if (!items[index]) { return; }
    }
    this.selectedIndex = index;
  }

}
