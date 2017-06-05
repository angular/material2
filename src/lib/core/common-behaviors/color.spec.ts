import {mixinColor} from './color';
import {ElementRef, Renderer2} from '@angular/core';

describe('MixinColor', () => {

  it('should augment an existing class with a color property', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.color)
        .toBeFalsy('Expected the mixed-into class to have a color property');

    instance.color = 'accent';

    expect(instance.color)
        .toBe('accent', 'Expected the mixed-into class to have an updated color property');
  });

  it('should remove old color classes if new color is set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to not have any classes at initialization');

    instance.color = 'primary';

    expect(instance.testElement.classList)
      .toContain('mat-primary', 'Expected the element to have the "mat-primary" class set');

    instance.color = 'accent';

    expect(instance.testElement.classList)
      .not.toContain('mat-primary', 'Expected the element to no longer have "mat-primary" set.');
    expect(instance.testElement.classList)
      .toContain('mat-accent', 'Expected the element to have the "mat-accent" class set');
  });

  it('should allow updating the color to an empty value', () => {
    const classWithColor = mixinColor(TestClass, true);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to not have any classes at initialization');

    instance.color = 'primary';

    expect(instance.testElement.classList)
      .toContain('mat-primary', 'Expected the element to have the "mat-primary" class set');

    instance.color = null;

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to not have any classes after the color has been set to null');
  });

});

class TestClass {
  testElement: HTMLElement = document.createElement('div');

  /** Mock of a RendererV2 for the color mixin. */
  _renderer: Renderer2 = {
    addClass: (element: HTMLElement, className: string) => element.classList.add(className),
    removeClass: (element: HTMLElement, className: string) => element.classList.remove(className)
  } as any;

  /** Fake instance of an ElementRef. */
  _elementRef = new ElementRef(this.testElement);
}
