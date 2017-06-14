import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompatibilityModule, UNIQUE_SELECTION_DISPATCHER_PROVIDER} from '../core';
import {
  MdExpansionPanelHeader,
  MdExpansionPanelDescription,
  MdExpansionPanelTitle
} from './expansion-panel-header';
import {
  MdExpansionPanel,
  MdExpansionPanelActionRow,
} from './expansion-panel';
import {
  CdkAccordion,
  MdAccordion,
} from './accordion';

@NgModule({
  imports: [CompatibilityModule, CommonModule],
  exports: [
    CdkAccordion,
    MdAccordion,
    MdExpansionPanel,
    MdExpansionPanelActionRow,
    MdExpansionPanelHeader,
    MdExpansionPanelTitle,
    MdExpansionPanelDescription
  ],
  declarations: [
    CdkAccordion,
    MdAccordion,
    MdExpansionPanel,
    MdExpansionPanelActionRow,
    MdExpansionPanelHeader,
    MdExpansionPanelTitle,
    MdExpansionPanelDescription
  ],
  providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
})
export class MdExpansionModule {}

export {
  CdkAccordion,
  MdAccordion,
  MdAccordionDisplayMode
} from './accordion';
export {AccordionItem} from './accordion-item';
export {
  MdExpansionPanel,
  MdExpansionPanelState,
  MdExpansionPanelActionRow
} from './expansion-panel';
export {
  MdExpansionPanelHeader,
  MdExpansionPanelDescription,
  MdExpansionPanelTitle
} from './expansion-panel-header';
