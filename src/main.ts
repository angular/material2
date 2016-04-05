import {bootstrap} from 'angular2/platform/browser';
import {DemoApp} from './demo-app/demo-app';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {OVERLAY_CONTAINER_TOKEN} from './core/overlay/overlay';
import {provide} from 'angular2/core';
import {createOverlayContainer} from './core/overlay/overlay-container';

bootstrap(DemoApp, [
  ROUTER_PROVIDERS,
  provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}),
]);
