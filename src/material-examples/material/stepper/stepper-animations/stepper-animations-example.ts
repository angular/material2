import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

/**
 * @title Stepper animations
 */
@Component({
  selector: 'stepper-animations-example',
  templateUrl: 'stepper-animations-example.html',
  styleUrls: ['stepper-animations-example.css'],
})
export class StepperAnimationsExample {
  constructor(private _formBuilder: FormBuilder) {}
  firstFormGroup: FormGroup = this._formBuilder.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this._formBuilder.group({secondCtrl: ['']});
}
