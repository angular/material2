import {Component, ViewEncapsulation} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'examples',
  templateUrl: 'examples.html',
  encapsulation: ViewEncapsulation.None,
})
export class Examples {
  navItems = [
    {name: 'Slider Overview', route: 'slider-overview'},
    {name: 'Configurable Slider', route: 'slider-configurable'},
    {name: 'Sidenav Overview', route: 'sidenav-overview'},
    {name: 'Sidenav with FAB', route: 'sidenav-fab'},
    {name: 'Input Overview', route: 'input-overview'},
    {name: 'Input Form', route: 'input-form'},
    {name: 'Button Overview', route: 'button-overview'},
    {name: 'Button Types', route: 'button-types'},
    {name: 'Card Overview', route: 'card-overview'},
    {name: 'Fancy Card', route: 'card-fancy'},
    {name: 'Checkbox Overview', route: 'checkbox-overview'},
    {name: 'Configurable Checkbox', route: 'checkbox-configurable'},
    {name: 'Button Toggle Overview', route: 'button-toggle-overview'},
    {name: 'Button Toggle Exclusive', route: 'button-toggle-exclusive'},
    {name: 'Radio Button Overview', route: 'radio-overview'},
    {name: 'Radio Button ngModel', route: 'radio-ngmodel'},
    {name: 'Toolbar Overview', route: 'toolbar-overview'},
    {name: 'Multi-row Toolbar', route: 'toolbar-multirow'},
    {name: 'List Overview', route: 'list-overview'},
    {name: 'List with Sections', route: 'list-sections'},
    {name: 'Grid List Overview', route: 'grid-list-overview'},
    {name: 'Dynamic Grid List', route: 'grid-list-dynamic'},
  ];
}
