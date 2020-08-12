/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export type OpenAction = 'focus' | 'click' | 'downKey' | 'toggle';
export type OpenActionInput = OpenAction | OpenAction[] | string | null | undefined;

import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output, ViewContainerRef
} from '@angular/core';
import {CdkComboboxPanel, AriaHasPopupValue} from './combobox-panel';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {Directionality} from '@angular/cdk/bidi';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';


@Directive({
  selector: '[cdkCombobox]',
  exportAs: 'cdkCombobox',
  host: {
    'role': 'combobox',
    '(click)': 'toggle()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-controls]': 'contentId',
    '[attr.aria-haspopup]': 'contentType'
  }
})
export class CdkCombobox<T = unknown> implements OnDestroy, AfterContentInit {
  @Input('cdkComboboxTriggerFor')
  get panel(): CdkComboboxPanel<T> | undefined { return this._panel; }
  set panel(panel: CdkComboboxPanel<T> | undefined) { this._panel = panel; }
  private _panel: CdkComboboxPanel<T> | undefined;

  @Input()
  value: T;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }
  private _disabled: boolean = false;

  @Input()
  get openActions(): OpenAction[] {
    return this._openActions;
  }
  set openActions(action: OpenAction[]) {
    this._openActions = this._coerceOpenActionProperty(action);
  }
  private _openActions: OpenAction[] = ['click'];

  @Output('comboboxPanelOpened') readonly opened: EventEmitter<void> = new EventEmitter<void>();
  @Output('comboboxPanelClosed') readonly closed: EventEmitter<void> = new EventEmitter<void>();
  @Output('panelValueChanged') readonly panelValueChanged: EventEmitter<T> = new EventEmitter<T>();

  private _overlayRef: OverlayRef;
  private _panelContent: TemplatePortal;
  contentId: string = '';
  contentType: AriaHasPopupValue;

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _overlay: Overlay,
    protected readonly _viewContainerRef: ViewContainerRef,
    @Optional() private readonly _directionality?: Directionality
  ) {}

  ngAfterContentInit() {
    this._panel?.valueUpdated.subscribe(data => {
      this._setComboboxValue(data);
      this.close();
    });

    this._panel?.contentIdUpdated.subscribe(id => {
      this.contentId = id;
    });

    this._panel?.contentTypeUpdated.subscribe(type => {
      this.contentType = type;
    });
  }

  ngOnDestroy() {
    this.opened.complete();
    this.closed.complete();
    this.panelValueChanged.complete();
  }

  /** Toggles the open state of the panel. */
  toggle() {
    if (this.hasPanel()) {
      this.isOpen() ? this.close() : this.open();
    }
  }

  /** If the combobox is closed and not disabled, opens the panel. */
  open() {
    if (!this.isOpen() && !this.disabled) {
      this.opened.next();
      this._overlayRef = this._overlayRef || this._overlay.create(this._getOverlayConfig());
      this._overlayRef.attach(this._getPanelContent());
    }
  }

  /** If the combobox is open and not disabled, closes the panel. */
  close() {
    if (this.isOpen() && !this.disabled) {
      this.closed.next();
      this._overlayRef.detach();
    }
  }

  /** Returns true if panel is currently opened. */
  isOpen(): boolean {
    return this._overlayRef ? this._overlayRef.hasAttached() : false;
  }

  /** Returns true if combobox has a child panel. */
  hasPanel(): boolean {
    return !!this.panel;
  }

  private _setComboboxValue(value: T) {
    const valueChanged = (this.value !== value);
    this.value = value;

    if (valueChanged) {
      this.panelValueChanged.emit(value);
      this._setTextContent(value);
    }
  }

  private _setTextContent(content: T) {
    if (typeof content === 'string') {
      this._elementRef.nativeElement.textContent = content;
    }
  }

  private _getOverlayConfig() {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      direction: this._directionality,
    });
  }

  private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .withPositions(this._getOverlayPositions());
  }

  private _getOverlayPositions(): ConnectedPosition[] {
    return [
      {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
      {originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom'},
      {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
      {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'},
    ];
  }

  private _getPanelContent() {
    const hasPanelChanged = this._panel?._templateRef !== this._panelContent?.templateRef;
    if (this._panel && (!this._panel || hasPanelChanged)) {
      this._panelContent = new TemplatePortal(this._panel._templateRef, this._viewContainerRef);
    }

    return this._panelContent;
  }

  private _coerceOpenActionProperty(input: string | OpenAction[]): OpenAction[] {
    let actions: OpenAction[] = [];
    if (typeof input === 'string') {
      actions.push(input as OpenAction);
    } else {
      actions = input;
    }
    return actions;
  }

  static ngAcceptInputType_openActions: OpenActionInput;
  static ngAcceptInputType_disabled: BooleanInput;
}
