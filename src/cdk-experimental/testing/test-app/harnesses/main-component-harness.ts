import {ComponentHarness, TestElement} from '../../component-harness';
import {SubComponentHarness} from './sub-component-harness';

export class MainComponentHarness extends ComponentHarness {
  readonly title = this.find('h1');
  readonly asyncCounter = this.find('#asyncCounter');
  readonly counter = this.find('#counter');
  readonly input = this.find('#input');
  readonly value = this.find('#value');
  readonly allLabels = this.findAll('label');
  readonly allLists = this.findAll(SubComponentHarness, 'sub');
  readonly memo = this.find('textarea');
  // Allow null for element
  readonly nullItem = this.find('wrong locator', {allowNull: true});
  // Allow null for component harness
  readonly nullComponentHarness =
    this.find(SubComponentHarness, 'wrong locator', {allowNull: true});
  readonly errorItem = this.find('wrong locator', {allowNull: false});

  readonly globalEl = this.find('.sibling', {global: true});
  readonly errorGlobalEl =
    this.find('wrong locator', {global: true, allowNull: false});
  readonly nullGlobalEl =
    this.find('wrong locator', {global: true, allowNull: true});

  private button = this.find('button');
  private testTools = this.find(SubComponentHarness, 'sub');

  async increaseCounter(times: number) {
    const button = await this.button();
    for (let i = 0; i < times; i++) {
      await button.click();
    }
  }

  async getTestTool(index: number): Promise<TestElement> {
    const subComponent = await this.testTools();
    return subComponent.getItem(index);
  }

  async getTestTools(): Promise<TestElement[]> {
    const subComponent = await this.testTools();
    return subComponent.getItems();
  }
}
