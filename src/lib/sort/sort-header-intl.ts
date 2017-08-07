/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, EventEmitter} from '@angular/core';
import {SortDirection} from './sort-direction';

/**
 * To modify the labels and text displayed, create a new instance of MdSortHeaderIntl and
 * include it in a custom provider.
 */
@Injectable()
export class MdSortHeaderIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  changes: EventEmitter<void> = new EventEmitter<void>();

  /** ARIA label for the sorting button. */
  sortButtonLabel = (id: string) => {
    return `Change sorting for ${id}`;
  }

  /** A label to describe the current sort (visible only to screenreaders). */
  sortDescriptionLabel = (id: string, direction: SortDirection) => {
    return `Sorted by ${id} ${direction == 'asc' ? 'ascending' : 'descending'}`;
  }
}
