/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {$, browser} from 'protractor';
import {runBenchmark} from '@angular/dev-infra-private/benchmark/driver-utilities';

describe('chip performance benchmarks', () => {
  beforeAll(() => {
    browser.rootEl = '#root';
  });

  it('renders a single chip', async() => {
    await runBenchmark({
      id: 'single-chip-render',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async () => await $('#show-single').click(),
      prepare: async () => await $('#hide-single').click(),
      work: async () => await $('#show-single').click(),
    });
  });

  it('renders multiple chips', async() => {
    await runBenchmark({
      id: 'multiple-chip-render',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async () => await $('#show-multiple').click(),
      prepare: async () => await $('#hide-multiple').click(),
      work: async () => await $('#show-multiple').click(),
    });
  });

  it('clicks a chip', async() => {
    await runBenchmark({
      id: 'chip-click',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async() => await $('#show-single').click(),
      work: async () => await $('.mat-chip').click(),
    });
  });
});
