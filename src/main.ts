import {bootstrap} from 'angular2/platform/browser';
import {DemoApp} from './demo-app/demo-app';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {MdIconProvider} from './components/icon/icon-provider';
import {BrowserDomAdapter} from './core/platform/browser/browser_adapter';
import {OVERLAY_CONTAINER_TOKEN} from './core/overlay/overlay';
import {provide} from 'angular2/core';
import {createOverlayContainer} from './core/overlay/overlay-container';
import {Renderer} from 'angular2/core';
import 'rxjs/Rx';

BrowserDomAdapter.makeCurrent();

bootstrap(DemoApp, [
  ROUTER_PROVIDERS,
  provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}),
  HTTP_PROVIDERS,
  MdIconProvider,
  Renderer,
]);
