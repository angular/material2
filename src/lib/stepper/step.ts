/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal, PortalHostDirective} from '../core';

@Component({
    moduleId: module.id,
    selector: 'mat-step',
    templateUrl: '',
})
export class MdStep {

    // @ViewChild(TemplateRef) _content: TemplateRef<any>;
    // @ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;

    @Input()
    get active() { return this._active; }
    set active(value: boolean) {
        this._active = value;
    }
    private _active: boolean;

    @Input()
    label: string;

    @Input()
    get completed() { return this._completed; }
    set completed(value: boolean) {
        this._completed = value;
    }
    private _completed: boolean = false;

    isLast: boolean = false;

    // /** The portal that will be the hosted content of the step */
    // private _contentPortal: TemplatePortal | null = null;
    // get content(): TemplatePortal | null { return this._contentPortal; }

    // constructor(private _viewContainerRef: ViewContainerRef) {}


}
