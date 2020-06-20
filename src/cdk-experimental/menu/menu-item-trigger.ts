/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewContainerRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  OverlayRef,
  Overlay,
  OverlayConfig,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import {CdkMenuPanel} from './menu-panel';
import {Menu, CDK_MENU} from './menu-interface';

/**
 * A directive to be combined with CdkMenuItem which opens the Menu it is bound to. If the
 * element is in a top level MenuBar it will open the menu on click, or if a sibling is already
 * opened it will open on hover. If it is inside of a Menu it will open the attached Submenu on
 * hover regardless of its sibling state.
 *
 * The directive must be placed along with the `cdkMenuItem` directive in order to enable full
 * functionality.
 */
@Directive({
  selector: '[cdkMenuItem][cdkMenuTriggerFor]',
  exportAs: 'cdkMenuTriggerFor',
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isSubmenuOpen() || null',
  },
})
export class CdkMenuItemTrigger implements OnDestroy {
  /** Template reference variable to the menu this trigger opens */
  @Input('cdkMenuTriggerFor') _menuPanel?: CdkMenuPanel;

  /** Emits when the attached submenu is requested to open */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter();

  /** Emits when the attached submenu is requested to close  */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter();

  /** A reference to the overlay which manages the triggered submenu */
  private _overlayReference: OverlayRef | null = null;

  /** The Portal in which the Menu is displayed inside of */
  private _portal: TemplatePortal;

  constructor(
    private readonly _elementReference: ElementRef<HTMLElement>,
    protected readonly _viewContainerReference: ViewContainerRef,
    private readonly _overlay: Overlay,
    private readonly _directionality: Directionality,
    @Inject(CDK_MENU) private readonly _parentMenu: Menu
  ) {}

  /** Open/close the attached submenu if the trigger has been configured with one */
  toggle() {
    if (this.hasSubmenu()) {
      this.isSubmenuOpen() ? this._closeSubmenu() : this._openSubmenu();
    }
  }

  /** Return true if the trigger has an attached menu */
  hasSubmenu() {
    return !!this._menuPanel;
  }

  /** Whether the submenu this button is a trigger for is open */
  isSubmenuOpen() {
    return this._overlayReference ? this._overlayReference.hasAttached() : false;
  }

  /** Open the attached submenu */
  private _openSubmenu() {
    this.opened.next();

    this._overlayReference = this._overlay.create(this._getOverlayConfig());
    this._overlayReference.attach(this._getPortal());
  }

  /** Close the opened submenu */
  private _closeSubmenu() {
    if (this.isSubmenuOpen()) {
      this.closed.next();

      this._overlayReference!.detach();
    }
  }

  /** Return the configuration object used to create the overlay */
  private _getOverlayConfig() {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      direction: this._directionality,
    });
  }

  /** Build the position strategy for the overlay which specifies where to place the submenu */
  private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._elementReference)
      .withPositions(this._getOverlayPositions());
  }

  /** Determine and return where to position the submenu relative to the menu item */
  private _getOverlayPositions(): ConnectedPosition[] {
    return this._parentMenu.orientation === 'horizontal'
      ? [
          {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
          {originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom'},
          {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
          {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'},
        ]
      : [
          {originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top'},
          {originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom'},
          {originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top'},
          {originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom'},
        ];
  }

  /** Return the portal to be attached to the overlay which contains the menu */
  private _getPortal() {
    if (!this._portal || this._portal.templateRef !== this._menuPanel?._templateReference) {
      this._portal = new TemplatePortal(
        this._menuPanel!._templateReference,
        this._viewContainerReference
      );
    }
    return this._portal;
  }

  ngOnDestroy() {
    this._destroyOverlayReference();
  }

  /** Destroy and unset the overlay reference it if exists */
  private _destroyOverlayReference() {
    if (this._overlayReference) {
      this._overlayReference.dispose();
      this._overlayReference = null;
    }
  }
}
