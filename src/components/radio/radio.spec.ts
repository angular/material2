import {
  it,
  describe,
  expect,
  beforeEach,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {MdRadioButton, MdRadioGroup, MdRadioChange} from './radio';
import {MdRadioDispatcher} from './radio_dispatcher';

export function main() {
  describe('MdRadioButton', () => {
    let builder: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      builder = tcb;
    }));

    it('should have same name as radio group', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group name="my_group">
              <md-radio-button></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));

          fixture.detectChanges();
          expect(button.componentInstance.name).toBe('my_group');
        }).then(done);
    });

    it('should not allow click selection if disabled', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, '<md-radio-button disabled></md-radio-button>')
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));

          fixture.detectChanges();
          expect(button.componentInstance.checked).toBe(false);

          button.nativeElement.click();
          expect(button.componentInstance.checked).toBe(false);
        }).then(done);
    });

    it('should be disabled if radio group disabled', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group disabled>
              <md-radio-button></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));
          let input = button.query(By.css('input'));

          fixture.detectChanges();
          expect(button.componentInstance.disabled).toBe(true);
          expect(input.nativeElement.hasAttribute('tabindex')).toBe(false);
        }).then(done);
    });

    it('updates parent group value when selected and value changed', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group>
              <md-radio-button value="1"></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));
          let group = fixture.debugElement.query(By.css('md-radio-group'));
          let radioGroupInstance = group.injector.get(MdRadioGroup);

          radioGroupInstance.selected = button.componentInstance;
          fixture.detectChanges();
          expect(radioGroupInstance.value).toBe('1');

          button.componentInstance.value = '2';
          fixture.detectChanges();
          expect(radioGroupInstance.value).toBe('2');
        }).then(done);
    });

    it('should be checked after input change event', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, '<md-radio-button></md-radio-button>')
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));
          let input = button.query(By.css('input'));

          fixture.detectChanges();
          expect(button.componentInstance.checked).toBe(false);

          let event = createEvent('change');
          input.nativeElement.dispatchEvent(event);
          expect(button.componentInstance.checked).toBe(true);
        }).then(done);
    });

    it('should emit event when checked', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, '<md-radio-button></md-radio-button>')
        .createAsync(TestApp)
        .then(fixture => {
          fakeAsync(function() {
            let button = fixture.debugElement.query(By.css('md-radio-button'));
            let changeEvent: MdRadioChange = null;
            button.componentInstance.change.subscribe((evt: MdRadioChange) => {
              changeEvent = evt;
            });
            button.componentInstance.checked = true;
            fixture.detectChanges();
            tick();

            expect(changeEvent).not.toBe(null);
            expect(changeEvent.source).toBe(button.componentInstance);
          });
        }).then(done);
    });

    it('should be focusable', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, '<md-radio-button></md-radio-button>')
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));
          let input = button.query(By.css('input'));

          fixture.detectChanges();
          expect(button.nativeElement.classList.contains('md-radio-focused')).toBe(false);

          let event = createEvent('focus');
          input.nativeElement.dispatchEvent(event);
          fixture.detectChanges();
          expect(button.nativeElement.classList.contains('md-radio-focused')).toBe(true);

          event = createEvent('blur');
          input.nativeElement.dispatchEvent(event);
          fixture.detectChanges();
          expect(button.nativeElement.classList.contains('md-radio-focused')).toBe(false);
        }).then(done);
    });
    it('should not scroll when pressing space on the checkbox', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, '<md-radio-button></md-radio-button>')
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));

          let keyboardEvent = dispatchKeyboardEvent('keydown', button.nativeElement, ' ');
          fixture.detectChanges();

          expect(keyboardEvent.preventDefault).toHaveBeenCalled();
        }).then(done);
    });
    it('should make the host element a tab stop', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group name="my_group">
                <md-radio-button></md-radio-button>
            </md-radio-group>
        `)
        .createAsync(TestApp)
        .then(fixture => {
          let button = fixture.debugElement.query(By.css('md-radio-button'));
          fixture.detectChanges();
          expect(button.nativeElement.tabIndex).toBe(0);
        }).then(done);
    });
  });

  describe('MdRadioDispatcher', () => {
    let builder: TestComponentBuilder;
    let dispatcher: MdRadioDispatcher;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      builder = tcb;
      dispatcher = new MdRadioDispatcher();
    }));

    it('notifies listeners', () => {
      let notificationCount = 0;
      const numListeners = 2;

      for (let i = 0; i < numListeners; i++) {
        dispatcher.listen(() => {
          notificationCount++;
        });
      }

      dispatcher.notify('hello');

      expect(notificationCount).toBe(numListeners);
    });
  });

  describe('MdRadioGroup', () => {
    let builder: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      builder = tcb;
    }));

    it('can select by value', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group>
              <md-radio-button value="1"></md-radio-button>
              <md-radio-button value="2"></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));
          let group = fixture.debugElement.query(By.css('md-radio-group'));
          let radioGroupInstance = group.injector.get(MdRadioGroup);

          fixture.detectChanges();
          expect(radioGroupInstance.selected).toBe(null);

          radioGroupInstance.value = '2';

          fixture.detectChanges();
          expect(radioGroupInstance.selected).toBe(buttons[1].componentInstance);
        }).then(done);
    });

    it('should select uniquely', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group>
              <md-radio-button></md-radio-button>
              <md-radio-button></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));
          let group = fixture.debugElement.query(By.css('md-radio-group'));
          let radioGroupInstance = group.injector.get(MdRadioGroup);

          fixture.detectChanges();
          expect(radioGroupInstance.selected).toBe(null);

          radioGroupInstance.selected = buttons[0].componentInstance;
          fixture.detectChanges();
          expect(isSinglySelected(buttons[0], buttons)).toBe(true);

          radioGroupInstance.selected = buttons[1].componentInstance;
          fixture.detectChanges();
          expect(isSinglySelected(buttons[1], buttons)).toBe(true);
        }).then(done);
    });

    it('should emit event when value changes', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group>
              <md-radio-button></md-radio-button>
              <md-radio-button></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          fakeAsync(function() {
            let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));
            let group = fixture.debugElement.query(By.css('md-radio-group'));
            let radioGroupInstance = group.injector.get(MdRadioGroup);

            let changeEvent: MdRadioChange = null;
            radioGroupInstance.change.subscribe((evt: MdRadioChange) => {
              changeEvent = evt;
            });

            radioGroupInstance.selected = buttons[1].componentInstance;
            fixture.detectChanges();
            tick();

            expect(changeEvent).not.toBe(null);
            expect(changeEvent.source).toBe(buttons[1].componentInstance);
          });
        }).then(done);
    });

    it('should bind value to model without initial value', (done: () => void) => {
      builder
        .overrideTemplate(TestApp, `
            <md-radio-group  [(ngModel)]="choice">
              <md-radio-button [value]="0"></md-radio-button>
              <md-radio-button [value]="1"></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestApp)
        .then(fixture => {
          fakeAsync(function() {
            let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));
            let group = fixture.debugElement.query(By.css('md-radio-group'));
            let radioGroupInstance = group.injector.get(MdRadioGroup);

            fixture.detectChanges();
            expect(buttons[0].componentInstance.checked).toBe(false);
            expect(buttons[1].componentInstance.checked).toBe(false);
            expect(fixture.componentInstance.choice).toBe(undefined);

            radioGroupInstance.selected = buttons[0].componentInstance;
            fixture.detectChanges();
            expect(isSinglySelected(buttons[0], buttons)).toBe(true);
            expect(fixture.componentInstance.choice).toBe(0);

            radioGroupInstance.selected = buttons[1].componentInstance;
            fixture.detectChanges();
            expect(isSinglySelected(buttons[1], buttons)).toBe(true);
            expect(fixture.componentInstance.choice).toBe(1);
          });
        }).then(done);
    });

    it('should bind value to model with initial value', (done: () => void) => {
      builder
        .overrideTemplate(TestAppWithInitialValue, `
            <md-radio-group  [(ngModel)]="choice">
              <md-radio-button [value]="0"></md-radio-button>
              <md-radio-button [value]="1"></md-radio-button>
            </md-radio-group>`)
        .createAsync(TestAppWithInitialValue)
        .then(fixture => {
          fakeAsync(function() {
            let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));
            let group = fixture.debugElement.query(By.css('md-radio-group'));
            let radioGroupInstance = group.injector.get(MdRadioGroup);

            fixture.detectChanges();
            expect(isSinglySelected(buttons[1], buttons)).toBe(true);
            expect(fixture.componentInstance.choice).toBe(1);

            radioGroupInstance.selected = buttons[0].componentInstance;
            fixture.detectChanges();
            expect(isSinglySelected(buttons[0], buttons)).toBe(true);
            expect(fixture.componentInstance.choice).toBe(0);

            radioGroupInstance.selected = buttons[1].componentInstance;
            fixture.detectChanges();
            expect(isSinglySelected(buttons[1], buttons)).toBe(true);
            expect(fixture.componentInstance.choice).toBe(1);
          });
        }).then(done);
    });
    it('should deselect all buttons when model is null or undefined', (done: () => void) => {
      builder
        .overrideTemplate(TestAppWithInitialValue, `
          <md-radio-group  [(ngModel)]="choice">
            <md-radio-button [value]="0"></md-radio-button>
            <md-radio-button [value]="1"></md-radio-button>
          </md-radio-group>`)
        .createAsync(TestAppWithInitialValue)
        .then(fixture => {
          fakeAsync(function() {
            let buttons = fixture.debugElement.queryAll(By.css('md-radio-button'));

            fixture.detectChanges();
            fixture.componentInstance.choice = 0;
            expect(isSinglySelected(buttons[0], buttons)).toBe(true);

            fixture.detectChanges();
            fixture.componentInstance.choice = null;
            expect(allDeselected(buttons)).toBe(true);
          });
        }).then(done);
    });
  });
}

/** Checks whether a given button is uniquely selected from a group of buttons. */
function isSinglySelected(button: DebugElement, buttons: DebugElement[]): boolean {
  let component = button.componentInstance;
  let otherSelectedButtons =
      buttons.filter((e: DebugElement) =>
          e.componentInstance != component && e.componentInstance.checked);
  return component.checked && otherSelectedButtons.length == 0;
}

/** Checks whether no button is selected from a group of buttons. */
function allDeselected(buttons: DebugElement[]): boolean {
    let selectedButtons =
        buttons.filter((e: DebugElement) => e.componentInstance.checked);
    return selectedButtons.length == 0;
}

/** Browser-agnostic function for creating an event. */
function createEvent(name: string): Event {
  let ev: Event;
  try {
    ev = createEvent(name);
  } catch (e) {
    ev = document.createEvent('Event');
    ev.initEvent(name, true, true);
  }
  return ev;
}


/** Test component. */
@Component({
  directives: [MdRadioButton, MdRadioGroup],
  providers: [MdRadioDispatcher],
  template: ''
})
class TestApp {
  choice: number;
}

/** Test component. */
@Component({
  directives: [MdRadioButton, MdRadioGroup],
  providers: [MdRadioDispatcher],
  template: ''
})
class TestAppWithInitialValue {
  choice: number = 1;
}


// TODO(trik): remove eveything below when Angular supports faking events.
// copy & paste from checkbox.spec.ts


var BROWSER_SUPPORTS_EVENT_CONSTRUCTORS: boolean = (function() {
    // See: https://github.com/rauschma/event_constructors_check/blob/gh-pages/index.html#L39
    try {
        return new Event('submit', { bubbles: false }).bubbles === false &&
            new Event('submit', { bubbles: true }).bubbles === true;
    } catch (e) {
        return false;
    }
})();

/**
 * Dispatches a keyboard event from an element.
 * @param eventName The name of the event to dispatch, such as "keydown".
 * @param element The element from which the event will be dispatched.
 * @param key The key tied to the KeyboardEvent.
 * @returns The artifically created keyboard event.
 */
function dispatchKeyboardEvent(eventName: string, element: HTMLElement, key: string): Event {
    let keyboardEvent: Event;
    if (BROWSER_SUPPORTS_EVENT_CONSTRUCTORS) {
        keyboardEvent = new KeyboardEvent(eventName);
    } else {
        keyboardEvent = document.createEvent('Event');
        keyboardEvent.initEvent(eventName, true, true);
    }

    // Hack DOM Level 3 Events "key" prop into keyboard event.
    Object.defineProperty(keyboardEvent, 'key', {
        value: key,
        enumerable: false,
        writable: false,
        configurable: true,
    });

    // Using spyOn seems to be the *only* way to determine if preventDefault is called, since it
    // seems that `defaultPrevented` does not get set with the technique.
    spyOn(keyboardEvent, 'preventDefault').and.callThrough();

    element.dispatchEvent(keyboardEvent);
    return keyboardEvent;
}
