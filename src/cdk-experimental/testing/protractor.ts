/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// TODO(mmalerba): Should this file be part of `@angular/cdk-experimental/testing` or a separate
//  package? It depends on protractor which we don't want to put in the deps for cdk-experimental.

import {browser, by, element as protractorElement, ElementFinder} from 'protractor';

import {
  ComponentHarness,
  ComponentHarnessType,
  Locator,
  Options,
  TestElement
} from './component-harness';

/**
 * Component harness factory for protractor.
 * The function will not try to fetch the host element of harness at once, which
 * is for performance purpose; however, this is the most common way to load
 * protractor harness. If you do care whether the host element is present when
 * loading harness, using the load function that accepts extra searching
 * options.
 * @param componentHarness: Type of user defined harness.
 * @param rootSelector: Optional. CSS selector to specify the root of component.
 * Set to 'body' by default
 */
export async function load<T extends ComponentHarness>(
    componentHarness: ComponentHarnessType<T>,
    rootSelector: string): Promise<T>;

/**
 * Component harness factory for protractor.
 * @param componentHarness: Type of user defined harness.
 * @param rootSelector: Optional. CSS selector to specify the root of component.
 * Set to 'body' by default.
 * @param options Optional. Extra searching options
 */
export async function load<T extends ComponentHarness>(
    componentHarness: ComponentHarnessType<T>, rootSelector?: string,
    options?: Options): Promise<T|null>;

export async function load<T extends ComponentHarness>(
    componentHarness: ComponentHarnessType<T>, rootSelector = 'body',
    options?: Options): Promise<T|null> {
  const root = await getElement(rootSelector, undefined, options);
  return root && new componentHarness(new ProtractorLocator(root));
}

/**
 * Gets the corresponding ElementFinder for the root of a TestElement.
 */
export function getElementFinder(testElement: TestElement): ElementFinder {
  if (testElement instanceof ProtractorElement) {
    return testElement.element;
  }

  throw new Error('Invalid element provided');
}

class ProtractorLocator implements Locator {
  private readonly _root: ProtractorElement;

  constructor(private _rootFinder: ElementFinder) {
    this._root = new ProtractorElement(this._rootFinder);
  }

  host(): TestElement {
    return this._root;
  }

  async querySelector(selector: string, options?: Options): Promise<TestElement|null> {
    const finder = await getElement(selector, this._rootFinder, options);
    return finder && new ProtractorElement(finder);
  }

  async querySelectorAll(selector: string): Promise<TestElement[]> {
    const elementFinders = this._rootFinder.all(by.css(selector));
    const res: TestElement[] = [];
    await elementFinders.each(el => {
      if (el) {
        res.push(new ProtractorElement(el));
      }
    });
    return res;
  }

  async load<T extends ComponentHarness>(
      componentHarness: ComponentHarnessType<T>, selector: string,
      options?: Options): Promise<T|null> {
    const root = await getElement(selector, this._rootFinder, options);
    return root && new componentHarness(new ProtractorLocator(root));
  }

  async loadAll<T extends ComponentHarness>(
      componentHarness: ComponentHarnessType<T>,
      rootSelector: string): Promise<T[]> {
    const roots = this._rootFinder.all(by.css(rootSelector));
    const res: T[] = [];
    await roots.each(el => {
      if (el) {
        const locator = new ProtractorLocator(el);
        res.push(new componentHarness(locator));
      }
    });
    return res;
  }
}

class ProtractorElement implements TestElement {
  constructor(readonly element: ElementFinder) {}

  async blur(): Promise<void> {
    return this.element['blur']();
  }

  async clear(): Promise<void> {
    return this.element.clear();
  }

  async click(): Promise<void> {
    return this.element.click();
  }

  async focus(): Promise<void> {
    return this.element['focus']();
  }

  async getCssValue(property: string): Promise<string> {
    return this.element.getCssValue(property);
  }

  async hover(): Promise<void> {
    return browser.actions()
        .mouseMove(await this.element.getWebElement())
        .perform();
  }

  async sendKeys(keys: string): Promise<void> {
    return this.element.sendKeys(keys);
  }

  async text(): Promise<string> {
    return this.element.getText();
  }

  async getAttribute(name: string): Promise<string|null> {
    return this.element.getAttribute(name);
  }
}

/**
 * Get an element finder based on the CSS selector and root element.
 * Note that it will check whether the element is present only when
 * Options.allowNull is set. This is for performance purpose.
 * @param selector The CSS selector
 * @param root Optional Search element under the root element. If not set,
 * search element globally. If options.global is set, root is ignored.
 * @param options Optional, extra searching options
 */
async function getElement(selector: string, root?: ElementFinder, options?: Options):
  Promise<ElementFinder|null> {
  const useGlobalRoot = options && !!options.global;
  const elem = root === undefined || useGlobalRoot ?
      protractorElement(by.css(selector)) : root.element(by.css(selector));
  const allowNull = options !== undefined && options.allowNull !== undefined ?
      options.allowNull : undefined;
  if (allowNull !== undefined && !(await elem.isPresent())) {
    if (allowNull) {
      return null;
    }
    throw new Error('Cannot find element based on the CSS selector: ' + selector);
  }
  return elem;
}
