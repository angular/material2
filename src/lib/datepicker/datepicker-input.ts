import {
  AfterContentInit,
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Renderer
} from '@angular/core';
import {MdDatepicker} from './datepicker';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SimpleDate} from '../core/datetime/simple-date';
import {CalendarLocale} from '../core/datetime/calendar-locale';
import {Subscription} from 'rxjs/Subscription';
import {MdInputContainer} from '../input/input-container';
import {DOWN_ARROW} from '../core/keyboard/keycodes';


export const MD_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdDatepickerInput),
  multi: true
};


/** Directive used to connect an input to a MdDatepicker. */
@Directive({
  selector: 'input[mdDatepicker], input[matDatepicker]',
  providers: [MD_DATEPICKER_VALUE_ACCESSOR],
  host: {
    '[attr.aria-expanded]': '_datepicker?.opened || "false"',
    '[attr.aria-haspopup]': 'true',
    '[attr.aria-owns]': '_datepicker?.id',
    '[min]': '_min?.toNativeDate()',
    '[max]': '_max?.toNativeDate()',
    '(input)': '_onChange($event.target.value)',
    '(blur)': '_onTouched()',
    '(keydown)': '_onKeydown($event)',
  }
})
export class MdDatepickerInput implements AfterContentInit, ControlValueAccessor, OnDestroy {
  /** The datepicker that this input is associated with. */
  @Input()
  set mdDatepicker(value: MdDatepicker) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }
  _datepicker: MdDatepicker;

  @Input()
  set matDatepicker(value: MdDatepicker) { this.mdDatepicker = value; }

  /** The value of the input. */
  @Input()
  get value(): SimpleDate {
    return this._value;
  }
  set value(value: SimpleDate) {
    this._value = this._locale.parseDate(value);
    const stringValue = this._value == null ? '' : this._locale.formatDate(this._value);
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', stringValue);
  }
  private _value: SimpleDate;

  /** The minimum valid date. */
  @Input()
  get min(): SimpleDate { return this._min; }
  set min(value: SimpleDate) { this._min = this._locale.parseDate(value); }
  private _min: SimpleDate;

  /** The maximum valid date. */
  @Input()
  get max(): SimpleDate { return this._max; }
  set max(value: SimpleDate) { this._max = this._locale.parseDate(value); }
  private _max: SimpleDate;

  _onChange = (value: any) => {};

  _onTouched = () => {};

  private _datepickerSubscription: Subscription;

  constructor(
      private _elementRef: ElementRef,
      private _renderer: Renderer,
      private _locale: CalendarLocale,
      @Optional() private _mdInputContainer: MdInputContainer) {}

  ngAfterContentInit() {
    if (this._datepicker) {
      this._datepickerSubscription =
          this._datepicker.selectedChanged.subscribe((selected: SimpleDate) => {
            this.value = selected;
            this._onChange(selected);
          });
    }
  }

  ngOnDestroy() {
    if (this._datepickerSubscription) {
      this._datepickerSubscription.unsubscribe();
    }
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getPopupConnectionElementRef(): ElementRef {
    return this._mdInputContainer ? this._mdInputContainer.underlineRef : this._elementRef;
  }

  // Implemented as part of ControlValueAccessor
  writeValue(value: SimpleDate): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = value => fn(this._locale.parseDate(value));
  }

  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled: boolean): void {
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', disabled);
  }

  _onKeydown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }
}
