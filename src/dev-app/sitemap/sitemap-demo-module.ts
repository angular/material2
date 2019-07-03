/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatSitemapModule} from '@angular/material/sitemap';
import {SitemapDemo} from './sitemap-demo';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSitemapModule,
    RouterModule.forChild([{path: '', component: SitemapDemo}]),
  ],
  declarations: [SitemapDemo],
})
export class SitemapDemoModule {
}
