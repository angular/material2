import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
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
import {createMissingDateImplError} from './datepicker-errors';
import {MD_DATE_FORMATS, MdDateFormats} from '../core/datetime/date-formats';


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
    return this._dateAdapter.parse(this._elementRef.nativeElement.value,
        this._dateFormats.parse.dateInput);
  }
  set value(value: D) {
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    let oldDate = this.value;
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value',
        date ? this._dateAdapter.format(date, this._dateFormats.display.dateInput) : '');
    if (!this._dateAdapter.sameDate(oldDate, date)) {
      this._valueChange.emit(date);
    }
  }

  /** The minimum valid date. */
  @Input() min: D;

  /** The maximum valid date. */
  @Input() max: D;

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D>();

  _onChange = (value: any) => {};

  _onTouched = () => {};

  private _datepickerSubscription: Subscription;

  constructor(
      private _elementRef: ElementRef,
      private _renderer: Renderer,
      @Optional() private _dateAdapter: DateAdapter<D>,
      @Optional() @Inject(MD_DATE_FORMATS) private _dateFormats: MdDateFormats,
      @Optional() private _mdInputContainer: MdInputContainer) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MD_DATE_FORMATS');
    }
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
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    this._onChange(date);
    this._valueChange.emit(date);
  }
}
