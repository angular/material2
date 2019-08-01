/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Keyboard keys that do not result in input characters. */
import {ModifierKeys} from '@angular/cdk/testing';

export enum TestKey {
  BACKSPACE,
  TAB,
  ENTER,
  SHIFT,
  CONTROL,
  ALT,
  ESCAPE,
  PAGE_UP,
  PAGE_DOWN,
  END,
  HOME,
  LEFT_ARROW,
  UP_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  INSERT,
  DELETE,
  F1,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F10,
  F11,
  F12,
  META
}

/**
 * This acts as a common interface for DOM elements across both unit and e2e tests. It is the
 * interface through which the ComponentHarness interacts with the component's DOM.
 */
export interface TestElement {
  /** Blur the element. */
  blur(): Promise<void>;

  /** Clear the element's input (for input elements only). */
  clear(): Promise<void>;

  /** Click the element. */
  click(): Promise<void>;

  /** Focus the element. */
  focus(): Promise<void>;

  /** Get the computed value of the given CSS property for the element. */
  getCssValue(property: string): Promise<string>;

  /** Hovers the mouse over the element. */
  hover(): Promise<void>;

  /**
   * Sends the given string to the input as a series of key presses. Also fires input events
   * and attempts to add the string to the Element's value.
   */
  sendKeys(...keys: (string | TestKey)[]): Promise<void>;

  /**
   * Sends the given string to the input as a series of key presses. Also fires input events
   * and attempts to add the string to the Element's value.
   */
  sendKeys(modifiers: ModifierKeys, ...keys: (string | TestKey)[]): Promise<void>;

  /** Gets the text from the element. */
  text(): Promise<string>;

  /**
   * Gets the value for the given attribute from the element. If the attribute does not exist,
   * falls back to reading the property.
   */
  getAttribute(name: string): Promise<string | null>;

  /** Checks whether the element has the given class. */
  hasClass(name: string): Promise<boolean>;
}
