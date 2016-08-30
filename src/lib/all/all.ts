import {NgModule, ModuleWithProviders} from '@angular/core';
import {MdAccordionModule} from '@angular2-material/accordion/accordion';
import {MdAutocompleteModule} from '@angular2-material/autocomplete/autocomplete';
import {MdCollapseModule} from '@angular2-material/collapse/collapse';
import {MdColorpickerModule} from '@angular2-material/colorpicker/colorpicker';
import {MdDatepickerModule} from '@angular2-material/datepicker/datepicker';
import {MdDialogModule} from '@angular2-material/md-dialog/dialog';
import {MdMenuModule} from '@angular2-material/md-menu/menu';
import {MdMultiselectModule} from '@angular2-material/multiselect/multiselect';
import {MdSelectModule} from '@angular2-material/select/select';
import {MdTabsModule} from '@angular2-material/md-tabs/tabs';
import {MdTagsModule} from '@angular2-material/tags/tags';
import {MdToastModule} from '@angular2-material/toast/toast';
import {MdTooltipModule} from '@angular2-material/md-tooltip/tooltip';
//import {MdButtonToggleModule} from '@angular2-material/button-toggle/button-toggle';
//import {MdButtonModule} from '@angular2-material/button/button';
//import {MdCheckboxModule} from '@angular2-material/checkbox/checkbox';
//import {MdRadioModule} from '@angular2-material/radio/radio';
//import {MdSlideToggleModule} from '@angular2-material/slide-toggle/slide-toggle';
//import {MdSliderModule} from '@angular2-material/slider/slider';
//import {MdSidenavModule} from '@angular2-material/sidenav/sidenav';
//import {MdListModule} from '@angular2-material/list/list';
//import {MdGridListModule} from '@angular2-material/grid-list/grid-list';
//import {MdCardModule} from '@angular2-material/card/card';
//import {MdIconModule} from '@angular2-material/icon/icon';
//import {MdProgressCircleModule} from '@angular2-material/progress-circle/progress-circle';
//import {MdProgressBarModule} from '@angular2-material/progress-bar/progress-bar';
//import {MdInputModule} from '@angular2-material/input/input';
//import {MdTabsModule} from '@angular2-material/tabs/tabs';
//import {MdToolbarModule} from '@angular2-material/toolbar/toolbar';
//import {MdTooltipModule} from '@angular2-material/tooltip/tooltip';
//import {MdRippleModule} from '@angular2-material/core/ripple/ripple';
//import {PortalModule} from '@angular2-material/core/portal/portal-directives';
//import {OverlayModule} from '@angular2-material/core/overlay/overlay-directives';
//import {MdMenuModule} from '@angular2-material/menu/menu';
//import {MdDialogModule} from '@angular2-material/dialog/dialog';
//import {RtlModule} from '@angular2-material/core/rtl/dir';
//import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';


const MATERIAL_MODULES = [
  MdAccordionModule,
  MdAutocompleteModule,
  MdCollapseModule,
  MdColorpickerModule,
  MdDatepickerModule,
  MdDialogModule,
  MdMenuModule,
  MdMultiselectModule,
  MdSelectModule,
  MdTagsModule,
  MdToastModule,
  MdTooltipModule,
  //MdButtonModule,
  //MdButtonToggleModule,
  //MdCardModule,
  //MdCheckboxModule,
  //MdDialogModule,
  //MdGridListModule,
  //MdIconModule,
  //MdInputModule,
  //MdListModule,
  //MdMenuModule,
  //MdProgressBarModule,
  //MdProgressCircleModule,
  //MdRadioModule,
  //MdRippleModule,
  //MdSidenavModule,
  //MdSliderModule,
  //MdSlideToggleModule,
  //MdTabsModule,
  //MdToolbarModule,
  //MdTooltipModule,
  //OverlayModule,
  //PortalModule,
  //RtlModule,
];

@NgModule({
  imports: [
    MdAccordionModule,
    MdAutocompleteModule,
    MdCollapseModule,
    MdColorpickerModule,
    MdDatepickerModule,
    MdDialogModule,
    MdMenuModule,
    MdMultiselectModule,
    MdSelectModule,
    MdTagsModule,
    MdToastModule,
    MdTooltipModule,
    //MdButtonModule,
    //MdCardModule,
    //MdCheckboxModule,
    //MdGridListModule,
    //MdInputModule,
    //MdListModule,
    //MdProgressBarModule,
    //MdProgressCircleModule,
    //MdRippleModule,
    //MdSidenavModule,
    //MdSliderModule,
    //MdSlideToggleModule,
    //MdTabsModule,
    //MdToolbarModule,
    //PortalModule,
    //RtlModule,

    // These modules include providers.
    //MdButtonToggleModule.forRoot(),
    //MdDialogModule.forRoot(),
    //MdIconModule.forRoot(),
    //MdMenuModule.forRoot(),
    //MdRadioModule.forRoot(),
    //MdTooltipModule.forRoot(),
    //OverlayModule.forRoot(),
  ],
  exports: MATERIAL_MODULES,
  //providers: [MdLiveAnnouncer]
})
export class MaterialRootModule { }


@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: MaterialRootModule };
  }
}
