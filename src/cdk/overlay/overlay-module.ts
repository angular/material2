/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BidiModule} from '@angular/cdk/bidi';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule, VIEWPORT_RULER_PROVIDER} from '@angular/cdk/scrolling';
import {NgModule, Provider} from '@angular/core';
import {OVERLAY_KEYBOARD_DISPATCHER_PROVIDER} from './keyboard/overlay-keyboard-dispatcher';
import {Overlay} from './overlay';
import {OVERLAY_CONTAINER_PROVIDER} from './overlay-container';
import {
  CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER,
  CdkConnectedOverlay,
  CdkOverlayOrigin,
} from './overlay-directives';
import {OverlayPositionBuilder} from './position/overlay-position-builder';
import {CdkOverlayBackdrop} from './backdrop';


@NgModule({
  imports: [BidiModule, PortalModule, ScrollDispatchModule],
  exports: [CdkConnectedOverlay, CdkOverlayOrigin, CdkOverlayBackdrop, ScrollDispatchModule],
  declarations: [CdkConnectedOverlay, CdkOverlayOrigin, CdkOverlayBackdrop],
  providers: [Overlay],
  entryComponents: [CdkOverlayBackdrop],
})
export class OverlayModule {}


/**
 * @deprecated Use `OverlayModule` instead.
 * @deletion-target 7.0.0
 */
export const OVERLAY_PROVIDERS: Provider[] = [
  Overlay,
  OverlayPositionBuilder,
  OVERLAY_KEYBOARD_DISPATCHER_PROVIDER,
  VIEWPORT_RULER_PROVIDER,
  OVERLAY_CONTAINER_PROVIDER,
  CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER,
];
