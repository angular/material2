import {Injectable} from '@angular/core';


/** Datepicker data that requires internationalization. */
@Injectable()
export class MdDatepickerIntl {
  /** A label for the calendar popup (used by screen readers). */
  calendarLabel = 'Calendar';

  /** A label for the button used to open the calendar popup (used by screen readers). */
  openCalendarLabel = 'Open calendar';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Previous month';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Next month';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Next year';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToYearViewLabel = 'Change to year view';

  /**
   * The format to use when displaying dates without time information. If unspecified the `date`
   * format supplied by {@link DateAdapter#getPredefinedFormats} will be used.
   */
  dateFormat: any;

  /**
   * The format to use when parsing dates without time information. If unspecified the
   * `parseDate` format supplied by {@link DateAdapter#getPredefinedFormats} will be used.
   */
  parseDateFormat: any;
}
