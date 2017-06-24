import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

/**
 * @title Dialog with a result
 * @id dialog-result
 * @component DialogResultExample
 * @addlComponents DialogResultExampleDialog
 * @additionalFiles dialog-result-example-dialog.html
 * @selectorName DialogResultExample, DialogResultExampleDialog
 */
@Component({
  selector: 'dialog-result-example',
  templateUrl: 'dialog-result-example.html',
})
export class DialogResultExample {
  selectedOption: string;

  constructor(public dialog: MdDialog) {}

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }
}


@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: 'dialog-result-example-dialog.html',
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MdDialogRef<DialogResultExampleDialog>) {}
}
