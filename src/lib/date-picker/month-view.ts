import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  AfterContentInit
} from '@angular/core';
import {coerceDateProperty} from '../core/coercion/date-property';
import {MdCalendarCell} from './calendar-table';
import {DateLocale} from './date-locale';


const DAYS_PER_WEEK = 7;


/**
 * An internal component used to display a single month in the date-picker.
 * @docs-private
 */
@Component({
  moduleId: module.id,
  selector: 'md-month-view',
  templateUrl: 'month-view.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdMonthView implements AfterContentInit {
  /**
   * The date to display in this month view (everything other than the month and year is ignored).
   */
  @Input()
  get date() { return this._date; }
  set date(value) {
    this._date = coerceDateProperty(value);
    this._init();
  }
  private _date = new Date();

  /** The currently selected date. */
  @Input()
  get selected() { return this._selected; }
  set selected(value) {
    this._selected = coerceDateProperty(value, null);
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
  }
  private _selected: Date;

  /** Emits when a new date is selected. */
  @Output() selectedChange = new EventEmitter<Date>();

  /** The label for this month (e.g. "January 2017"). */
  _monthLabel: string;

  /** Grid of calendar cells representing the dates of the month. */
  _weeks: MdCalendarCell[][];

  /** The number of blank cells in the first row before the 1st of the month. */
  _firstWeekOffset: number;

  /**
   * The date of the month that the currently selected Date falls on.
   * Null if the currently selected Date is in another month.
   */
  _selectedDate = 0;

  /** The date of the month that today falls on. Null if today is in another month. */
  _todayDate = 0;

  constructor(private _locale: DateLocale) {}

  ngAfterContentInit(): void {
    this._init();
  }

  /** Handles when a new date is selected. */
  _dateSelected(date: number) {
    if (this.selected && this.selected.getDate() == date) {
      return;
    }
    this.selectedChange.emit(new Date(this.date.getFullYear(), this.date.getMonth(), date));
  }

  /** Initializes this month view. */
  private _init() {
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
    this._todayDate = this._getDateInCurrentMonth(new Date());
    this._monthLabel = this._locale.getMonthLabel(this.date.getMonth(), this.date.getFullYear());

    let firstOfMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this._firstWeekOffset =
        (DAYS_PER_WEEK + firstOfMonth.getDay() - this._locale.firstDayOfWeek) % DAYS_PER_WEEK;

    this._createWeekCells();
  }

  /** Creates MdCalendarCells for the dates in this month. */
  private _createWeekCells() {
    let daysInMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    this._weeks = [[]];
    for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell == DAYS_PER_WEEK) {
        this._weeks.push([]);
        cell = 0;
      }
      this._weeks[this._weeks.length - 1].push(
          new MdCalendarCell(i + 1, this._locale.getDateLabel(i + 1)));
    }
  }

  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another year.
   */
  private _getDateInCurrentMonth(date: Date) {
    return date && date.getMonth() == this.date.getMonth() ? date.getDate() : null;
  }
}
