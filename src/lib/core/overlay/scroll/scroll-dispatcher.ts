import {Injectable, ElementRef, Optional, SkipSelf} from '@angular/core';
import {Scrollable} from './scrollable';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/auditTime';


/** Time in ms to throttle the scrolling events by default. */
export const DEFAULT_AUDIT_TIME = 20;

/**
 * Service contained all registered Scrollable references and emits an event when any one of the
 * Scrollable references emit a scrolled event.
 */
@Injectable()
export class ScrollDispatcher {
  events = 0;

  /** Subject for notifying that a registered scrollable reference element has been scrolled. */
  _scrolled: Subject<void> = new Subject<void>();

  /**
   * Map of all the scrollable references that are registered with the service and their
   * scroll event subscriptions.
   */
  scrollableReferences: Map<Scrollable, Subscription> = new Map();

  constructor() {
    // By default, notify a scroll event when the document is scrolled or the window is resized.
    Observable.fromEvent(window.document, 'scroll').subscribe(() => this._notify());
    Observable.fromEvent(window, 'resize').subscribe(() => this._notify());
  }

  /**
   * Registers a Scrollable with the service and listens for its scrolled events. When the
   * scrollable is scrolled, the service emits the event in its scrolled observable.
   *
   * @param scrollable Scrollable instance to be registered.
   */
  register(scrollable: Scrollable): void {
    const scrollSubscription = scrollable.elementScrolled().subscribe(() => this._notify());
    this.scrollableReferences.set(scrollable, scrollSubscription);
  }

  /**
   * Deregisters a Scrollable reference and unsubscribes from its scroll event observable.
   *
   * @param scrollable Scrollable instance to be deregistered.
   */
  deregister(scrollable: Scrollable): void {
    this.scrollableReferences.get(scrollable).unsubscribe();
    this.scrollableReferences.delete(scrollable);
  }

  /**
   * Returns an observable that emits an event whenever any of the registered Scrollable
   * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
   * to override the default throttling time.
   */
  scrolled(auditTimeInMs: number = DEFAULT_AUDIT_TIME): Observable<void> {
    return this._scrolled.asObservable().auditTime(auditTimeInMs);
  }

  /** Returns all registered Scrollables that contain the provided element. */
  getScrollContainers(elementRef: ElementRef): Scrollable[] {
    const scrollingContainers: Scrollable[] = [];

    this.scrollableReferences.forEach((subscription: Subscription, scrollable: Scrollable) => {
      if (this.scrollableContainsElement(scrollable, elementRef)) {
        scrollingContainers.push(scrollable);
      }
    });

    return scrollingContainers;
  }

  /** Returns true if the element is contained within the provided Scrollable. */
  scrollableContainsElement(scrollable: Scrollable, elementRef: ElementRef): boolean {
    let element = elementRef.nativeElement;
    let scrollableElement = scrollable.getElementRef().nativeElement;

    // Traverse through the element parents until we reach null, checking if any of the elements
    // are the scrollable's element.
    do {
      if (element == scrollableElement) { return true; }
    } while (element = element.parentElement);
  }

  /** Sends a notification that a scroll event has been fired. */
  _notify() {
    this.events++;
    this._scrolled.next();
  }
}

export function SCROLL_DISPATCHER_PROVIDER_FACTORY(parentDispatcher: ScrollDispatcher) {
  return parentDispatcher || new ScrollDispatcher();
}

export const SCROLL_DISPATCHER_PROVIDER = {
  // If there is already a ScrollDispatcher available, use that. Otherwise, provide a new one.
  provide: ScrollDispatcher,
  deps: [[new Optional(), new SkipSelf(), ScrollDispatcher]],
  useFactory: SCROLL_DISPATCHER_PROVIDER_FACTORY
};
