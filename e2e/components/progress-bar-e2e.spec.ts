import {browser} from 'protractor';
import {expectToExist} from '../../src/e2e-app/test-util/index';

describe('progress-bar', () => {
  beforeEach(async () => await browser.get('/progress-bar'));

  it('should render a determinate progress bar', async () => {
    await expectToExist('mat-progress-bar[mode="determinate"]');
  });

  it('should render a buffer progress bar', async () => {
    await expectToExist('mat-progress-bar[mode="buffer"]');
  });

  it('should render a query progress bar', async () => {
    await expectToExist('mat-progress-bar[mode="query"]');
  });

  it('should render a indeterminate progress bar', async () => {
    await expectToExist('mat-progress-bar[mode="indeterminate"]');
  });
});
