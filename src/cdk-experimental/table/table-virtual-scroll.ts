/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  Inject,
  Input,
  OnDestroy,
  SkipSelf,
} from '@angular/core';
import {
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
  ListRange
} from '@angular/cdk/collections';
import {
  _TABLE_COLLECTION_VIEWER,
  CdkTable,
  RenderRow,
  RowContext,
  STICKY_POSITIONING_LISTENER,
  StickyPositioningListener,
  StickyUpdate
} from '@angular/cdk/table';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  shareReplay,
  takeUntil
} from 'rxjs/operators';
import {
  CdkVirtualScrollRepeater,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

/**
 * An implementation of {@link StickyPositioningListener} that forwards sticky updates to another
 * listener.
 *
 * The {@link CdkTableVirtualScroll} directive cannot provide itself a
 * {@link StickyPositioningListener} because it introduces a circular dependency. The directive
 * instead provides this class and attaches itself as the receiving listener.
 *
 * @docs-private
 */
export class _PositioningListenerProxy implements StickyPositioningListener {
  private _listener?: StickyPositioningListener;

  setListener(listener: StickyPositioningListener) {
    this._listener = listener;
  }

  stickyColumnsUpdated(update: StickyUpdate): void {
    this._listener?.stickyColumnsUpdated(update);
  }

  stickyEndColumnsUpdated(update: StickyUpdate): void {
    this._listener?.stickyEndColumnsUpdated(update);
  }

  stickyFooterRowsUpdated(update: StickyUpdate): void {
    this._listener?.stickyFooterRowsUpdated(update);
  }

  stickyHeaderRowsUpdated(update: StickyUpdate): void {
    this._listener?.stickyHeaderRowsUpdated(update);
  }
}

/** @docs-private */
export const _TABLE_VIRTUAL_SCROLL_COLLECTION_VIEWER_FACTORY =
    () => new BehaviorSubject<ListRange>({start: 0, end: 0});


/**
 * A directive that enables virtual scroll for a {@link CdkTable}.
 */
@Directive({
  selector: 'cdk-table[virtualScroll], table[cdk-table][virtualScroll]',
  exportAs: 'cdkVirtualScroll',
  providers: [
    {provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy},
    // The directive cannot provide itself as the sticky positions listener because it introduces
    // a circular dependency. Use an intermediate listener as a proxy.
    {provide: STICKY_POSITIONING_LISTENER, useClass: _PositioningListenerProxy},
    // Initially emit an empty range. The virtual scroll viewport will update the range after it is
    // initialized.
    {
      provide: _TABLE_COLLECTION_VIEWER,
      useFactory: _TABLE_VIRTUAL_SCROLL_COLLECTION_VIEWER_FACTORY,
    },
  ],
  host: {
    'class': 'cdk-table-virtual-scroll',
  },
})
export class CdkTableVirtualScroll<T>
    implements CdkVirtualScrollRepeater<T>, OnDestroy, StickyPositioningListener {
  /** Emits when the component is destroyed. */
  private _destroyed = new ReplaySubject<void>(1);

  /** Emits when the header rows sticky state changes. */
  private readonly _headerRowStickyUpdates = new Subject<StickyUpdate>();

  /** Emits when the footer rows sticky state changes. */
  private readonly _footerRowStickyUpdates = new Subject<StickyUpdate>();

  /**
   * Observable that emits the data source's complete data set. This exists to implement
   * {@link CdkVirtualScrollRepeater}.
   */
  get dataStream(): Observable<readonly T[]> {
    return this._dataStream;
  }
  private _dataStream = this._table._dataStream.pipe(shareReplay(1));

  /**
   * The size of the cache used to store unused views. Setting the cache size to `0` will disable
   * caching.
   */
  @Input()
  get viewCacheSize(): number {
    return this._viewRepeater.viewCacheSize;
  }
  set viewCacheSize(size: number) {
    this._viewRepeater.viewCacheSize = size;
  }

  constructor(
      private readonly _table: CdkTable<T>,
      @Inject(_TABLE_COLLECTION_VIEWER) private readonly _viewChange: BehaviorSubject<ListRange>,
      @Inject(STICKY_POSITIONING_LISTENER) positioningListener: _PositioningListenerProxy,
      @Inject(_VIEW_REPEATER_STRATEGY)
      private readonly _viewRepeater: _RecycleViewRepeaterStrategy<T, RenderRow<T>, RowContext<T>>,
      @SkipSelf() private readonly _viewport: CdkVirtualScrollViewport) {
    positioningListener.setListener(this);

    // Force the table to enable `fixedLayout` to prevent column widths from changing as the user
    // scrolls. This also enables caching in the table's sticky styler which reduces calls to
    // expensive DOM APIs, such as `getBoundingClientRect()`, and improves overall performance.
    if (!this._table.fixedLayout && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('[virtualScroll] expects input `fixedLayout` to be set on the table.');
    }

    // Update sticky styles for header rows when either the render range or sticky state change.
    combineLatest([this._viewport._renderedContentOffsetRendered, this._headerRowStickyUpdates])
      .pipe(takeUntil(this._destroyed))
      .subscribe(([offset, update]) => {
        this._stickHeaderRows(offset, update);
      });

    // Update sticky styles for footer rows when either the render range or sticky state change.
    combineLatest([this._viewport._renderedContentOffsetRendered, this._footerRowStickyUpdates])
      .pipe(takeUntil(this._destroyed))
      .subscribe(([offset, update]) => {
        this._stickFooterRows(offset, update);
      });

    // Forward the rendered range computed by the virtual scroll viewport to the table.
    this._viewport.renderedRangeStream.pipe(takeUntil(this._destroyed)).subscribe(this._viewChange);
    this._viewport.attach(this);
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Measures the combined size (width for horizontal orientation, height for vertical) of all items
   * in the specified range.
   */
  measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number {
    // TODO(michaeljamesparsons) Implement method so virtual tables can use the `autosize` virtual
    //  scroll strategy.
    console.warn('autoSize is not supported for tables with virtual scroll enabled.');
    return 0;
  }

  stickyColumnsUpdated(update: StickyUpdate): void {
    // no-op
  }

  stickyEndColumnsUpdated(update: StickyUpdate): void {
    // no-op
  }

  stickyHeaderRowsUpdated(update: StickyUpdate): void {
    this._headerRowStickyUpdates.next(update);
  }

  stickyFooterRowsUpdated(update: StickyUpdate): void {
    this._footerRowStickyUpdates.next(update);
  }

  private _stickHeaderRows(offsetFromTop: number, update: StickyUpdate) {
    if (!update.sizes || !update.offsets || !update.elements) {
      return;
    }

    for (let i = 0; i < update.elements.length; i++) {
      if (!update.elements[i]) {
        continue;
      }
      const offset = offsetFromTop !== 0
          ? Math.max(offsetFromTop - update.offsets[i]!, update.offsets[i]!)
          : -update.offsets[i]!;
      this._stickCells(update.elements[i]!, 'top', -offset);
    }
  }

  private _stickFooterRows(offsetFromTop: number, update: StickyUpdate) {
    if (!update.sizes || !update.offsets || !update.elements) {
      return;
    }

    for (let i = 0; i < update.elements.length; i++) {
      if (!update.elements[i]) {
        continue;
      }
      this._stickCells(update.elements[i]!, 'bottom', offsetFromTop + update.offsets[i]!);
    }
  }

  private _stickCells(cells: HTMLElement[], position: 'bottom'|'top', offset: number) {
    for (const cell of cells) {
      cell.style[position] = `${offset}px`;
    }
  }
}
