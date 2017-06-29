import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AutocompleteOverviewExample} from './autocomplete-overview/autocomplete-overview-example';
import {ButtonOverviewExample} from './button-overview/button-overview-example';
import {ButtonTypesExample} from './button-types/button-types-example';
import {CheckboxOverviewExample} from './checkbox-overview/checkbox-overview-example';
import {SliderConfigurableExample} from './slider-configurable/slider-configurable-example';
import {TabsOverviewExample} from './tabs-overview/tabs-overview-example';
import {
  PizzaPartyComponent,
  SnackBarComponentExample
} from './snack-bar-component/snack-bar-component-example';
import {
  ProgressBarConfigurableExample
} from './progress-bar-configurable/progress-bar-configurable-example';
import {
  DialogOverviewExample,
  DialogOverviewExampleDialog
} from './dialog-overview/dialog-overview-example';
import {RadioNgModelExample} from './radio-ng-model/radio-ng-model-example';
import {CardFancyExample} from './card-fancy/card-fancy-example';
import {ToolbarOverviewExample} from './toolbar-overview/toolbar-overview-example';
import {ToolbarMultirowExample} from './toolbar-multirow/toolbar-multirow-example';
import {MenuIconsExample} from './menu-icons/menu-icons-example';
import {GridListDynamicExample} from './grid-list-dynamic/grid-list-dynamic-example';
import {IconOverviewExample} from './icon-overview/icon-overview-example';
import {ProgressBarOverviewExample} from './progress-bar-overview/progress-bar-overview-example';
import {SlideToggleOverviewExample} from './slide-toggle-overview/slide-toggle-overview-example';
import {SlideToggleFormsExample} from './slide-toggle-forms/slide-toggle-forms-example';
import {MenuOverviewExample} from './menu-overview/menu-overview-example';
import {CheckboxConfigurableExample} from './checkbox-configurable/checkbox-configurable-example';
import {
  ButtonToggleExclusiveExample
} from './button-toggle-exclusive/button-toggle-exclusive-example';
import {ListSectionsExample} from './list-sections/list-sections-example';
import {SnackBarOverviewExample} from './snack-bar-overview/snack-bar-overview-example';
import {
  DialogResultExample,
  DialogResultExampleDialog
} from './dialog-result/dialog-result-example';
import {
  DialogElementsExample,
  DialogElementsExampleDialog
} from './dialog-elements/dialog-elements-example';
import {TooltipOverviewExample} from './tooltip-overview/tooltip-overview-example';
import {ButtonToggleOverviewExample} from './button-toggle-overview/button-toggle-overview-example';
import {GridListOverviewExample} from './grid-list-overview/grid-list-overview-example';
import {TooltipPositionExample} from './tooltip-position/tooltip-position-example';
import {
  ProgressSpinnerConfigurableExample
} from './progress-spinner-configurable/progress-spinner-configurable-example';
import {ListOverviewExample} from './list-overview/list-overview-example';
import {SliderOverviewExample} from './slider-overview/slider-overview-example';
import {
  SlideToggleConfigurableExample
} from './slide-toggle-configurable/slide-toggle-configurable-example';
import {IconSvgExample} from './icon-svg-example/icon-svg-example';
import {SidenavFabExample} from './sidenav-fab/sidenav-fab-example';
import {CardOverviewExample} from './card-overview/card-overview-example';
import {
  ProgressSpinnerOverviewExample
} from './progress-spinner-overview/progress-spinner-overview-example';
import {TabsTemplateLabelExample} from './tabs-template-label/tabs-template-label-example';
import {RadioOverviewExample} from './radio-overview/radio-overview-example';
import {SidenavOverviewExample} from './sidenav-overview/sidenav-overview-example';
import {SelectOverviewExample} from './select-overview/select-overview-example';
import {ChipsOverviewExample} from './chips-overview/chips-overview-example';
import {ChipsStackedExample} from './chips-stacked/chips-stacked-example';
import {SelectFormExample} from './select-form/select-form-example';
import {PaginatorOverviewExample} from './paginator-overview/paginator-overview-example';
import {DatepickerOverviewExample} from './datepicker-overview/datepicker-overview-example';
import {
  PaginatorConfigurableExample
} from './paginator-configurable/paginator-configurable-example';
import {InputOverviewExample} from './input-overview/input-overview-example';
import {InputErrorsExample} from './input-errors/input-errors-example';
import {InputFormExample} from './input-form/input-form-example';
import {InputPrefixSuffixExample} from './input-prefix-suffix/input-prefix-suffix-example';
import {InputHintExample} from './input-hint/input-hint-example';
import {
  CdkDataTableModule,
  MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule,
  MdChipsModule, MdDatepickerModule, MdDialogModule, MdGridListModule, MdIconModule, MdInputModule,
  MdListModule, MdMenuModule, MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule,
  MdRadioModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule,
  MdSnackBarModule, MdTabsModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {TableOverviewExample} from './table-overview/table-overview-example';
import {TableBasicExample} from './table-basic/table-basic-example';

export interface LiveExample {
  title: string;
  component: any;
  additionalFiles?: string[];
  selectorName?: string;
}

/**
 * The list of example components.
 * Key is the example name which will be used in `material-docs-example="key"`.
 * Value is the component.
 */
export const EXAMPLE_COMPONENTS = {
  'autocomplete-overview': {title: 'Basic autocomplete', component: AutocompleteOverviewExample},
  'button-overview': {title: 'Basic buttons', component: ButtonOverviewExample},
  'button-types': {title: 'Button varieties', component: ButtonTypesExample},
  'button-toggle-exclusive': {
    title: 'Exclusive selection',
    component: ButtonToggleExclusiveExample
  },
  'button-toggle-overview': {title: 'Basic button-toggles', component: ButtonToggleOverviewExample},
  'chips-overview': {title: 'Basic chips', component: ChipsOverviewExample},
  'chips-stacked': {title: 'Stacked chips', component: ChipsStackedExample},
  'card-fancy': {title: 'Card with multiple sections', component: CardFancyExample},
  'card-overview': {title: 'Basic cards', component: CardOverviewExample},
  'checkbox-configurable': {title: 'Configurable checkbox', component: CheckboxConfigurableExample},
  'checkbox-overview': {title: 'Basic checkboxes', component: CheckboxOverviewExample},
  'datepicker-overview': {title: 'Basic datepicker', component: DatepickerOverviewExample},
  'dialog-overview': {
    title: 'Basic dialog',
    component: DialogOverviewExample,
    additionalFiles: ['dialog-overview-example-dialog.html'],
    selectorName: 'DialogOverviewExample, DialogOverviewExampleDialog',
  },
  'dialog-result': {
    title: 'Dialog with a result',
    component: DialogResultExample,
    additionalFiles: ['dialog-result-example-dialog.html'],
    selectorName: 'DialogResultExample, DialogResultExampleDialog',
  },
  'dialog-elements': {
    title: 'Dialog elements',
    component: DialogElementsExample,
    additionalFiles: ['dialog-elements-example-dialog.html'],
    selectorName: 'DialogElementsExample, DialogElementsExampleDialog',
  },
  'grid-list-dynamic': {title: 'Dynamic grid-list', component: GridListDynamicExample},
  'grid-list-overview': {title: 'Basic grid-list', component: GridListOverviewExample},
  'icon-overview': {title: 'Basic icons', component: IconOverviewExample},
  'icon-svg': {title: 'SVG icons', component: IconSvgExample},
  'input-form': {title: 'Inputs in a form', component: InputFormExample},
  'input-overview': {title: 'Basic inputs', component: InputOverviewExample},
  'input-errors': {title: 'Input Errors', component: InputErrorsExample},
  'input-prefix-suffix': {title: 'Input Prefixes/Suffixes', component: InputPrefixSuffixExample},
  'input-hint': {title: 'Input Hint', component: InputHintExample},
  'list-overview': {title: 'Basic list', component: ListOverviewExample},
  'list-sections': {title: 'List with sections', component: ListSectionsExample},
  'menu-icons': {title: 'Menu with icons', component: MenuIconsExample},
  'menu-overview': {title: 'Basic menu', component: MenuOverviewExample},
  'paginator-overview': {title: 'Paginator', component: PaginatorOverviewExample},
  'paginator-configurable': {
    title: 'Configurable paginator',
    component: PaginatorConfigurableExample
  },
  'progress-bar-configurable': {
    title: 'Configurable progress-bar',
    component: ProgressBarConfigurableExample
  },
  'progress-bar-overview': {title: 'Basic progress-bar', component: ProgressBarOverviewExample},
  'progress-spinner-configurable': {
    title: 'Configurable progress-bar',
    component: ProgressSpinnerConfigurableExample
  },
  'progress-spinner-overview': {
    title: 'Basic progress-spinner',
    component: ProgressSpinnerOverviewExample
  },
  'radio-ng-model': {title: 'Radios with ngModel', component: RadioNgModelExample},
  'radio-overview': {title: 'Basic radios', component: RadioOverviewExample},
  'select-overview': {title: 'Basic select', component: SelectOverviewExample},
  'select-form': {title: 'Select in a form', component: SelectFormExample},
  'sidenav-fab': {title: 'Sidenav with a FAB', component: SidenavFabExample},
  'sidenav-overview': {title: 'Basic sidenav', component: SidenavOverviewExample},
  'slider-configurable': {title: 'Configurable slider', component: SliderConfigurableExample},
  'slider-overview': {title: 'Basic slider', component: SliderOverviewExample},
  'slide-toggle-configurable': {
    title: 'Configurable slide-toggle',
    component: SlideToggleConfigurableExample
  },
  'slide-toggle-forms': {title: 'Slide-toggle with forms', component: SlideToggleFormsExample},
  'slide-toggle-overview': {title: 'Basic slide-toggles', component: SlideToggleOverviewExample},
  'snack-bar-component': {
    title: 'Snack-bar with a custom component',
    component: SnackBarComponentExample
  },
  'snack-bar-overview': {title: 'Basic snack-bar', component: SnackBarOverviewExample},
  'table-overview': {title: 'Feature-rich datatable', component: TableOverviewExample},
  'table-basic': {title: 'Basic table', component: TableBasicExample},
  'tabs-overview': {title: 'Basic tabs', component: TabsOverviewExample},
  'tabs-template-label': {title: 'Coming soon!', component: TabsTemplateLabelExample},
  'toolbar-multirow': {title: 'Multi-row toolbar', component: ToolbarMultirowExample},
  'toolbar-overview': {title: 'basic toolbar', component: ToolbarOverviewExample},
  'tooltip-overview': {title: 'Basic tooltip', component: TooltipOverviewExample},
  'tooltip-position': {title: 'Tooltip with custom position', component: TooltipPositionExample},
};

/**
 * NgModule that includes all Material modules that are required to serve the examples.
 */
@NgModule({
  exports: [
    CdkDataTableModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdSelectModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSidenavModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule
  ]
})
export class ExampleMaterialModule {}

/**
 * The list of all example components.
 * We need to put them in both `declarations` and `entryComponents` to make them work.
 */
export const EXAMPLE_LIST = [
  AutocompleteOverviewExample,
  ButtonOverviewExample,
  ButtonToggleExclusiveExample,
  ButtonToggleOverviewExample,
  ButtonTypesExample,
  CardFancyExample,
  CardOverviewExample,
  ChipsOverviewExample,
  ChipsStackedExample,
  CheckboxConfigurableExample,
  CheckboxOverviewExample,
  DatepickerOverviewExample,
  DialogOverviewExample,
  DialogOverviewExampleDialog,
  DialogResultExample,
  DialogResultExampleDialog,
  DialogElementsExample,
  DialogElementsExampleDialog,
  GridListDynamicExample,
  GridListOverviewExample,
  IconOverviewExample,
  IconSvgExample,
  InputFormExample,
  InputOverviewExample,
  InputPrefixSuffixExample,
  InputHintExample,
  InputErrorsExample,
  ListOverviewExample,
  ListSectionsExample,
  MenuIconsExample,
  MenuOverviewExample,
  PaginatorOverviewExample,
  PaginatorConfigurableExample,
  ProgressBarConfigurableExample,
  ProgressBarOverviewExample,
  ProgressSpinnerConfigurableExample,
  ProgressSpinnerOverviewExample,
  RadioNgModelExample,
  RadioOverviewExample,
  SidenavFabExample,
  SelectOverviewExample,
  SelectFormExample,
  SidenavOverviewExample,
  SliderConfigurableExample,
  SliderOverviewExample,
  SlideToggleConfigurableExample,
  SlideToggleOverviewExample,
  SlideToggleFormsExample,
  SnackBarComponentExample,
  PizzaPartyComponent,
  SnackBarOverviewExample,
  TableOverviewExample,
  TableBasicExample,
  TabsOverviewExample,
  TabsTemplateLabelExample,
  ToolbarMultirowExample,
  ToolbarOverviewExample,
  TooltipOverviewExample,
  TooltipPositionExample,
];

@NgModule({
  declarations: EXAMPLE_LIST,
  entryComponents: EXAMPLE_LIST,
  imports: [
    ExampleMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class ExampleModule { }
