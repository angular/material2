/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, Inject, InjectionToken, Optional, SkipSelf, OnDestroy} from '@angular/core';
import {OverlayRef} from '../overlay-ref';
import {DOCUMENT} from '@angular/common';

/**
 * Service for dispatching keyboard events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
@Injectable()
export class OverlayKeyboardDispatcher implements OnDestroy {

  /** Currently attached overlays in the order they were attached. */
  _attachedOverlays: OverlayRef[] = [];

  private _document: Document;
  private _isAttached: boolean;

  constructor(@Inject(DOCUMENT) document: any) {
    this._document = document;
  }

  ngOnDestroy() {
    this._detach();
  }

  /** Add a new overlay to the list of attached overlay refs. */
  add(overlayRef: OverlayRef): void {
    // Lazily start dispatcher once first overlay is added
    if (!this._isAttached) {
      this._document.body.addEventListener('keydown', this._keydownListener, true);
      this._isAttached = true;
    }

    this._attachedOverlays.push(overlayRef);
  }

  /** Remove an overlay from the list of attached overlay refs. */
  remove(overlayRef: OverlayRef): void {
    const index = this._attachedOverlays.indexOf(overlayRef);

    if (index > -1) {
      this._attachedOverlays.splice(index, 1);
    }

    // Remove the global listener once there are no more overlays.
    if (this._attachedOverlays.length === 0) {
      this._detach();
    }
  }

  /** Select the appropriate overlay from a keydown event. */
  private _selectOverlayFromEvent(event: KeyboardEvent): OverlayRef {
    // Check if any overlays contain the event
    const targetedOverlay = this._attachedOverlays.find(overlay => {
      return overlay.overlayElement === event.target ||
          overlay.overlayElement.contains(event.target as HTMLElement);
    });

    // Use the overlay if it exists, otherwise choose the most recently attached one
    return targetedOverlay || this._attachedOverlays[this._attachedOverlays.length - 1];
  }

  /** Detaches the global keyboard event listener. */
  private _detach() {
    if (this._isAttached) {
      this._document.body.removeEventListener('keydown', this._keydownListener, true);
      this._isAttached = false;
    }
  }

  /** Keyboard event listener that will be attached to the body. */
  private _keydownListener = (event: KeyboardEvent) => {
    if (this._attachedOverlays.length) {
      // Dispatch keydown event to the correct overlay.
      this._selectOverlayFromEvent(event)._keydownEvents.next(event);
    }
  }
}

/** @docs-private */
export function OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY(
    dispatcher: OverlayKeyboardDispatcher, _document: any) {
  return dispatcher || new OverlayKeyboardDispatcher(_document);
}

/** @docs-private */
export const OVERLAY_KEYBOARD_DISPATCHER_PROVIDER = {
  // If there is already an OverlayKeyboardDispatcher available, use that.
  // Otherwise, provide a new one.
  provide: OverlayKeyboardDispatcher,
  deps: [
    [new Optional(), new SkipSelf(), OverlayKeyboardDispatcher],

    // Coerce to `InjectionToken` so that the `deps` match the "shape"
    // of the type expected by Angular
    DOCUMENT as InjectionToken<any>
  ],
  useFactory: OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY
};
