/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';

/** Demo Component for @angular/google-maps/map */
@Component({
  moduleId: module.id,
  selector: 'google-map-demo',
  templateUrl: 'google-map-demo.html',
})
export class GoogleMapDemo {
  ready = false;

  constructor(httpClient: HttpClient) {
    httpClient.jsonp('https://maps.googleapis.com/maps/api/js?', 'callback')
      .pipe(take(1))
      .subscribe(() => {
        this.ready = true;
      });
  }
}
