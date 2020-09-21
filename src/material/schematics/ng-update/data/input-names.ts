/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InputNameUpgradeData, TargetVersion, VersionChanges} from '@angular/cdk/schematics';

export const inputNames: VersionChanges<InputNameUpgradeData> = {
  [TargetVersion.V6]: [
    {
      pr: 'https://github.com/angular/components/pull/10218',
      changes: [{
        replace: 'align',
        replaceWith: 'labelPosition',
        fileTypeFilter: {elements: ['mat-radio-group', 'mat-radio-button']}
      }]
    },

    {
      pr: 'https://github.com/angular/components/pull/10279',
      changes: [{
        replace: 'align',
        replaceWith: 'position',
        fileTypeFilter: {elements: ['mat-drawer', 'mat-sidenav']}
      }]
    },

    {
      pr: 'https://github.com/angular/components/pull/10294',
      changes: [
        {replace: 'dividerColor', replaceWith: 'color', fileTypeFilter: {elements: ['mat-form-field']}},
        {
          replace: 'floatPlaceholder',
          replaceWith: 'floatLabel',
          fileTypeFilter: {elements: ['mat-form-field']}
        }
      ]
    },

    {
      pr: 'https://github.com/angular/components/pull/10309',
      changes: [{
        replace: 'mat-dynamic-height',
        replaceWith: 'dynamicHeight',
        fileTypeFilter: {elements: ['mat-tab-group']}
      }]
    },

    {
      pr: 'https://github.com/angular/components/pull/10342',
      changes: [
        {replace: 'align', replaceWith: 'labelPosition', fileTypeFilter: {elements: ['mat-checkbox']}}
      ]
    },

    {
      pr: 'https://github.com/angular/components/pull/10344',
      changes: [{
        replace: 'tooltip-position',
        replaceWith: 'matTooltipPosition',
        fileTypeFilter: {attributes: ['matTooltip']}
      }]
    },

    {
      pr: 'https://github.com/angular/components/pull/10373',
      changes: [
        {replace: 'thumb-label', replaceWith: 'thumbLabel', fileTypeFilter: {elements: ['mat-slider']}},
        {
          replace: 'tick-interval',
          replaceWith: 'tickInterval',
          fileTypeFilter: {elements: ['mat-slider']}
        }
      ]
    }
  ]
};
