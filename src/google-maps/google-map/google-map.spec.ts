import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {createMapConstructorSpy, createMapSpy} from './testing/fake-google-map-utils';
import {GoogleMap, GoogleMapModule} from './index';

const DEFAULT_OPTIONS: google.maps.MapOptions = {
  center: {lat: 50, lng: 50},
  zoom: 4,
};

describe('GoogleMap', () => {
  let mapConstructorSpy: jasmine.Spy;
  let mapSpy: jasmine.SpyObj<google.maps.Map>;

  beforeEach(async(() => {
    mapSpy = createMapSpy(DEFAULT_OPTIONS);
    mapConstructorSpy = createMapConstructorSpy(mapSpy);

    TestBed.configureTestingModule({
      imports: [GoogleMapModule],
      declarations: [TestApp],
    });
  }));

  beforeEach(() => {
    TestBed.compileComponents();
  });

  it('initializes a Google map', () => {
    const fixture = TestBed.createComponent(TestApp);
    const container = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();

    expect(mapConstructorSpy).toHaveBeenCalledWith(container.nativeElement, DEFAULT_OPTIONS);
  });
});

@Component({
  selector: 'test-app',
  template: `<google-map></google-map>`,
})
class TestApp {}
