/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, Optional} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import moment from 'moment';


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}


/** Adapts Moment.js Dates for use with Angular Material. */
@Injectable()
export class MomentDateAdapter extends DateAdapter<moment.Moment> {
  // Note: all of the methods that accept a `moment.Moment` input parameter immediately call
  // `this.clone` on it. This is to ensure that we're working with a `moment.Moment` that has the
  // correct locale setting while avoiding mutating the original object passed to us.

  private _localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super();
    this.setLocale(dateLocale || moment.locale());
  }

  setLocale(locale: any) {
    super.setLocale(locale);

    // Temporarily change the global locale to get the data we need, then change it back.
    let globalLocale = moment.locale();
    moment.locale(locale);
    this._localeData = {
      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
      longMonths: moment.months(),
      shortMonths: moment.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: moment.weekdays(),
      shortDaysOfWeek: moment.weekdaysShort(),
      narrowDaysOfWeek: moment.weekdaysMin(),
    };
    moment.locale(globalLocale);
  }

  getYear(date: moment.Moment): number {
    return this.clone(date).year();
  }

  getMonth(date: moment.Moment): number {
    return this.clone(date).month();
  }

  getDate(date: moment.Moment): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: moment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Moment.js doesn't support narrow month names, so we just use short if narrow is requested.
    return style == 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style == 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style == 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: moment.Moment): string {
    return this.clone(date).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: moment.Moment): number {
    return this.clone(date).daysInMonth();
  }

  clone(date: moment.Moment): moment.Moment {
    return date.clone().locale(this.locale);
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    // Check for invalid month and date (except upper bound on date which we have to check after
    // creating the Date).
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result = moment({year, month, date}).locale(this.locale);

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): moment.Moment {
    return moment().locale(this.locale);
  }

  parse(value: any, parseFormat: string | string[]): moment.Moment | null {
    if (value && typeof value == 'string') {
      return moment(value, parseFormat, this.locale);
    }
    return value ? moment(value).locale(this.locale) : null;
  }

  format(date: moment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    return this.clone(date).add({years});
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    return this.clone(date).add({months});
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    return this.clone(date).add({days});
  }

  getISODateString(date: moment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: moment.Moment): boolean {
    return this.clone(date).isValid();
  }
}
