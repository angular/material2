import {Routes} from '@angular/router';
import {Home} from './demo-app';
import {AccordionDemo} from '../accordion/accordion-demo';
import {AutocompleteDemo} from '../autocomplete/autocomplete-demo';
import {CollapseDemo} from '../collapse/collapse-demo';
import {ColorpickerDemo} from '../colorpicker/colorpicker-demo';
import {DatepickerDemo} from '../datepicker/datepicker-demo';
import {DialogDemo} from '../md-dialog/dialog-demo';
import {MenuDemo} from '../md-menu/menu-demo';
import {MultiselectDemo} from '../multiselect/multiselect-demo';
import {SelectDemo} from '../select/select-demo';
import {TabsDemo} from '../md-tabs/tabs-demo';
import {TagsDemo} from '../tags/tags-demo';
import {ToastDemo} from '../toast/toast-demo';
import {TooltipDemo} from '../md-tooltip/tooltip-demo';
//import {ButtonDemo} from '../button/button-demo';
//import {BaselineDemo} from '../baseline/baseline-demo';
//import {ButtonToggleDemo} from '../button-toggle/button-toggle-demo';
//import {TabsDemo} from '../tabs/tab-group-demo';
//import {GridListDemo} from '../grid-list/grid-list-demo';
//import {GesturesDemo} from '../gestures/gestures-demo';
//import {LiveAnnouncerDemo} from '../live-announcer/live-announcer-demo';
//import {ListDemo} from '../list/list-demo';
//import {IconDemo} from '../icon/icon-demo';
//import {ToolbarDemo} from '../toolbar/toolbar-demo';
//import {InputDemo} from '../input/input-demo';
//import {CheckboxDemo} from '../checkbox/checkbox-demo';
//import {OverlayDemo} from '../overlay/overlay-demo';
//import {PortalDemo} from '../portal/portal-demo';
//import {ProgressBarDemo} from '../progress-bar/progress-bar-demo';
//import {ProgressCircleDemo} from '../progress-circle/progress-circle-demo';
//import {SlideToggleDemo} from '../slide-toggle/slide-toggle-demo';
//import {SliderDemo} from '../slider/slider-demo';
//import {SidenavDemo} from '../sidenav/sidenav-demo';
//import {RadioDemo} from '../radio/radio-demo';
//import {CardDemo} from '../card/card-demo';
//import {MenuDemo} from '../menu/menu-demo';
//import {RippleDemo} from '../ripple/ripple-demo';
//import {DialogDemo} from '../dialog/dialog-demo';
//import {TooltipDemo} from '../tooltip/tooltip-demo';


export const DEMO_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'accordion', component: AccordionDemo },
  { path: 'autocomplete', component: AutocompleteDemo },
  { path: 'collapse', component: CollapseDemo },
  { path: 'colorpicker', component: ColorpickerDemo },
  { path: 'datepicker', component: DatepickerDemo },
  { path: 'dialog', component: DialogDemo },
  { path: 'menu', component: MenuDemo },
  { path: 'multiselect', component: MultiselectDemo },
  { path: 'select', component: SelectDemo },
  { path: 'tabs', component: TabsDemo },
  { path: 'tags', component: TagsDemo },
  { path: 'toast', component: ToastDemo },
  { path: 'tooltip', component: TooltipDemo },
  //{ path: 'button', component: ButtonDemo },
  //{ path: 'card', component: CardDemo },
  //{ path: 'radio', component: RadioDemo },
  //{ path: 'sidenav', component: SidenavDemo },
  //{ path: 'slide-toggle', component: SlideToggleDemo },
  //{ path: 'slider', component: SliderDemo },
  //{ path: 'progress-circle', component: ProgressCircleDemo },
  //{ path: 'progress-bar', component: ProgressBarDemo },
  //{ path: 'portal', component: PortalDemo },
  //{ path: 'overlay', component: OverlayDemo },
  //{ path: 'checkbox', component: CheckboxDemo },
  //{ path: 'input', component: InputDemo },
  //{ path: 'toolbar', component: ToolbarDemo },
  //{ path: 'icon', component: IconDemo },
  //{ path: 'list', component: ListDemo },
  //{ path: 'menu', component: MenuDemo },
  //{ path: 'live-announcer', component: LiveAnnouncerDemo },
  //{ path: 'gestures', component: GesturesDemo },
  //{ path: 'grid-list', component: GridListDemo },
  //{ path: 'tabs', component: TabsDemo },
  //{ path: 'button-toggle', component: ButtonToggleDemo },
  //{ path: 'baseline', component: BaselineDemo },
  //{ path: 'ripple', component: RippleDemo },
  //{ path: 'dialog', component: DialogDemo },
  //{ path: 'tooltip', component: TooltipDemo },
];
