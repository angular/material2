import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Renderer
} from '@angular/core';
import {MdDatepicker} from './datepicker';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {MdInputContainer} from '../input/input-container';
import {DOWN_ARROW} from '../core/keyboard/keycodes';
import {DateAdapter} from '../core/datetime/index';
import {MdDatepickerIntl} from './datepicker-intl';


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
    '[min]': '_min',
    '[max]': '_max',
    '(input)': '_onInput($event.target.value)',
    '(blur)': '_onTouched()',
    '(keydown)': '_onKeydown($event)',
  }
})
export class MdDatepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy {
  /** The datepicker that this input is associated with. */
  @Input()
  set mdDatepicker(value: MdDatepicker<D>) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }
  _datepicker: MdDatepicker<D>;

  @Input()
  set matDatepicker(value: MdDatepicker<D>) { this.mdDatepicker = value; }

  /** The value of the input. */
  @Input()
  get value(): D {
    return this._dateAdapter.parse(this._elementRef.nativeElement.value, this._parseFormat);
  }
  set value(value: D) {
    let date = this._dateAdapter.parse(value, this._parseFormat);
    let oldDate = this.value;
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value',
        date ? this._dateAdapter.format(date, this._displayFormat) : '');
    if (!this._dateAdapter.sameDate(oldDate, date)) {
      this._valueChange.emit(date);
    }
  }

  /** The minimum valid date. */
  @Input()
  get min(): D { return this._min; }
  set min(value: D) { this._min = this._dateAdapter.parse(value, this._parseFormat); }
  private _min: D;

  /** The maximum valid date. */
  @Input()
  get max(): D { return this._max; }
  set max(value: D) { this._max = this._dateAdapter.parse(value, this._parseFormat); }
  private _max: D;

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D>();

  _onChange = (value: any) => {};

  _onTouched = () => {};

  private _datepickerSubscription: Subscription;

  /** The format to use when parsing dates. */
  private _parseFormat: any;

  /** The format to use when displaying dates. */
  private _displayFormat: any;

  constructor(
      private _elementRef: ElementRef,
      private _renderer: Renderer,
      private _dateAdapter: DateAdapter<D>,
      intl: MdDatepickerIntl,
      @Optional() private _mdInputContainer: MdInputContainer) {
    this._parseFormat = intl.parseDateFormat || this._dateAdapter.getPredefinedFormats().parseDate;
    this._displayFormat = intl.dateFormat || this._dateAdapter.getPredefinedFormats().date;
  }

  ngAfterContentInit() {
    if (this._datepicker) {
      this._datepickerSubscription =
          this._datepicker.selectedChanged.subscribe((selected: D) => {
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
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
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

  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this._parseFormat);
    this._onChange(date);
    this._valueChange.emit(date);
  }
}
