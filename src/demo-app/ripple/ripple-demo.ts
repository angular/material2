import {Component, ViewChild} from '@angular/core';
import {MdRipple} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'ripple-demo',
  templateUrl: 'ripple-demo.html',
  styleUrls: ['ripple-demo.css'],
})
export class RippleDemo {
  @ViewChild(MdRipple) ripple: MdRipple;

  centered = false;
  disabled = false;
  unbounded = false;
  rounded = false;
  radius: number = null;
  rippleSpeed = 1;
  rippleColor = '';

  disableButtonRipples = false;

  doManualRipple() {
    if (this.ripple) {
      this.ripple.createRipple(0, 0, { centered: true });
    }
  }

}
