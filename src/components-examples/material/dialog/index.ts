import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {
  DialogContentExample,
  DialogContentExampleDialog
} from './dialog-content/dialog-content-example';
import {DialogDataExample, DialogDataExampleDialog} from './dialog-data/dialog-data-example';
import {
  DialogElementsExample,
  DialogElementsExampleDialog
} from './dialog-elements/dialog-elements-example';
import {
  DialogOverviewExample,
  DialogOverviewExampleDialog
} from './dialog-overview/dialog-overview-example';
import {
  DialogAnimationsExample,
  DialogAnimationsExampleDialog
} from './dialog-animations/dialog-animations-example';

export {
  DialogContentExample,
  DialogContentExampleDialog,
  DialogDataExample,
  DialogDataExampleDialog,
  DialogElementsExample,
  DialogElementsExampleDialog,
  DialogOverviewExample,
  DialogOverviewExampleDialog,
  DialogAnimationsExample,
  DialogAnimationsExampleDialog,
};

const EXAMPLES = [
  DialogContentExample,
  DialogContentExampleDialog,
  DialogDataExample,
  DialogDataExampleDialog,
  DialogElementsExample,
  DialogElementsExampleDialog,
  DialogOverviewExample,
  DialogOverviewExampleDialog,
  DialogAnimationsExample,
  DialogAnimationsExampleDialog,
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class DialogExamplesModule {
}
