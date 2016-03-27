import {bootstrap} from 'angular2/platform/browser';
import {DemoApp} from './demo-app/demo-app';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {MdIconProvider} from './components/icon/icon-provider';
import {Renderer} from 'angular2/core';
import 'rxjs/Rx';

bootstrap(DemoApp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  MdIconProvider,
  Renderer,
]);
