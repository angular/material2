import {Component, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {InteractivityChecker} from './interactivity-checker';


/**
 * Directive for trapping focus within a region.
 *
 * NOTE: This directive currently uses a very simple (naive) approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like tabIndex > 0, flex `order`, and shadow roots can cause to two to misalign.
 * This will be replaced with a more intelligent solution before the library is considered stable.
 */
@Component({
  moduleId: module.id,
  selector: 'focus-trap',
  // TODO(jelbourn): move this to a separate file.
  template: `
  <div tabindex="0" (focus)="reverseWrapFocus()"></div>
  <div #trappedContent><ng-content></ng-content></div>
  <div tabindex="0" (focus)="wrapFocus()"></div>`,
  encapsulation: ViewEncapsulation.None,
})
export class FocusTrap {
  @ViewChild('trappedContent') trappedContent: ElementRef;

  constructor(private _checker: InteractivityChecker) { }

  /** Wrap focus from the end of the trapped region to the beginning. */
  wrapFocus() {
    let redirectToElement = this._getFirstTabbableElement(this.trappedContent.nativeElement);
    if (redirectToElement) {
      redirectToElement.focus();
    }
  }

  /** Wrap focus from the beginning of the trapped region to the end. */
  reverseWrapFocus() {
    let redirectToElement = this._getLastTabbableElement(this.trappedContent.nativeElement);
    if (redirectToElement) {
      redirectToElement.focus();
    }
  }

  /** Get the first tabbable element from a DOM subtree (inclusive). */
  private _getFirstTabbableElement(root: HTMLElement): HTMLElement {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }

    // Iterate in DOM order.
    let childCount = root.children.length;
    for (let i = 0; i < childCount; i++) {
      let tabbableChild = this._getFirstTabbableElement(root.children[i] as HTMLElement);
      if (tabbableChild) {
        return tabbableChild;
      }
    }

    return null;
  }

  /** Get the last tabbable element from a DOM subtree (inclusive). */
  private _getLastTabbableElement(root: HTMLElement): HTMLElement {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }

    // Iterate in reverse DOM order.
    for (let i = root.children.length - 1; i >= 0; i--) {
      let tabbableChild = this._getLastTabbableElement(root.children[i] as HTMLElement);
      if (tabbableChild) {
        return tabbableChild;
      }
    }

    return null;
  }
}
