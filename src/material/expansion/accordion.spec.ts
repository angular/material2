import {async, TestBed, inject} from '@angular/core/testing';
import {Component, ViewChild, QueryList, ViewChildren} from '@angular/core';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatExpansionModule,
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from './index';
import {
  dispatchKeyboardEvent,
  createKeyboardEvent,
  dispatchEvent,
} from '@angular/cdk/testing/private';
import {DOWN_ARROW, UP_ARROW, HOME, END} from '@angular/cdk/keycodes';
import {FocusMonitor} from '@angular/cdk/a11y';


describe('MatAccordion', () => {
  let focusMonitor: FocusMonitor;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule
      ],
      declarations: [
        AccordionWithHideToggle,
        AccordionWithTogglePosition,
        NestedPanel,
        SetOfItems,
        NestedAccordions,
      ],
    });
    TestBed.compileComponents();

    inject([FocusMonitor], (fm: FocusMonitor) => {
      focusMonitor = fm;
    })();
  }));

  it('should ensure only one item is expanded at a time', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
    const panelInstances = fixture.componentInstance.panels.toArray();

    panelInstances[0].expanded = true;
    fixture.detectChanges();
    expect(items[0].classes['mat-expanded']).toBeTruthy();
    expect(items[1].classes['mat-expanded']).toBeFalsy();

    panelInstances[1].expanded = true;
    fixture.detectChanges();
    expect(items[0].classes['mat-expanded']).toBeFalsy();
    expect(items[1].classes['mat-expanded']).toBeTruthy();
  });

  it('should allow multiple items to be expanded simultaneously', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.componentInstance.multi = true;
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
    const panelInstances = fixture.componentInstance.panels.toArray();

    panelInstances[0].expanded = true;
    panelInstances[1].expanded = true;
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeTruthy();
    expect(panels[1].classes['mat-expanded']).toBeTruthy();
  });

  it('should expand or collapse all enabled items', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));

    fixture.componentInstance.multi = true;
    fixture.componentInstance.panels.toArray()[1].expanded = true;
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeFalsy();
    expect(panels[1].classes['mat-expanded']).toBeTruthy();

    fixture.componentInstance.accordion.openAll();
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeTruthy();
    expect(panels[1].classes['mat-expanded']).toBeTruthy();

    fixture.componentInstance.accordion.closeAll();
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeFalsy();
    expect(panels[1].classes['mat-expanded']).toBeFalsy();
  });

  it('should not expand or collapse disabled items', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));

    fixture.componentInstance.multi = true;
    fixture.componentInstance.panels.toArray()[1].disabled = true;
    fixture.detectChanges();
    fixture.componentInstance.accordion.openAll();
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeTruthy();
    expect(panels[1].classes['mat-expanded']).toBeFalsy();

    fixture.componentInstance.accordion.closeAll();
    fixture.detectChanges();
    expect(panels[0].classes['mat-expanded']).toBeFalsy();
    expect(panels[1].classes['mat-expanded']).toBeFalsy();
  });

  it('should not register nested panels to the same accordion', () => {
    const fixture = TestBed.createComponent(NestedPanel);
    fixture.detectChanges();

    const innerPanel = fixture.componentInstance.innerPanel;
    const outerPanel = fixture.componentInstance.outerPanel;

    expect(innerPanel.accordion).not.toBe(outerPanel.accordion);
  });

  it('should update the expansion panel if hideToggle changed', () => {
    const fixture = TestBed.createComponent(AccordionWithHideToggle);
    const panel = fixture.debugElement.query(By.directive(MatExpansionPanel))!;

    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.mat-expansion-indicator'))
      .toBeTruthy('Expected the expansion indicator to be present.');

    fixture.componentInstance.hideToggle = true;
    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.mat-expansion-indicator'))
      .toBeFalsy('Expected the expansion indicator to be removed.');
  });

  it('should update the expansion panel if togglePosition changed', () => {
    const fixture = TestBed.createComponent(AccordionWithTogglePosition);
    const panel = fixture.debugElement.query(By.directive(MatExpansionPanel))!;

    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.mat-expansion-toggle-indicator-after'))
      .toBeTruthy('Expected the expansion indicator to be positioned after.');

    fixture.componentInstance.togglePosition = 'before';
    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.mat-expansion-toggle-indicator-before'))
      .toBeTruthy('Expected the expansion indicator to be positioned before.');
  });

  it('should move focus to the next header when pressing the down arrow', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach(header => spyOn(header, 'focus'));

    // Stop at the second-last header so focus doesn't wrap around.
    for (let i = 0; i < headerElements.length - 1; i++) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      expect(headers[i + 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should not move focus into nested accordions', () => {
    const fixture = TestBed.createComponent(NestedAccordions);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();
    const {firstInnerHeader, secondOuterHeader} = fixture.componentInstance;

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach(header => spyOn(header, 'focus'));

    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    expect(secondOuterHeader.focus).toHaveBeenCalledTimes(1);
    expect(firstInnerHeader.focus).not.toHaveBeenCalled();
  });

  it('should move focus to the next header when pressing the up arrow', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[headerElements.length - 1].nativeElement, 'keyboard');
    headers.forEach(header => spyOn(header, 'focus'));

    // Stop before the first header
    for (let i = headers.length - 1; i > 0; i--) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();
      expect(headers[i - 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should skip disabled items when moving focus with the keyboard', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const panels = fixture.componentInstance.panels.toArray();
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach(header => spyOn(header, 'focus'));
    panels[1].disabled = true;
    fixture.detectChanges();

    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    expect(headers[1].focus).not.toHaveBeenCalled();
    expect(headers[2].focus).toHaveBeenCalledTimes(1);
  });

  it('should focus the first header when pressing the home key', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));
    const event = dispatchKeyboardEvent(
        headerElements[headerElements.length - 1].nativeElement, 'keydown', HOME);
    fixture.detectChanges();

    expect(headers[0].focus).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not handle the home key when it is pressed with a modifier', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));
    const eventTarget = headerElements[headerElements.length - 1].nativeElement;
    const event = createKeyboardEvent('keydown', HOME, eventTarget);
    Object.defineProperty(event, 'altKey', {get: () => true});

    dispatchEvent(eventTarget, event);
    fixture.detectChanges();

    expect(headers[0].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('should focus the last header when pressing the end key', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));
    const event = dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', END);
    fixture.detectChanges();

    expect(headers[headers.length - 1].focus).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not handle the end key when it is pressed with a modifier', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));

    const eventTarget = headerElements[0].nativeElement;
    const event = createKeyboardEvent('keydown', END, eventTarget);
    Object.defineProperty(event, 'altKey', {get: () => true});

    dispatchEvent(eventTarget, event);
    fixture.detectChanges();

    expect(headers[headers.length - 1].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

});


@Component({template: `
  <mat-accordion [multi]="multi">
    <mat-expansion-panel *ngFor="let i of [0, 1, 2, 3]">
      <mat-expansion-panel-header>Summary {{i}}</mat-expansion-panel-header>
      <p>Content</p>
    </mat-expansion-panel>
  </mat-accordion>`})
class SetOfItems {
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;
  @ViewChildren(MatExpansionPanelHeader) headers: QueryList<MatExpansionPanelHeader>;

  multi: boolean = false;
}

@Component({template: `
  <mat-accordion>
    <mat-expansion-panel>
      <mat-expansion-panel-header>Summary 0</mat-expansion-panel-header>
      Content 0

      <mat-expansion-panel>
        <mat-expansion-panel-header #firstInnerHeader>Summary 0-0</mat-expansion-panel-header>
        Content 0-0
      </mat-expansion-panel>
    </mat-expansion-panel>

    <mat-expansion-panel>
      <mat-expansion-panel-header #secondOuterHeader>Summary 1</mat-expansion-panel-header>
      Content 1
    </mat-expansion-panel>
  </mat-accordion>`})
class NestedAccordions {
  @ViewChildren(MatExpansionPanelHeader) headers: QueryList<MatExpansionPanelHeader>;
  @ViewChild('secondOuterHeader', {static: false}) secondOuterHeader: MatExpansionPanelHeader;
  @ViewChild('firstInnerHeader', {static: false}) firstInnerHeader: MatExpansionPanelHeader;
}

@Component({template: `
  <mat-accordion>
    <mat-expansion-panel #outerPanel="matExpansionPanel">
      <mat-expansion-panel-header>Outer Panel</mat-expansion-panel-header>
      <mat-expansion-panel #innerPanel="matExpansionPanel">
        <mat-expansion-panel-header>Inner Panel</mat-expansion-panel-header>
        <p>Content</p>
      </mat-expansion-panel>
    </mat-expansion-panel>
  </mat-accordion>`})
class NestedPanel {
  @ViewChild('outerPanel', {static: false}) outerPanel: MatExpansionPanel;
  @ViewChild('innerPanel', {static: false}) innerPanel: MatExpansionPanel;
}

@Component({template: `
  <mat-accordion [hideToggle]="hideToggle">
    <mat-expansion-panel>
      <mat-expansion-panel-header>Header</mat-expansion-panel-header>
      <p>Content</p>
    </mat-expansion-panel>
  </mat-accordion>`
})
class AccordionWithHideToggle {
  hideToggle = false;
}


@Component({template: `
  <mat-accordion [togglePosition]="togglePosition">
    <mat-expansion-panel>
      <mat-expansion-panel-header>Header</mat-expansion-panel-header>
      <p>Content</p>
    </mat-expansion-panel>
  </mat-accordion>`
})
class AccordionWithTogglePosition {
  togglePosition = 'after';
}
