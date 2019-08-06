import {Directive, EventEmitter, Input, Output} from '@angular/core';

import {Clipboard} from './clipboard';

/**
 * Provides behavior for a button that when clicked copies content into user's
 * clipboard.
 *
 * Example usage:
 *
 * <button copyToClipboard="Content to be copied">Copy me!</button>
 */
@Directive({
  selector: '[copyToClipboard]',
  host: {
    '(click)': 'doCopy()',
  }
})
export class CopyToClipboard {
  /** Content to be copied. */
  @Input('copyToClipboard') text = '';

  @Output() copied = new EventEmitter<boolean>();

  constructor(private readonly clipboard: Clipboard) {}

  doCopy() {
    this.copied.emit(this.clipboard.copy(this.text));
  }
}
