/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Directions that can be used when setting sticky positioning.
 * @docs-private
 */
import {Direction} from '@angular/cdk/bidi';
import {_CoalescedStyleScheduler} from './coalesced-style-scheduler';

export type StickyDirection = 'top' | 'bottom' | 'left' | 'right';

/**
 * List of all possible directions that can be used for sticky positioning.
 * @docs-private
 */
export const STICKY_DIRECTIONS: StickyDirection[] = ['top', 'bottom', 'left', 'right'];


/**
 * Applies and removes sticky positioning styles to the `CdkTable` rows and columns cells.
 * @docs-private
 */
export class StickyStyler {
  /**
   * @param _isNativeHtmlTable Whether the sticky logic should be based on a table
   *     that uses the native `<table>` element.
   * @param _stickCellCss The CSS class that will be applied to every row/cell that has
   *     sticky positioning applied.
   * @param direction The directionality context of the table (ltr/rtl); affects column positioning
   *     by reversing left/right positions.
   * @param _isBrowser Whether the table is currently being rendered on the server or the client.
   */
  constructor(private _isNativeHtmlTable: boolean,
              private _stickCellCss: string,
              public direction: Direction,
              private _coalescedStyleScheduler: _CoalescedStyleScheduler,
              private _isBrowser = true,
              private readonly _needsPositionStickyOnElement = true) { }

  /**
   * Clears the sticky positioning styles from the row and its cells by resetting the `position`
   * style, setting the zIndex to 0, and unsetting each provided sticky direction.
   * @param rows The list of rows that should be cleared from sticking in the provided directions
   * @param stickyDirections The directions that should no longer be set as sticky on the rows.
   */
  clearStickyPositioning(rows: HTMLElement[], stickyDirections: StickyDirection[]) {
    const elementsToClear: HTMLElement[] = [];
    for (const row of rows) {
      // If the row isn't an element (e.g. if it's an `ng-container`),
      // it won't have inline styles or `children` so we skip it.
      if (row.nodeType !== row.ELEMENT_NODE) {
        continue;
      }

      elementsToClear.push(row);
      for (let i = 0; i < row.children.length; i++) {
        elementsToClear.push(row.children[i] as HTMLElement);
      }
    }

    // Coalesce with sticky row/column updates (and potentially other changes like column resize).
    this._coalescedStyleScheduler.schedule(() => {
      for (const element of elementsToClear) {
        this._removeStickyStyle(element, stickyDirections);
      }
    });
  }

  /**
   * Applies sticky left and right positions to the cells of each row according to the sticky
   * states of the rendered column definitions.
   * @param rows The rows that should have its set of cells stuck according to the sticky states.
   * @param stickyStartStates A list of boolean states where each state represents whether the cell
   *     in this index position should be stuck to the start of the row.
   * @param stickyEndStates A list of boolean states where each state represents whether the cell
   *     in this index position should be stuck to the end of the row.
   */
  updateStickyColumns(
      rows: HTMLElement[], stickyStartStates: boolean[], stickyEndStates: boolean[]) {
    if (!rows.length || !this._isBrowser || !(stickyStartStates.some(state => state) ||
        stickyEndStates.some(state => state))) {
      return;
    }

    const firstRow = rows[0];
    const numCells = firstRow.children.length;
    const cellWidths: number[] = this._getCellWidths(firstRow);

    const startPositions = this._getStickyStartColumnPositions(cellWidths, stickyStartStates);
    const endPositions = this._getStickyEndColumnPositions(cellWidths, stickyEndStates);

    // Coalesce with sticky row updates (and potentially other changes like column resize).
    this._coalescedStyleScheduler.schedule(() => {
      const isRtl = this.direction === 'rtl';
      const start = isRtl ? 'right' : 'left';
      const end = isRtl ? 'left' : 'right';

      for (const row of rows) {
        for (let i = 0; i < numCells; i++) {
          const cell = row.children[i] as HTMLElement;
          if (stickyStartStates[i]) {
            this._addStickyStyle(cell, start, startPositions[i]);
          }

          if (stickyEndStates[i]) {
            this._addStickyStyle(cell, end, endPositions[i]);
          }
        }
      }
    });
  }

  /**
   * Applies sticky positioning to the row's cells if using the native table layout, and to the
   * row itself otherwise.
   * @param rowsToStick The list of rows that should be stuck according to their corresponding
   *     sticky state and to the provided top or bottom position.
   * @param stickyStates A list of boolean states where each state represents whether the row
   *     should be stuck in the particular top or bottom position.
   * @param position The position direction in which the row should be stuck if that row should be
   *     sticky.
   *
   */
  stickRows(rowsToStick: HTMLElement[], stickyStates: boolean[], position: 'top' | 'bottom') {
    // Since we can't measure the rows on the server, we can't stick the rows properly.
    if (!this._isBrowser) {
      return;
    }

    // If positioning the rows to the bottom, reverse their order when evaluating the sticky
    // position such that the last row stuck will be "bottom: 0px" and so on. Note that the
    // sticky states need to be reversed as well.
    const rows = position === 'bottom' ? rowsToStick.slice().reverse() : rowsToStick;
    const states = position === 'bottom' ? stickyStates.slice().reverse() : stickyStates;

    // Measure row heights all at once before adding sticky styles to reduce layout thrashing.
    const stickyHeights: number[] = [];
    const elementsToStick: HTMLElement[][] = [];
    for (let rowIndex = 0, stickyHeight = 0; rowIndex < rows.length; rowIndex++) {
      stickyHeights[rowIndex] = stickyHeight;

      if (!states[rowIndex]) {
        continue;
      }

      const row = rows[rowIndex];
      elementsToStick[rowIndex] = this._isNativeHtmlTable ?
          Array.from(row.children) as HTMLElement[] : [row];

      if (rowIndex !== rows.length - 1) {
        stickyHeight += row.getBoundingClientRect().height;
      }
    }

    // Coalesce with other sticky row updates (top/bottom), sticky columns updates
    // (and potentially other changes like column resize).
    this._coalescedStyleScheduler.schedule(() => {
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        if (!states[rowIndex]) {
          continue;
        }

        const height = stickyHeights[rowIndex];
        for (const element of elementsToStick[rowIndex]) {
          this._addStickyStyle(element, position, height);
        }
      }
    });
  }

  /**
   * When using the native table in Safari, sticky footer cells do not stick. The only way to stick
   * footer rows is to apply sticky styling to the tfoot container. This should only be done if
   * all footer rows are sticky. If not all footer rows are sticky, remove sticky positioning from
   * the tfoot element.
   */
  updateStickyFooterContainer(tableElement: Element, stickyStates: boolean[]) {
    if (!this._isNativeHtmlTable) {
      return;
    }

    const tfoot = tableElement.querySelector('tfoot')!;

    // Coalesce with other sticky updates (and potentially other changes like column resize).
    this._coalescedStyleScheduler.schedule(() => {
      if (stickyStates.some(state => !state)) {
        this._removeStickyStyle(tfoot, ['bottom']);
      } else {
        this._addStickyStyle(tfoot, 'bottom', 0);
      }
    });
  }

  /**
   * Removes the sticky style on the element by removing the sticky cell CSS class, re-evaluating
   * the zIndex, removing each of the provided sticky directions, and removing the
   * sticky position if there are no more directions.
   */
  _removeStickyStyle(element: HTMLElement, stickyDirections: StickyDirection[]) {
    for (const dir of stickyDirections) {
      element.style[dir] = '';
    }

    // If the element no longer has any more sticky directions, remove sticky positioning and
    // the sticky CSS class.
    const hasDirection = STICKY_DIRECTIONS.some(dir =>
        stickyDirections.indexOf(dir) === -1 && !!element.style[dir]);
    if (hasDirection) {
      element.style.zIndex = this._getCalculatedZIndex(element);
    } else {
      element.style.zIndex = '';
      if (this._needsPositionStickyOnElement) {
        element.style.position = '';
      }
      element.classList.remove(this._stickCellCss);
    }
  }

  /**
   * Adds the sticky styling to the element by adding the sticky style class, changing position
   * to be sticky (and -webkit-sticky), setting the appropriate zIndex, and adding a sticky
   * direction and value.
   */
  _addStickyStyle(element: HTMLElement, dir: StickyDirection, dirValue: number) {
    element.classList.add(this._stickCellCss);
    element.style[dir] = `${dirValue}px`;
    element.style.zIndex = this._getCalculatedZIndex(element);
    if (this._needsPositionStickyOnElement) {
      element.style.cssText += 'position: -webkit-sticky; position: sticky; ';
    }
  }

  /**
   * Calculate what the z-index should be for the element, depending on what directions (top,
   * bottom, left, right) have been set. It should be true that elements with a top direction
   * should have the highest index since these are elements like a table header. If any of those
   * elements are also sticky in another direction, then they should appear above other elements
   * that are only sticky top (e.g. a sticky column on a sticky header). Bottom-sticky elements
   * (e.g. footer rows) should then be next in the ordering such that they are below the header
   * but above any non-sticky elements. Finally, left/right sticky elements (e.g. sticky columns)
   * should minimally increment so that they are above non-sticky elements but below top and bottom
   * elements.
   */
  _getCalculatedZIndex(element: HTMLElement): string {
    const zIndexIncrements = {
      top: 100,
      bottom: 10,
      left: 1,
      right: 1,
    };

    let zIndex = 0;
    // Use `Iterable` instead of `Array` because TypeScript, as of 3.6.3,
    // loses the array generic type in the `for of`. But we *also* have to use `Array` because
    // typescript won't iterate over an `Iterable` unless you compile with `--downlevelIteration`
    for (const dir of STICKY_DIRECTIONS as Iterable<StickyDirection> & StickyDirection[]) {
      if (element.style[dir]) {
        zIndex += zIndexIncrements[dir];
      }
    }

    return zIndex ? `${zIndex}` : '';
  }

  /** Gets the widths for each cell in the provided row. */
  _getCellWidths(row: HTMLElement): number[] {
    const cellWidths: number[] = [];
    const firstRowCells = row.children;
    for (let i = 0; i < firstRowCells.length; i++) {
      let cell: HTMLElement = firstRowCells[i] as HTMLElement;
      cellWidths.push(cell.getBoundingClientRect().width);
    }

    return cellWidths;
  }

  /**
   * Determines the left and right positions of each sticky column cell, which will be the
   * accumulation of all sticky column cell widths to the left and right, respectively.
   * Non-sticky cells do not need to have a value set since their positions will not be applied.
   */
  _getStickyStartColumnPositions(widths: number[], stickyStates: boolean[]): number[] {
    const positions: number[] = [];
    let nextPosition = 0;

    for (let i = 0; i < widths.length; i++) {
      if (stickyStates[i]) {
        positions[i] = nextPosition;
        nextPosition += widths[i];
      }
    }

    return positions;
  }

  /**
   * Determines the left and right positions of each sticky column cell, which will be the
   * accumulation of all sticky column cell widths to the left and right, respectively.
   * Non-sticky cells do not need to have a value set since their positions will not be applied.
   */
  _getStickyEndColumnPositions(widths: number[], stickyStates: boolean[]): number[] {
    const positions: number[] = [];
    let nextPosition = 0;

    for (let i = widths.length; i > 0; i--) {
      if (stickyStates[i]) {
        positions[i] = nextPosition;
        nextPosition += widths[i];
      }
    }

    return positions;
  }
}
