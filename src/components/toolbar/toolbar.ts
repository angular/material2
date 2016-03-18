import {
  Component,
  ChangeDetectionStrategy,
  Input
} from 'angular2/core';
import {Renderer} from 'angular2/core';
import {ElementRef} from 'angular2/core';

@Component({
  selector: 'md-toolbar',
  templateUrl: './components/toolbar/toolbar.html',
  styleUrls: ['./components/toolbar/toolbar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdToolbar {

  private _color: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  @Input()
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._updateColor(value);
  }

  _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  _setElementColor(color: string, isAdd: boolean) {
    if (color != null && color != '') {
      this.renderer.setElementClass(this.elementRef.nativeElement, `md-${color}`, isAdd);
    }
  }

}
