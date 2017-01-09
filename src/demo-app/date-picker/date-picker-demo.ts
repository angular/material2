import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'date-picker-demo',
  templateUrl: 'date-picker-demo.html'
})
export class DatePickerDemo {
  date = new Date();
  selected: Date;
}
