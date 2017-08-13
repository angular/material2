import {async, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdExpansionModule} from './index';


describe('MdExpansionPanel', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MdExpansionModule
      ],
      declarations: [
        PanelWithContent,
        PanelWithCustomMargin
      ],
    });
    TestBed.compileComponents();
  }));

  it('should expand and collapse the panel', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const contentEl = fixture.debugElement.query(By.css('.mat-expansion-panel-content'));
    const headerEl = fixture.debugElement.query(By.css('.mat-expansion-panel-header'));
    fixture.detectChanges();
    expect(headerEl.classes['mat-expanded']).toBeFalsy();
    expect(contentEl.classes['mat-expanded']).toBeFalsy();

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    expect(headerEl.classes['mat-expanded']).toBeTruthy();
    expect(contentEl.classes['mat-expanded']).toBeTruthy();
  });

  it('emit correct events for change in panel expanded state', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.openCallback).toHaveBeenCalled();

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    expect(fixture.componentInstance.closeCallback).toHaveBeenCalled();
  });

  it('creates a unique panel id for each panel', () => {
    const fixtureOne = TestBed.createComponent(PanelWithContent);
    const headerElOne = fixtureOne.nativeElement.querySelector('.mat-expansion-panel-header');
    const fixtureTwo = TestBed.createComponent(PanelWithContent);
    const headerElTwo = fixtureTwo.nativeElement.querySelector('.mat-expansion-panel-header');
    fixtureOne.detectChanges();
    fixtureTwo.detectChanges();

    const panelIdOne = headerElOne.getAttribute('aria-controls');
    const panelIdTwo = headerElTwo.getAttribute('aria-controls');
    expect(panelIdOne).not.toBe(panelIdTwo);
  });

  it('should not be able to focus content while closed', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    button.focus();
    expect(document.activeElement).toBe(button, 'Expected button to start off focusable.');

    button.blur();
    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    tick(250);

    button.focus();
    expect(document.activeElement).not.toBe(button, 'Expected button to no longer be focusable.');
  }));

  it('should not override the panel margin if it is not inside an accordion', fakeAsync(() => {
    let fixture = TestBed.createComponent(PanelWithCustomMargin);
    fixture.detectChanges();

    let panel = fixture.debugElement.query(By.css('md-expansion-panel'));
    let styles = getComputedStyle(panel.nativeElement);

    expect(panel.componentInstance._hasSpacing()).toBe(false);
    expect(styles.marginTop).toBe('13px');
    expect(styles.marginBottom).toBe('13px');
    expect(styles.marginLeft).toBe('37px');
    expect(styles.marginRight).toBe('37px');

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    styles = getComputedStyle(panel.nativeElement);

    expect(panel.componentInstance._hasSpacing()).toBe(false);
    expect(styles.marginTop).toBe('13px');
    expect(styles.marginBottom).toBe('13px');
    expect(styles.marginLeft).toBe('37px');
    expect(styles.marginRight).toBe('37px');
  }));

  it('should be able to hide the toggle', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const header = fixture.debugElement.query(By.css('.mat-expansion-panel-header')).nativeElement;

    fixture.detectChanges();

    expect(header.querySelector('.mat-expansion-indicator'))
        .toBeTruthy('Expected indicator to be shown.');

    fixture.componentInstance.hideToggle = true;
    fixture.detectChanges();

    expect(header.querySelector('.mat-expansion-indicator'))
        .toBeFalsy('Expected indicator to be hidden.');
  });

  it('should update the indicator rotation when the expanded state is toggled programmatically',
    fakeAsync(() => {
      const fixture = TestBed.createComponent(PanelWithContent);

      fixture.detectChanges();
      tick(250);

      const arrow = fixture.debugElement.query(By.css('.mat-expansion-indicator')).nativeElement;

      expect(arrow.style.transform).toBe('rotate(0deg)', 'Expected no rotation.');

      fixture.componentInstance.expanded = true;
      fixture.detectChanges();
      tick(250);

      expect(arrow.style.transform).toBe('rotate(180deg)', 'Expected 180 degree rotation.');
    }));
});


@Component({
  template: `
  <md-expansion-panel [expanded]="expanded"
                      [hideToggle]="hideToggle"
                      (opened)="openCallback()"
                      (closed)="closeCallback()">
    <md-expansion-panel-header>Panel Title</md-expansion-panel-header>
    <p>Some content</p>
    <button>I am a button</button>
  </md-expansion-panel>`
})
class PanelWithContent {
  expanded: boolean = false;
  hideToggle: boolean = false;
  openCallback = jasmine.createSpy('openCallback');
  closeCallback = jasmine.createSpy('closeCallback');
}


@Component({
  styles: [
    `md-expansion-panel {
      margin: 13px 37px;
    }`
  ],
  template: `
  <md-expansion-panel [expanded]="expanded">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores officia, aliquam dicta
    corrupti maxime voluptate accusamus impedit atque incidunt pariatur.
  </md-expansion-panel>`
})
class PanelWithCustomMargin {
  expanded: boolean = false;
}
