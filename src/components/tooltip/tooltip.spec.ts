import {
    inject,
    async,
    addProviders,
    TestComponentBuilder,
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TooltipPosition, MdTooltip} from '@angular2-material/tooltip/tooltip';
import {OverlayContainer} from '@angular2-material/core/overlay/overlay-container';
import {MdTooltipModule} from './tooltip';


describe('MdTooltip', () => {
  let builder: TestComponentBuilder;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdTooltipModule],
      declarations: [BasicTooltipDemo],
    });

    addProviders([
      {provide: OverlayContainer, useFactory: () => {
        overlayContainerElement = document.createElement('div');
        return {getContainerElement: () => overlayContainerElement};
      }}
    ]);

    TestBed.compileComponents();
  }));

  beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    builder = tcb;
  }));

  describe('basic usage', () => {
    let fixture: ComponentFixture<BasicTooltipDemo>;
    let buttonDebugElement: DebugElement;
    let buttonElement: HTMLButtonElement;
    let tooltipDirective: MdTooltip;

    beforeEach(async(() => {
      builder.createAsync(BasicTooltipDemo).then(f => {
        fixture = f;
        fixture.detectChanges();
        buttonDebugElement = fixture.debugElement.query(By.css('button'));
        buttonElement = <HTMLButtonElement> buttonDebugElement.nativeElement;
        tooltipDirective = buttonDebugElement.injector.get(MdTooltip);
      });
    }));

    it('should show/hide on mouse enter/leave', async(() => {
      expect(tooltipDirective.visible).toBeFalsy();

      tooltipDirective._handleMouseEnter(null);
      expect(tooltipDirective.visible).toBeTruthy();

      fixture.detectChanges();
      whenStable([
        () => {
          expect(overlayContainerElement.textContent).toBe('some message');
        },
        () => {
          expect(overlayContainerElement.querySelector('.md-tooltip').classList
              .contains('md-tooltip-visible')).toBeTruthy();
          tooltipDirective._handleMouseLeave(null);
        },
        () => {
          // Query for md-tooltip-visible class rather than waiting for CSS transitions to finish
          expect(overlayContainerElement.classList.contains('md-tooltip-visible')).toBeFalsy();
        }
      ]);
    }));

    /**
     * Utility function to make it easier to use multiple `whenStable` checks.
     * Accepts an array of callbacks, each to wait for stability before running.
     * TODO: Remove the `setTimeout()` when a viable alternative is available
     * @param callbacks
     */
    function whenStable(callbacks: Array<Function>) {
      if (callbacks.length) {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // TODO(jelbourn): figure out why the test zone is "stable" when there are still pending
          // tasks, such that we have to use `setTimeout` to run the second round of change
          // detection. Two rounds of change detection are necessary: one to *create* the tooltip,
          // and another to cause the lifecycle events of the tooltip to run and load the tooltip
          // content.
          setTimeout(() => {
            callbacks[0]();
            whenStable(callbacks.slice(1));
          }, 50);
        });
      }
    }
  });
});

@Component({
  selector: 'app',
  template: `<button md-tooltip="some message" [tooltip-position]="position">Button</button>`
})
class BasicTooltipDemo {
  position: TooltipPosition = 'below';
}
