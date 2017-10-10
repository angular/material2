/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Routes} from '@angular/router';
import {AutocompleteAccessibilityDemo} from './autocomplete/autocomplete-a11y';
import {ButtonAccessibilityDemo} from './button/button-a11y';
import {ButtonToggleAccessibilityDemo} from './button-toggle/button-toggle-a11y';
import {CardAccessibilityDemo} from './card/card-a11y';
import {CheckboxAccessibilityDemo} from './checkbox/checkbox-a11y';
import {ChipsAccessibilityDemo} from './chips/chips-a11y';
import {DialogAccessibilityDemo} from './dialog/dialog-a11y';
import {ExpansionPanelAccessibilityDemo} from './expansion/expansion-a11y';
import {GridListAccessibilityDemo} from './grid-list/grid-list-a11y';
import {RadioAccessibilityDemo} from './radio/radio-a11y';
import {AccessibilityHome} from './a11y';
import {ToolbarAccessibilityDemo} from './toolbar/toolbar-a11y';
import {DatepickerAccessibilityDemo} from './datepicker/datepicker-a11y';
import {IconAccessibilityDemo} from './icon/icon-a11y';
import {InputAccessibilityDemo} from './input/input-a11y';
import {MenuAccessibilityDemo} from './menu/menu-a11y';
import {ProgressBarAccessibilityDemo} from './progress-bar/progress-bar-a11y';
import {ProgressSpinnerAccessibilityDemo} from './progress-spinner/progress-spinner-a11y';
import {SliderAccessibilityDemo} from './slider/slider-a11y';
import {SlideToggleAccessibilityDemo} from './slide-toggle/slide-toggle-a11y';
import {SnackBarAccessibilityDemo} from './snack-bar/snack-bar-a11y';
import {SelectAccessibilityDemo} from './select/select-a11y';
import {TabsAccessibilityDemo} from './tabs/tabs-a11y';
import {TABS_DEMO_ROUTES} from './tabs/routes';
import {TooltipAccessibilityDemo} from './tooltip/tooltip-a11y';

export const ACCESSIBILITY_DEMO_ROUTES: Routes = [
  {path: '', component: AccessibilityHome},
  {path: 'autocomplete', component: AutocompleteAccessibilityDemo},
  {path: 'button', component: ButtonAccessibilityDemo},
  {path: 'button-toggle', component: ButtonToggleAccessibilityDemo},
  {path: 'card', component: CardAccessibilityDemo},
  {path: 'checkbox', component: CheckboxAccessibilityDemo},
  {path: 'chips', component: ChipsAccessibilityDemo},
  {path: 'datepicker', component: DatepickerAccessibilityDemo},
  {path: 'dialog', component: DialogAccessibilityDemo},
  {path: 'expansion', component: ExpansionPanelAccessibilityDemo},
  {path: 'grid-list', component: GridListAccessibilityDemo},
  {path: 'icon', component: IconAccessibilityDemo},
  {path: 'input', component: InputAccessibilityDemo},
  {path: 'menu', component: MenuAccessibilityDemo},
  {path: 'progress-bar', component: ProgressBarAccessibilityDemo},
  {path: 'progress-spinner', component: ProgressSpinnerAccessibilityDemo},
  {path: 'radio', component: RadioAccessibilityDemo},
  {path: 'slider', component: SliderAccessibilityDemo},
  {path: 'slide-toggle', component: SlideToggleAccessibilityDemo},
  {path: 'snack-bar', component: SnackBarAccessibilityDemo},
  {path: 'select', component: SelectAccessibilityDemo},
  {path: 'tabs', component: TabsAccessibilityDemo, children: TABS_DEMO_ROUTES},
  {path: 'toolbar', component: ToolbarAccessibilityDemo},
  {path: 'tooltip', component: TooltipAccessibilityDemo},
];
