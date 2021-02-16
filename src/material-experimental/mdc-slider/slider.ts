/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput
} from '@angular/cdk/coercion';
import {Platform} from '@angular/cdk/platform';
import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {SpecificEventListener, EventType} from '@material/base';
import {MDCSliderAdapter, MDCSliderFoundation, Thumb, TickMark} from '@material/slider';

/**
 * Represents a drag event emitted by the MatSlider component.
 */
export interface MatSliderDragEvent {
  /** The MatSliderThumb that was interacted with. */
  source: MatSliderThumb;

  /** The MatSlider that was interacted with. */
  parent: MatSlider;

  /** The current value of the slider. */
  value: number;
}

/**
 * The native input used by the MatSlider.
 */
@Directive({
  selector: 'input[matSliderThumb], input[matSliderStartThumb], input[matSliderEndThumb]',
  host: {
    'class': 'mdc-slider__input',
    'type': 'range',
    '(blur)': '_blur.emit()',
    '(focus)': '_focus.emit()',
  },
})
export class MatSliderThumb implements AfterViewInit {

  // ** IMPORTANT NOTE **
  //
  // The way `value` is implemented for MatSliderThumb goes against our standard practice. Normally
  // we would define a private variable `_value` as the source of truth for the value of the slider
  // thumb input. The source of truth for the value of the slider inputs has already been decided
  // for us by MDC to be the value attribute on the slider thumb inputs. This is because the MDC
  // foundation and adapter expect that the value attribute is the source of truth for the slider
  // inputs.
  //
  // Also, note that the value attribute is completely disconnected from the value property.

  /** The current value of this slider input. */
  @Input()
  get value(): number {
    return coerceNumberProperty(this._elementRef.nativeElement.getAttribute('value'));
  }
  set value(v: number) {
    const value = coerceNumberProperty(v);

    // If the foundation has already been initialized, we need to
    // relay any value updates to it so that it can update the UI.
    if (this._slider._initialized) {
      this._slider._setValue(value, this._thumb);
    } else {
      // Setup for the MDC foundation.
      this._elementRef.nativeElement.setAttribute('value', `${value}`);
    }
  }

  /** Event emitted when the slider thumb starts being dragged. */
  @Output() readonly dragStart: EventEmitter<MatSliderDragEvent>
    = new EventEmitter<MatSliderDragEvent>();

  /** Event emitted when the slider thumb stops being dragged. */
  @Output() readonly dragEnd: EventEmitter<MatSliderDragEvent>
    = new EventEmitter<MatSliderDragEvent>();

  /** Event emitted every time the MatSliderThumb is blurred. */
  @Output() readonly _blur: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted every time the MatSliderThumb is focused. */
  @Output() readonly _focus: EventEmitter<void> = new EventEmitter<void>();

  /** Indicates which slider thumb this input corresponds to. */
  private _thumb: Thumb;

  private _document: Document;

  constructor(
    @Inject(DOCUMENT) document: any,
    private readonly _slider: MatSlider,
    readonly _elementRef: ElementRef<HTMLInputElement>,
    ) {
      this._document = document;
      this._thumb = _elementRef.nativeElement.hasAttribute('matSliderStartThumb')
        ? Thumb.START
        : Thumb.END;

      // Only set the default value if an initial value has not already been provided.
      // Note that we are only setting the value attribute at this point. We cannot set the value
      // property yet because the min and max have not been set.
      if (!_elementRef.nativeElement.hasAttribute('value')) {
        this.value = _elementRef.nativeElement.hasAttribute('matSliderEndThumb')
          ? _slider.max
          : _slider.min;
      }
    }

  ngAfterViewInit() {
    const min = this._elementRef.nativeElement.hasAttribute('matSliderEndThumb')
      ? this._slider._getInput(Thumb.START).value
      : this._slider.min;
    const max = this._elementRef.nativeElement.hasAttribute('matSliderStartThumb')
      ? this._slider._getInput(Thumb.END).value
      : this._slider.max;
    this._elementRef.nativeElement.min = `${min}`;
    this._elementRef.nativeElement.max = `${max}`;

    // We can now set the property value because the min and max have now been set.
    this._elementRef.nativeElement.value = `${this.value}`;

    // Setup for the MDC foundation.
    if (this._slider.disabled) {
      this._elementRef.nativeElement.disabled = true;
    }
  }

  /** Returns true if this slider input currently has focus. */
  _isFocused(): boolean {
    return this._document.activeElement === this._elementRef.nativeElement;
  }

  static ngAcceptInputType_value: NumberInput;
}

/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
@Component({
  selector: 'mat-slider',
  templateUrl: 'slider.html',
  styleUrls: ['slider.css'],
  host: {
    'class': 'mat-mdc-slider mdc-slider',
    '[class.mdc-slider--range]': '_isRange()',
    '[class.mdc-slider--disabled]': 'disabled',
    '[class.mdc-slider--discrete]': 'discrete',
    '[class.mdc-slider--tick-marks]': 'showTickMarks',
  },
  exportAs: 'matSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MatSlider implements AfterViewInit, OnDestroy {
  /** The slider thumb(s). */
  @ViewChildren('thumb') _thumbs: QueryList<ElementRef<HTMLElement>>;

  /** The slider thumb knob(s) */
  @ViewChildren('knob') _knobs: QueryList<ElementRef<HTMLElement>>;

  /** The span containing the slider thumb value indicator text */
  @ViewChildren('valueIndicatorTextElement')
  _valueIndicatorTextElements: QueryList<ElementRef<HTMLElement>>;

  /** The active section of the slider track. */
  @ViewChild('trackActive') _trackActive: ElementRef<HTMLElement>;

  /** The sliders hidden range input(s). */
  @ContentChildren(MatSliderThumb, {descendants: false})
  _inputs: QueryList<MatSliderThumb>;

  /** Whether the slider is disabled. */
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(v: boolean) {
    this._disabled = coerceBooleanProperty(v);

    // If we want to disable the slider after the foundation has been initialized,
    // we need to inform the foundation by calling `setDisabled`. Also, we can't call
    // this before initializing the foundation because it will throw errors.
    if (this._initialized) {
      this._foundation.setDisabled(v);
    }
  }
  private _disabled: boolean = false;

  /** Whether the slider displays a numeric value label upon pressing the thumb. */
  @Input()
  get discrete(): boolean { return this._discrete; }
  set discrete(v: boolean) { this._discrete = coerceBooleanProperty(v); }
  private _discrete: boolean = false;

  /** Whether the slider displays tick marks along the slider track. */
  @Input()
  get showTickMarks(): boolean { return this._showTickMarks; }
  set showTickMarks(v: boolean) { this._showTickMarks = coerceBooleanProperty(v); }
  private _showTickMarks: boolean = false;

  /** The minimum value that the slider can have. */
  @Input()
  get min(): number { return this._min; }
  set min(v: number) { this._min = coerceNumberProperty(v, this._min); }
  private _min: number = 0;

  /** The maximum value that the slider can have. */
  @Input()
  get max(): number { return this._max; }
  set max(v: number) { this._max = coerceNumberProperty(v, this._max); }
  private _max: number = 100;

  /** The values at which the thumb will snap. */
  @Input()
  get step(): number { return this._step; }
  set step(v: number) { this._step = coerceNumberProperty(v, this._step); }
  private _step: number = 1;

  /**
   * Function that will be used to format the value before it is displayed
   * in the thumb label. Can be used to format very large number in order
   * for them to fit into the slider thumb.
   */
  @Input() displayWith: ((value: number) => string) | null;

  /** Instance of the MDC slider foundation for this slider. */
  private _foundation = new MDCSliderFoundation(new SliderAdapter(this));

  /** Whether the foundation has been initialized. */
  _initialized: boolean = false;

  /** The injected document if available or fallback to the global document reference. */
  _document: Document;

  /**
   * The defaultView of the injected document if
   * available or fallback to global window reference.
   */
  _window: Window;

  /** Used to keep track of & render the active & inactive tick marks on the slider track. */
  _tickMarks: TickMark[];

  constructor(
    readonly _cdr: ChangeDetectorRef,
    readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _platform: Platform,
    @Inject(DOCUMENT) document: any) {
      this._document = document;
      this._window = this._document.defaultView || window;
    }

  ngAfterViewInit() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      _validateInputs(
        this._isRange(),
        this._getInputElement(Thumb.START),
        this._getInputElement(Thumb.END),
      );
    }
    if (this._platform.isBrowser) {
      this._foundation.init();
      this._foundation.layout();
      this._initialized = true;
    }
    // The MDC foundation requires access to the view and content children of the MatSlider. In
    // order to access the view and content children of MatSlider we need to wait until change
    // detection runs and materializes them. That is why we call init() and layout() in
    // ngAfterViewInit().
    //
    // The MDC foundation then uses the information it gathers from the DOM to compute an initial
    // value for the tickMarks array. It then tries to update the component data, but because it is
    // updating the component data AFTER change detection already ran, we will get a changed after
    // checked error. Because of this, we need to force change detection to update the UI with the
    // new state.
    this._cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this._platform.isBrowser) {
      this._foundation.destroy();
    }
  }

  /** Sets the value of a slider thumb. */
  _setValue(value: number, thumb: Thumb): void {
    thumb === Thumb.START
      ? this._foundation.setValueStart(value)
      : this._foundation.setValue(value);
  }

  /** Whether this is a ranged slider. */
  _isRange(): boolean {
    return this._inputs.length === 2;
  }

  /** Gets the slider thumb input of the given thumb. */
  _getInput(thumb: Thumb): MatSliderThumb {
    return thumb === Thumb.END ? this._inputs.last! : this._inputs.first!;
  }

  /** Gets the slider thumb HTML input element of the given thumb. */
  _getInputElement(thumb: Thumb): HTMLInputElement {
    return this._getInput(thumb)._elementRef.nativeElement;
  }

  /** Gets the slider thumb HTML element of the given thumb. */
  _getThumbElement(thumb: Thumb): HTMLElement {
    const thumbElementRef = thumb === Thumb.END ? this._thumbs.last : this._thumbs.first;
    return thumbElementRef.nativeElement;
  }

  /** Gets the slider knob HTML element of the given thumb. */
  _getKnobElement(thumb: Thumb): HTMLElement {
    const knobElementRef = thumb === Thumb.END ? this._knobs.last : this._knobs.first;
    return knobElementRef.nativeElement;
  }

  /**
   * Sets the value indicator text of the given thumb using the given value.
   *
   * Uses the `displayWith` function if one has been provided. Otherwise, it just uses the
   * numeric value as a string.
   */
  _setValueIndicatorText(value: number, thumb: Thumb): void {
    const valueIndicatorTextElementRef = thumb === Thumb.END
        ? this._valueIndicatorTextElements.last
        : this._valueIndicatorTextElements.first;
    const valueText = this.displayWith ? this.displayWith(value) : `${value}`;
    valueIndicatorTextElementRef.nativeElement.textContent = valueText;
  }

  /** Determines the class name for a HTML element. */
  _getTickMarkClass(tickMark: TickMark): string {
    return tickMark === TickMark.ACTIVE
      ? 'mdc-slider__tick-mark--active'
      : 'mdc-slider__tick-mark--inactive';
  }

  /** Returns an array of the thumb types that exist on the current slider instance. */
  _getThumbTypes(): Thumb[] {
    return this._isRange() ? [Thumb.START, Thumb.END] : [Thumb.END];
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_discrete: BooleanInput;
  static ngAcceptInputType_showTickMarks: BooleanInput;
  static ngAcceptInputType_min: NumberInput;
  static ngAcceptInputType_max: NumberInput;
  static ngAcceptInputType_step: NumberInput;
}

/** The MDCSliderAdapter implementation. */
class SliderAdapter implements MDCSliderAdapter {
  constructor(private readonly _delegate: MatSlider) {}

  // We manually assign functions instead of using prototype methods because
  // MDC clobbers the values otherwise.
  // See https://github.com/material-components/material-components-web/pull/6256

  hasClass = (className: string): boolean => {
    return this._delegate._elementRef.nativeElement.classList.contains(className);
  }
  addClass = (className: string): void => {
    this._delegate._elementRef.nativeElement.classList.add(className);
  }
  removeClass = (className: string): void => {
    this._delegate._elementRef.nativeElement.classList.remove(className);
  }
  getAttribute = (attribute: string): string | null => {
    return this._delegate._elementRef.nativeElement.getAttribute(attribute);
  }
  addThumbClass = (className: string, thumb: Thumb): void => {
    this._delegate._getThumbElement(thumb).classList.add(className);
  }
  removeThumbClass = (className: string, thumb: Thumb): void => {
    this._delegate._getThumbElement(thumb).classList.remove(className);
  }
  getInputValue = (thumb: Thumb): string => {
    return this._delegate._getInputElement(thumb).value;
  }
  setInputValue = (value: string, thumb: Thumb): void => {
    this._delegate._getInputElement(thumb).value = value;
  }
  getInputAttribute = (attribute: string, thumb: Thumb): string | null => {
    return this._delegate._getInputElement(thumb).getAttribute(attribute);
  }
  setInputAttribute = (attribute: string, value: string, thumb: Thumb): void => {
    this._delegate._getInputElement(thumb).setAttribute(attribute, value);
  }
  removeInputAttribute = (attribute: string, thumb: Thumb): void => {
    this._delegate._getInputElement(thumb).removeAttribute(attribute);
  }
  focusInput = (thumb: Thumb): void => {
    this._delegate._getInputElement(thumb).focus();
  }
  isInputFocused = (thumb: Thumb): boolean => {
    return this._delegate._getInput(thumb)._isFocused();
  }
  getThumbKnobWidth = (thumb: Thumb): number => {
    // TODO(wagnermaciel): Check if this causes issues for SSR
    // once the mdc-slider is added back to the kitchen sink SSR app.
    return this._delegate._getKnobElement(thumb).getBoundingClientRect().width;
  }
  getThumbBoundingClientRect = (thumb: Thumb): ClientRect => {
    return this._delegate._getThumbElement(thumb).getBoundingClientRect();
  }
  getBoundingClientRect = (): ClientRect => {
    return this._delegate._elementRef.nativeElement.getBoundingClientRect();
  }
  isRTL = (): boolean => {
    // TODO(wagnermaciel): Actually implementing this.
    return false;
  }
  setThumbStyleProperty = (propertyName: string, value: string, thumb: Thumb): void => {
    this._delegate._getThumbElement(thumb).style.setProperty(propertyName, value);
  }
  removeThumbStyleProperty = (propertyName: string, thumb: Thumb): void => {
    this._delegate._getThumbElement(thumb).style.removeProperty(propertyName);
  }
  setTrackActiveStyleProperty = (propertyName: string, value: string): void => {
    this._delegate._trackActive.nativeElement.style.setProperty(propertyName, value);
  }
  removeTrackActiveStyleProperty = (propertyName: string): void => {
    this._delegate._trackActive.nativeElement.style.removeProperty(propertyName);
  }
  setValueIndicatorText = (value: number, thumb: Thumb): void => {
    this._delegate._setValueIndicatorText(value, thumb);
  }
  getValueToAriaValueTextFn = (): ((value: number) => string) | null => {
    return this._delegate.displayWith;
  }
  updateTickMarks = (tickMarks: TickMark[]): void => {
    this._delegate._tickMarks = tickMarks;
    this._delegate._cdr.markForCheck();
  }
  setPointerCapture = (pointerId: number): void => {
    this._delegate._elementRef.nativeElement.setPointerCapture(pointerId);
  }
  // We ignore emitChangeEvent and emitInputEvent because the slider inputs
  // are already exposed so users can just listen for those events directly themselves.
  emitChangeEvent = (value: number, thumb: Thumb): void => {};
  emitInputEvent = (value: number, thumb: Thumb): void => {};
  emitDragStartEvent = (value: number, thumb: Thumb): void => {
    const input = this._delegate._getInput(thumb);
    input.dragStart.emit({ source: input, parent: this._delegate, value });
  }
  emitDragEndEvent = (value: number, thumb: Thumb): void => {
    const input = this._delegate._getInput(thumb);
    input.dragEnd.emit({ source: input, parent: this._delegate, value });
  }
  registerEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._elementRef.nativeElement.addEventListener(evtType, handler);
  }
  deregisterEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._elementRef.nativeElement.removeEventListener(evtType, handler);
  }
  registerThumbEventHandler =
    <K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._getThumbElement(thumb).addEventListener(evtType, handler);
  }
  deregisterThumbEventHandler =
    <K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._getThumbElement(thumb).removeEventListener(evtType, handler);
  }
  registerInputEventHandler =
    <K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._getInputElement(thumb).addEventListener(evtType, handler);
  }
  deregisterInputEventHandler =
    <K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._getInputElement(thumb).removeEventListener(evtType, handler);
  }
  registerBodyEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._document.body.addEventListener(evtType, handler);
  }
  deregisterBodyEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._document.body.removeEventListener(evtType, handler);
  }
  registerWindowEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._window.addEventListener(evtType, handler);
  }
  deregisterWindowEventHandler =
    <K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void => {
      this._delegate._window.removeEventListener(evtType, handler);
  }
}

/**
 * Ensures that there is not an invalid configuration for the slider thumb inputs.
 */
function _validateInputs(
  isRange: boolean,
  startInputElement: HTMLInputElement,
  endInputElement: HTMLInputElement): void {
  if (isRange) {
    if (!startInputElement!.hasAttribute('matSliderStartThumb')) {
      _throwInvalidInputConfigurationError();
    }
    if (!endInputElement.hasAttribute('matSliderEndThumb')) {
      _throwInvalidInputConfigurationError();
    }
  } else {
    if (!endInputElement.hasAttribute('matSliderThumb')) {
      _throwInvalidInputConfigurationError();
    }
  }
}

function _throwInvalidInputConfigurationError(): void {
  throw Error(`Invalid slider thumb input configuration!

  Valid configurations are as follows:

    <mat-slider>
      <input matSliderThumb>
    </mat-slider>

    or

    <mat-slider>
      <input matSliderStartThumb>
      <input matSliderEndThumb>
    </mat-slider>
  `);
}
