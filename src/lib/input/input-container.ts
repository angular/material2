/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  Renderer2,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {coerceBooleanProperty, Platform} from '../core';
import {FormControl, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {getSupportedInputTypes} from '../core/platform/features';
import {
  getMdFormFieldDuplicatedHintError,
  getMdFormFieldMissingControlError,
  getMdFormFieldPlaceholderConflictError,
  getMdInputUnsupportedTypeError
} from './input-container-errors';
import {
  FloatPlaceholderType,
  MD_PLACEHOLDER_GLOBAL_OPTIONS,
  PlaceholderOptions
} from '../core/placeholder/placeholder-options';
import {
  defaultErrorStateMatcher,
  ErrorOptions,
  ErrorStateMatcher,
  MD_ERROR_GLOBAL_OPTIONS
} from '../core/error/error-options';
import {Subject} from 'rxjs/Subject';
import {startWith} from '@angular/cdk/rxjs';
import {Observable} from 'rxjs/Observable';

// Invalid input type. Using one of these will throw an MdInputUnsupportedTypeError.
const MD_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
];

let nextUniqueId = 0;


/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
@Directive({
  selector: 'md-placeholder, mat-placeholder'
})
export class MdPlaceholder {}


/** Hint text to be shown underneath the form field control. */
@Directive({
  selector: 'md-hint, mat-hint',
  host: {
    'class': 'mat-hint',
    '[class.mat-right]': 'align == "end"',
    '[attr.id]': 'id',
  }
})
export class MdHint {
  /** Whether to align the hint label at the start or end of the line. */
  @Input() align: 'start' | 'end' = 'start';

  /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
  @Input() id: string = `md-hint-${nextUniqueId++}`;
}


/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'md-error, mat-error',
  host: {
    'class': 'mat-error',
    'role': 'alert',
    '[attr.id]': 'id',
  }
})
export class MdError {
  @Input() id: string = `md-error-${nextUniqueId++}`;
}


/** Prefix to be placed the the front of the form field. */
@Directive({
  selector: '[mdPrefix], [matPrefix]',
})
export class MdPrefix {}


/** Suffix to be placed at the end of the form field. */
@Directive({
  selector: '[mdSuffix], [matSuffix]',
})
export class MdSuffix {}


/** An interface which allows a control to work inside of a `MdFormField`. */
export abstract class MdFormFieldControl {
  /**
   * Stream that emits whenever the state of the control changes such that the parent `MdFormField`
   * needs to run change detection.
   */
  stateChanges: Observable<void>;

  /** Gets the element ID for this control. */
  abstract getId(): string;

  /** Gets the placeholder for this control. */
  abstract getPlaceholder(): string;

  /** Gets the NgControl for this control. */
  abstract getNgControl(): NgControl | null;

  /** Whether the control is focused. */
  abstract isFocused(): boolean;

  /** Whether the control is empty. */
  abstract isEmpty(): boolean;

  /** Whether the control is required. */
  abstract isRequired(): boolean;

  /** Whether the control is disabled. */
  abstract isDisabled(): boolean;

  /** Whether the control is in an error state. */
  abstract isErrorState(): boolean;

  /** Sets the list of element IDs that currently describe this control. */
  abstract setDescribedByIds(ids: string[]): void;

  /** Focuses this control. */
  abstract focus(): void;
}


/** Directive that allows a native input to work inside a `MdFormField`. */
@Directive({
  selector: `input[mdInput], textarea[mdInput], input[matInput], textarea[matInput]`,
  host: {
    'class': 'mat-input-element',
    // Native input properties that are overwritten by Angular inputs need to be synced with
    // the native input element. Otherwise property bindings for those don't work.
    '[id]': 'id',
    '[placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-invalid]': '_isErrorState',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(input)': '_onInput()',
  },
  providers: [{provide: MdFormFieldControl, useExisting: MdInput}],
})
export class MdInput implements MdFormFieldControl, OnChanges, OnDestroy, DoCheck {
  /** Variables used as cache for getters and setters. */
  private _type = 'text';
  private _disabled = false;
  private _required = false;
  private _id: string;
  private _uid = `md-input-${nextUniqueId++}`;
  private _errorOptions: ErrorOptions;
  private _previousNativeValue = this.value;
  private _focused = false;
  private _isErrorState = false;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  /**
   * Stream that emits whenever the state of the input changes such that the wrapping `MdFormField`
   * needs to run change detection.
   */
  stateChanges = new Subject<void>();

  /** Whether the element is disabled. */
  @Input()
  get disabled() { return this._ngControl ? this._ngControl.disabled : this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  /** Unique id of the element. */
  @Input()
  get id() { return this._id; }
  set id(value: string) { this._id = value || this._uid; }

  /** Placeholder attribute of the element. */
  @Input() placeholder: string = '';

  /** Whether the element is required. */
  @Input()
  get required() { return this._required; }
  set required(value: any) { this._required = coerceBooleanProperty(value); }

  /** Input type of the element. */
  @Input()
  get type() { return this._type; }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      this._renderer.setProperty(this._elementRef.nativeElement, 'type', this._type);
    }
  }

  /** A function used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** The input element's value. */
  get value() { return this._elementRef.nativeElement.value; }
  set value(value: string) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this.stateChanges.next();
    }
  }

  private _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week'
  ].filter(t => getSupportedInputTypes().has(t));

  constructor(private _elementRef: ElementRef,
              private _renderer: Renderer2,
              private _platform: Platform,
              @Optional() @Self() public _ngControl: NgControl,
              @Optional() private _parentForm: NgForm,
              @Optional() private _parentFormGroup: FormGroupDirective,
              @Optional() @Inject(MD_ERROR_GLOBAL_OPTIONS) errorOptions: ErrorOptions) {

    // Force setter to be called in case id was not specified.
    this.id = this.id;
    this._errorOptions = errorOptions ? errorOptions : {};
    this.errorStateMatcher = this._errorOptions.errorStateMatcher || defaultErrorStateMatcher;

    // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
    // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
    // exists on iOS, we only bother to install the listener on iOS.
    if (_platform.IOS) {
      _renderer.listen(_elementRef.nativeElement, 'keyup', (event: Event) => {
        let el = event.target as HTMLInputElement;
        if (!el.value && !el.selectionStart && !el.selectionEnd) {
          // Note: Just setting `0, 0` doesn't fix the issue. Setting `1, 1` fixes it for the first
          // time that you type text and then hold delete. Toggling to `1, 1` and then back to
          // `0, 0` seems to completely fix it.
          el.setSelectionRange(1, 1);
          el.setSelectionRange(0, 0);
        }
      });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if (this._ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this._updateErrorState();
    } else {
      // When the input isn't used together with `@angular/forms`, we need to check manually for
      // changes to the native `value` property in order to update the floating label.
      this._dirtyCheckNativeValue();
    }
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this._focused) {
      this._focused = isFocused;
      this.stateChanges.next();
    }
  }

  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }

  /** Re-evaluates the error state. This is only relevant with @angular/forms. */
  private _updateErrorState() {
    const oldState = this._isErrorState;
    const ngControl = this._ngControl;
    const parent = this._parentFormGroup || this._parentForm;
    const newState = ngControl && this.errorStateMatcher(ngControl.control as FormControl, parent);

    if (newState !== oldState) {
      this._isErrorState = newState;
      this.stateChanges.next();
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  private _dirtyCheckNativeValue() {
    const newValue = this.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Make sure the input is a supported type. */
  private _validateType() {
    if (MD_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw getMdInputUnsupportedTypeError(this._type);
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  private _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  private _isBadInput() {
    // The `validity` property won't be present on platform-server.
    let validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  /** Determines if the component host is a textarea. If not recognizable it returns false. */
  private _isTextarea() {
    let nativeElement = this._elementRef.nativeElement;

    // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
    // Note that this shouldn't be necessary once Angular switches to an API that resembles the
    // DOM closer.
    let nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
    return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
  }

  // Implemented as part of MdFormFieldControl.
  getId(): string { return this.id; }

  // Implemented as part of MdFormFieldControl.
  getPlaceholder(): string { return this.placeholder; }

  // Implemented as part of MdFormFieldControl.
  getNgControl(): NgControl | null { return this._ngControl; }

  // Implemented as part of MdFormFieldControl.
  isFocused(): boolean { return this._focused; }

  // Implemented as part of MdFormFieldControl.
  isEmpty(): boolean {
    return !this._isNeverEmpty() &&
        (this.value == null || this.value === '') &&
        // Check if the input contains bad input. If so, we know that it only appears empty because
        // the value failed to parse. From the user's perspective it is not empty.
        // TODO(mmalerba): Add e2e test for bad input case.
        !this._isBadInput();
  }

  // Implemented as part of MdFormFieldControl.
  isRequired(): boolean { return this.required; }

  // Implemented as part of MdFormFieldControl.
  isDisabled(): boolean { return this.disabled; }

  // Implemented as part of MdFormFieldControl.
  isErrorState(): boolean { return this._isErrorState; }

  // Implemented as part of MdFormFieldControl.
  setDescribedByIds(ids: string[]) { this._ariaDescribedby = ids.join(' '); }

  // Implemented as part of MdFormFieldControl.
  focus() { this._elementRef.nativeElement.focus(); }
}


/** Container for form controls that applies Material Design styling and behavior. */
@Component({
  moduleId: module.id,
  selector: 'md-input-container, mat-input-container, md-form-field, mat-form-field',
  templateUrl: 'input-container.html',
  styleUrls: ['input-container.css'],
  animations: [
    trigger('transitionMessages', [
      state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
      transition('void => enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ]),
  ],
  host: {
    // Remove align attribute to prevent it from interfering with layout.
    '[attr.align]': 'null',
    'class': 'mat-input-container mat-form-field',
    '[class.mat-input-invalid]': '_control.isErrorState()',
    '[class.mat-form-field-invalid]': '_control.isErrorState()',
    '[class.mat-focused]': '_control.isFocused()',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
    '(click)': '_control.focus()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MdFormField implements AfterViewInit, AfterContentInit, AfterContentChecked {
  private _placeholderOptions: PlaceholderOptions;

  /** Color of the form field underline, based on the theme. */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  /** @deprecated Use `color` instead. */
  @Input()
  get dividerColor() { return this.color; }
  set dividerColor(value) { this.color = value; }

  /** Whether the required marker should be hidden. */
  @Input()
  get hideRequiredMarker() { return this._hideRequiredMarker; }
  set hideRequiredMarker(value: any) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  private _hideRequiredMarker: boolean;

  /** Whether the floating label should always float or not. */
  get _shouldAlwaysFloat() { return this._floatPlaceholder === 'always'; }

  /** Whether the placeholder can float or not. */
  get _canPlaceholderFloat() { return this._floatPlaceholder !== 'never'; }

  /** State of the md-hint and md-error animations. */
  _subscriptAnimationState: string = '';

  /** Text for the form field hint. */
  @Input()
  get hintLabel() { return this._hintLabel; }
  set hintLabel(value: string) {
    this._hintLabel = value;
    this._processHints();
  }
  private _hintLabel = '';

  // Unique id for the hint label.
  _hintLabelId: string = `md-hint-${nextUniqueId++}`;

  /** Whether the placeholder should always float, never float or float as the user types. */
  @Input()
  get floatPlaceholder() { return this._floatPlaceholder; }
  set floatPlaceholder(value: FloatPlaceholderType) {
    if (value !== this._floatPlaceholder) {
      this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
      this._changeDetectorRef.markForCheck();
    }
  }
  private _floatPlaceholder: FloatPlaceholderType;

  /** Reference to the form field's underline element. */
  @ViewChild('underline') underlineRef: ElementRef;
  @ViewChild('connectionContainer') _connectionContainerRef: ElementRef;
  @ContentChild(MdFormFieldControl) _control: MdFormFieldControl;
  @ContentChild(MdPlaceholder) _placeholderChild: MdPlaceholder;
  @ContentChildren(MdError) _errorChildren: QueryList<MdError>;
  @ContentChildren(MdHint) _hintChildren: QueryList<MdHint>;
  @ContentChildren(MdPrefix) _prefixChildren: QueryList<MdPrefix>;
  @ContentChildren(MdSuffix) _suffixChildren: QueryList<MdSuffix>;

  constructor(
    public _elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(MD_PLACEHOLDER_GLOBAL_OPTIONS) placeholderOptions: PlaceholderOptions) {
      this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
      this.floatPlaceholder = this._placeholderOptions.float || 'auto';
    }

  ngAfterContentInit() {
    this._validateControlChild();

    // Subscribe to changes in the child control state in order to update the form field UI.
    startWith.call(this._control.stateChanges, null).subscribe(() => {
      this._validatePlaceholders();
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    let ngControl = this._control.getNgControl();
    if (ngControl && ngControl.valueChanges) {
      ngControl.valueChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
    }

    // Re-validate when the number of hints changes.
    startWith.call(this._hintChildren.changes, null).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    startWith.call(this._errorChildren.changes, null).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked() {
    this._validateControlChild();
  }

  ngAfterViewInit() {
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }

  /** Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: string): boolean {
    let ngControl = this._control ? this._control.getNgControl : null;
    return ngControl && (ngControl as any)[prop];
  }

  /** Whether the form field has a placeholder. */
  _hasPlaceholder() {
    return !!(this._control.getPlaceholder() || this._placeholderChild);
  }

  /** Determines whether to display hints or errors. */
  _getDisplayedMessages(): 'error' | 'hint' {
    return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.isErrorState()) ? 'error' : 'hint';
  }

  /**
   * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
   * or child element with the `md-placeholder` directive).
   */
  private _validatePlaceholders() {
    if (this._control.getPlaceholder() && this._placeholderChild) {
      throw getMdFormFieldPlaceholderConflictError();
    }
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  private _validateHints() {
    if (this._hintChildren) {
      let startHint: MdHint;
      let endHint: MdHint;
      this._hintChildren.forEach((hint: MdHint) => {
        if (hint.align == 'start') {
          if (startHint || this.hintLabel) {
            throw getMdFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align == 'end') {
          if (endHint) {
            throw getMdFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      let ids: string[] = [];

      if (this._getDisplayedMessages() === 'hint') {
        let startHint = this._hintChildren ?
            this._hintChildren.find(hint => hint.align === 'start') : null;
        let endHint = this._hintChildren ?
            this._hintChildren.find(hint => hint.align === 'end') : null;

        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids = this._errorChildren.map(mdError => mdError.id);
      }

      this._control.setDescribedByIds(ids);
    }
  }

  /** Throws an error if the form field's control is missing. */
  protected _validateControlChild() {
    if (!this._control) {
      throw getMdFormFieldMissingControlError();
    }
  }
}
