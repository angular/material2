/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {runBenchmark} from '@angular/dev-infra-private/benchmark/driver-utilities';

import {HarnessLoader} from '@angular/cdk/testing';
import {ProtractorHarnessEnvironment} from '@angular/cdk/testing/protractor';
import {MatMenuHarness} from '@angular/material/menu/testing/menu-harness';

let loader: HarnessLoader;

describe('menu performance benchmarks', () => {
  beforeEach(() => {
    loader = ProtractorHarnessEnvironment.loader();
  });

  it('opens a menu with 10 items', async () => {
    let menu: MatMenuHarness;
    await runBenchmark({
      id: 'menu-open',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async () => {
        menu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'Basic Menu' }));
      },
      prepare: async () => await menu.close(),
      work: async () => await menu.open(),
    });
  });

  it('opens a nested menu', async () => {
    let menu: MatMenuHarness;
    await runBenchmark({
      id: 'nested-menu-open',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async () => {
        menu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'Nested Menu' }));
      },
      prepare: async () => await menu.close(),
      work: async () => await menu.open(),
    });
  });

  // NOTE: This test seems very slow at the moment. This IS NOT because opening nested menus is
  // slow. This IS because calls to the loader are expensive.

  it('fully opens a nested menu', async () => {
    let menu: MatMenuHarness;
    await runBenchmark({
      id: 'nested-menu-open',
      url: '',
      ignoreBrowserSynchronization: true,
      params: [],
      setup: async () => {
        menu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'Nested Menu' }));
      },
      prepare: async () => await menu.close(),
      work: async () => {
        await menu.open();
        await (await loader.getHarness(MatMenuHarness.with({ triggerText: 'Sub Menu 1' }))).open();
        await (await loader.getHarness(MatMenuHarness.with({ triggerText: 'Sub Menu 2' }))).open();
      },
    });
  });
});
