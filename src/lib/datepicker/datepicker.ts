import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {Overlay} from '../core/overlay/overlay';
import {OverlayRef} from '../core/overlay/overlay-ref';
import {ComponentPortal} from '../core/portal/portal';
import {OverlayState} from '../core/overlay/overlay-state';
import {Dir} from '../core/rtl/dir';
import {MdError} from '../core/errors/error';
import {MdDialog} from '../dialog/dialog';
import {MdDialogRef} from '../dialog/dialog-ref';
import {PositionStrategy} from '../core/overlay/position/position-strategy';
import {
  OriginConnectionPosition,
  OverlayConnectionPosition
} from '../core/overlay/position/connected-position';
import {SimpleDate} from '../core/datetime/simple-date';
import {MdDatepickerInput} from './datepicker-input';
import {CalendarLocale} from '../core/datetime/calendar-locale';
import 'rxjs/add/operator/first';
import {Subscription} from 'rxjs/Subscription';
import {MdDialogConfig} from '../dialog/dialog-config';


/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;


/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-internal
 */
@Component({
  moduleId: module.id,
  selector: 'md-datepicker-content',
  templateUrl: 'datepicker-content.html',
  styleUrls: ['datepicker-content.css'],
  host: {
    '[class.mat-datepicker-content]': 'true',
    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
    '[class.mat-datepicker-content-non-touch]': '!datepicker.touchUi',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDatepickerContent implements AfterContentInit {
  datepicker: MdDatepicker;

  constructor(private _elementRef: ElementRef) {}

  ngAfterContentInit() {
    this._elementRef.nativeElement.querySelector('.mat-calendar-body').focus();
  }
}


// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="mdDatepicker"). We can change this to a directive if
// angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
  moduleId: module.id,
  selector: 'md-datepicker, mat-datepicker',
  template: '',
})
export class MdDatepicker implements OnDestroy {
  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): SimpleDate {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    if (this._startAt) {
      return this._startAt;
    }
    if (this._datepickerInput) {
      return this._datepickerInput.value;
    }
    return null;
  }
  set startAt(date: SimpleDate) { this._startAt = this._locale.parseDate(date); }
  private _startAt: SimpleDate;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  touchUi = false;

  /** A function used to filter which dates are selectable. */
  @Input()
  dateFilter: (date: SimpleDate) => boolean;

  /** Emits new selected date when selected date changes. */
  @Output() selectedChanged = new EventEmitter<SimpleDate>();

  /** Whether the calendar is open. */
  opened = false;

  /** The id for the datepicker calendar. */
  id = `md-datepicker-${datepickerUid++}`;

  /** The currently selected date. */
  _selected: SimpleDate = null;

  /** The minimum selectable date. */
  get _minDate(): SimpleDate {
    return this._datepickerInput && this._datepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): SimpleDate {
    return this._datepickerInput && this._datepickerInput.max;
  }

  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: MdDialogRef<any>;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<MdDatepickerContent>;

  /** The input element this datepicker is associated with. */
  private _datepickerInput: MdDatepickerInput;

  private _inputSubscription: Subscription;

  constructor(private _dialog: MdDialog, private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef, private _locale: CalendarLocale,
              @Optional() private _dir: Dir) {}

  ngOnDestroy() {
    this.close();
    if (this._popupRef) {
      this._popupRef.dispose();
    }
    if (this._inputSubscription) {
      this._inputSubscription.unsubscribe();
    }
  }

  /** Selects the given date and closes the currently open popup or dialog. */
  _selectAndClose(date: SimpleDate): void {
    let oldValue = this._selected;
    this._selected = date;
    if (!SimpleDate.equals(oldValue, this._selected)) {
      this.selectedChanged.emit(date);
    }
    this.close();
  }

  /**
   * Register an input with this datepicker.
   * @param inputElementRef An ElementRef for the input.
   */
  _registerInput(input: MdDatepickerInput): void {
    if (this._datepickerInput) {
      throw new MdError('An MdDatepicker can only be associated with a single input.');
    }
    this._datepickerInput = input;
    this._inputSubscription =
        this._datepickerInput._valueChange.subscribe((value: SimpleDate) => this._selected = value);
  }

  /**
   * Open the calendar.
   * @param touchUi Whether to use the touch UI.
   */
  open(): void {
    if (this.opened) {
      return;
    }
    if (!this._datepickerInput) {
      throw new MdError('Attempted to open an MdDatepicker with no associated input.');
    }

    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this.opened = true;
  }

  /** Close the calendar. */
  close(): void {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }
    this.opened = false;
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    let config = new MdDialogConfig();
    config.viewContainerRef = this._viewContainerRef;
    config.containerClass = 'mat-datepicker-content-dialog';

    this._dialogRef = this._dialog.open(MdDatepickerContent, config);
    this._dialogRef.afterClosed().first().subscribe(() => this.close());
    this._dialogRef.componentInstance.datepicker = this;
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal(MdDatepickerContent, this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      let componentRef: ComponentRef<MdDatepickerContent> =
          this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datepicker = this;
    }

    this._popupRef.backdropClick().first().subscribe(() => this.close());
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayState = new OverlayState();
    overlayState.positionStrategy = this._createPopupPositionStrategy();
    overlayState.hasBackdrop = true;
    overlayState.backdropClass = 'md-overlay-transparent-backdrop';
    overlayState.direction = this._dir ? this._dir.value : 'ltr';

    this._popupRef = this._overlay.create(overlayState);
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    let origin = {originX: 'start', originY: 'bottom'} as OriginConnectionPosition;
    let overlay = {overlayX: 'start', overlayY: 'top'} as OverlayConnectionPosition;
    return this._overlay.position().connectedTo(
        this._datepickerInput.getPopupConnectionElementRef(), origin, overlay);
  }
}
