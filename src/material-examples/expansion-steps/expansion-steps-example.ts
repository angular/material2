import {Component} from '@angular/core';


@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'expansion-overview-example.html',
})
export class ExpansionStepsExample {
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
