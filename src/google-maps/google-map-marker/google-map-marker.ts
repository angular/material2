import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

export const DEFAULT_OPTIONS = {
  position: { lat: 37.421995, lng: -122.084092 },
};

/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/marker
 */
@Component({
  selector: 'google-map-marker',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleMapMarker implements OnInit, OnDestroy {
  @Input() set options(options: google.maps.MarkerOptions) {
    this._options.next(options || DEFAULT_OPTIONS);
  }

  @Input() set title(title: string) {
    this._title.next(title);
  }

  @Input() set position(position: google.maps.LatLngLiteral) {
    this._position.next(position);
  }

  @Input() set label(label: string|google.maps.MarkerLabel) {
    this._label.next(label);
  }

  @Input() set clickable(clickable: boolean) {
    this._clickable.next(clickable);
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
   */
  @Output() animationChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
   */
  @Output() mapClick = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
   */
  @Output() clickableChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
   */
  @Output() cursorChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
   */
  @Output() mapDblclick = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
   */
  @Output() mapDrag = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
   */
  @Output() mapDragend = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
   */
  @Output() draggableChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
   */
  @Output() mapDragstart = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
   */
  @Output() flatChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
   */
  @Output() iconChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
   */
  @Output() mapMousedown = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
   */
  @Output() mapMouseout = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
   */
  @Output() mapMouseover = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
   */
  @Output() mapMouseup = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
   */
  @Output() positionChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
   */
  @Output() mapRightclick = new EventEmitter<google.maps.MouseEvent>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
   */
  @Output() shapeChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
   */
  @Output() titleChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
   */
  @Output() visibleChanged = new EventEmitter<void>();

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
   */
  @Output() zindexChanged = new EventEmitter<void>();

  private readonly _options = new BehaviorSubject<google.maps.MarkerOptions>(DEFAULT_OPTIONS);
  private readonly _title = new BehaviorSubject<string|undefined>(undefined);
  private readonly _position = new BehaviorSubject<google.maps.LatLngLiteral|undefined>(undefined);
  private readonly _label = new BehaviorSubject<string|google.maps.MarkerLabel|undefined>(undefined);
  private readonly _clickable = new BehaviorSubject<boolean>(true);

  private readonly _map = new ReplaySubject<google.maps.Map>(1);

  private readonly _destroy = new Subject<void>();

  private readonly _listeners: google.maps.MapsEventListener[] = [];

  private _marker?: google.maps.Marker;
  private _hasMap = false;

  ngOnInit() {
    const combinedOptionsChanges = this._combineOptions();

    combineLatest(this._map, combinedOptionsChanges).pipe(takeUntil(this._destroy)).subscribe(([map, options]) => {
      if (this._marker) {
        this._marker.setOptions(options);
      } else {
        this._marker = new google.maps.Marker(options);
        this._marker.setMap(map);
        this._initializeEventHandlers();
      }
    });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    for (let listener of this._listeners) {
      listener.remove();
    }
    if (this._marker) {
      this._marker.setMap(null);
    }
  }

  setMap(map: google.maps.Map) {
    if (!this._hasMap) {
      this._map.next(map);
      this._hasMap = true;
    }
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
   */
  getAnimation(): google.maps.Animation|null {
    return this._marker!.getAnimation() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
   */
  getClickable(): boolean {
    return this._marker!.getClickable();
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
   */
  getCursor(): string|null {
    return this._marker!.getCursor() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
   */
  getDraggable(): boolean {
    return !!this._marker!.getDraggable();
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
   */
  getIcon(): string|google.maps.Icon|google.maps.Symbol|null {
    return this._marker!.getIcon() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
   */
  getLabel(): google.maps.MarkerLabel|null {
    return this._marker!.getLabel() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
   */
  getOpacity(): number|null {
    return this._marker!.getOpacity() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
   */
  getPosition(): google.maps.LatLng|null {
    return this._marker!.getPosition() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
   */
  getShape(): google.maps.MarkerShape|null {
    return this._marker!.getShape() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
   */
  getTitle(): string|null {
    return this._marker!.getTitle() || null;
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
   */
  getVisible(): boolean {
    return this._marker!.getVisible();
  }

  /**
   * See
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
   */
  getZIndex(): number|null {
    return this._marker!.getZIndex() || null;
  }

  private _combineOptions(): Observable<google.maps.MarkerOptions> {
    return combineLatest(this._options, this._title, this._position, this._label, this._clickable, this._map)
      .pipe(map(([options, title, position, label, clickable, map]) => {
        const combinedOptions: google.maps.MarkerOptions = {
          ...options,
          title: title || options.title,
          position: position || options.position,
          label: label || options.label,
          clickable: clickable || options.clickable,
          map: map || null,
        };
        return combinedOptions;
      }));
  }

  private _initializeEventHandlers() {
    const eventHandlers = new Map<string, EventEmitter<void>>([
      ['animation_changed', this.animationChanged],
      ['clickable_changed', this.clickableChanged],
      ['cursor_changed', this.cursorChanged],
      ['draggable_changed', this.draggableChanged],
      ['flat_changed', this.flatChanged],
      ['icon_changed', this.iconChanged],
      ['position_changed', this.positionChanged],
      ['shape_changed', this.shapeChanged],
      ['title_changed', this.titleChanged],
      ['visible_changed', this.visibleChanged],
      ['zindex_changed', this.zindexChanged],
    ]);
    const mouseEventHandlers = new Map<string, EventEmitter<google.maps.MouseEvent>>([
      ['click', this.mapClick],
      ['dblclick', this.mapDblclick],
      ['drag', this.mapDrag],
      ['dragend', this.mapDragend],
      ['dragstart', this.mapDragstart],
      ['mousedown', this.mapMousedown],
      ['mouseout', this.mapMouseout],
      ['mouseover', this.mapMouseover],
      ['mouseup', this.mapMouseup],
      ['rightclick', this.mapRightclick],
    ]);

    eventHandlers.forEach((eventHandler: EventEmitter<void>, name: string) => {
      if (eventHandler.observers.length > 0) {
        this._listeners.push(this._marker!.addListener(name, () => {
          eventHandler.emit();
        }));
      }
    });
    mouseEventHandlers.forEach((eventHandler: EventEmitter<google.maps.MouseEvent>, name: string) => {
      if (eventHandler.observers.length > 0) {
        this._listeners.push(this._marker!.addListener(name, (event: google.maps.MouseEvent) => {
          eventHandler.emit(event);
        }));
      }
    });
  }
}
