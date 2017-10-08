/*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;

// The default time that jasmine waits for an asynchronous test to finish is five seconds.
// If this timeout is too short the CI may fail randomly because our asynchronous tests can
// take longer in some situations (e.g Saucelabs and Browserstack tunnels)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

__karma__.loaded = function () {};

var baseDir = '/base';
var specFiles = Object.keys(window.__karma__.files).filter(isMaterialSpecFile);

// Configure the base path and map the different node packages.
System.config({
  baseURL: baseDir,
  paths: {
    'node:*': 'node_modules/*'
  },
  map: {
    'rxjs': 'node:rxjs',
    'main': 'main.js',
    'moment': 'node:moment/min/moment-with-locales.min.js',

    // Angular specific mappings.
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/core/testing': 'node:@angular/core/bundles/core-testing.umd.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.js',
    '@angular/common/testing': 'node:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.js',
    '@angular/compiler/testing': 'node:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/http': 'node:@angular/http/bundles/http.umd.js',
    '@angular/http/testing': 'node:@angular/http/bundles/http-testing.umd.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.js',
    '@angular/forms/testing': 'node:@angular/forms/bundles/forms-testing.umd.js',
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser/animations':
      'node:@angular/platform-browser/bundles/platform-browser-animations.umd',
    '@angular/platform-browser':
      'node:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser/testing':
      'node:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic':
      'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/platform-browser-dynamic/testing':
      'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',

    // Angular material
    '@angular/material':
        'node:@angular/material/bundles/material.umd.js',
    '@angular/cdk':
        'node:@angular/cdk/bundles/cdk.umd.js',
    '@angular/cdk/bidi':
        'node:@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/platform':
        'node:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/collections':
        'node:@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/coercion':
        'node:@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/observers':
        'node:@angular/cdk/bundles/cdk-observers.umd.js',
    '@angular/cdk/keycodes':
        'node:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/a11y':
        'node:@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/overlay':
        'node:@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/portal':
        'node:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/rxjs':
        'node:@angular/cdk/bundles/cdk-rxjs.umd.js',
    '@angular/cdk/scrolling':
        'node:@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/stepper':
        'node:@angular/cdk/bundles/cdk-stepper.umd.js',
    '@angular/cdk/table':
        'node:@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/testing':
        'node:@angular/cdk/bundles/cdk-testing.umd.js',

    // Path mappings for local packages that can be imported inside of tests.
    // TODO(devversion): replace once the index.ts file for the Material package has been added.
    '@uiux/material': 'dist/packages/material/public-api.js',
    '@uiux/cdk': 'dist/packages/cdk/index.js',
    '@uiux/cdk/a11y': 'dist/packages/cdk/a11y/index.js',
    '@uiux/cdk/bidi': 'dist/packages/cdk/bidi/index.js',
    '@uiux/cdk/coercion': 'dist/packages/cdk/coercion/index.js',
    '@uiux/cdk/collections': 'dist/packages/cdk/collections/index.js',
    '@uiux/cdk/keycodes': 'dist/packages/cdk/keycodes/index.js',
    '@uiux/cdk/layout': 'dist/packages/cdk/layout/index.js',
    '@uiux/cdk/observers': 'dist/packages/cdk/observers/index.js',
    '@uiux/cdk/overlay': 'dist/packages/cdk/overlay/index.js',
    '@uiux/cdk/platform': 'dist/packages/cdk/platform/index.js',
    '@uiux/cdk/portal': 'dist/packages/cdk/portal/index.js',
    '@uiux/cdk/rxjs': 'dist/packages/cdk/rxjs/index.js',
    '@uiux/cdk/scrolling': 'dist/packages/cdk/scrolling/index.js',
    '@uiux/cdk/stepper': 'dist/packages/cdk/stepper/index.js',
    '@uiux/cdk/table': 'dist/packages/cdk/table/index.js',
    '@uiux/cdk/testing': 'dist/packages/cdk/testing/index.js',

    '@uiux/material/autocomplete': 'dist/packages/material/autocomplete/index.js',
    '@uiux/material/button': 'dist/packages/material/button/index.js',
    '@uiux/material/button-toggle': 'dist/packages/material/button-toggle/index.js',
    '@uiux/material/card': 'dist/packages/material/card/index.js',
    '@uiux/material/checkbox': 'dist/packages/material/checkbox/index.js',
    '@uiux/material/chips': 'dist/packages/material/chips/index.js',
    '@uiux/material/core': 'dist/packages/material/core/index.js',
    '@uiux/material/datepicker': 'dist/packages/material/datepicker/index.js',
    '@uiux/material/dialog': 'dist/packages/material/dialog/index.js',
    '@uiux/material/expansion': 'dist/packages/material/expansion/index.js',
    '@uiux/material/form-field': 'dist/packages/material/form-field/index.js',
    '@uiux/material/grid-list': 'dist/packages/material/grid-list/index.js',
    '@uiux/material/icon': 'dist/packages/material/icon/index.js',
    '@uiux/material/input': 'dist/packages/material/input/index.js',
    '@uiux/material/list': 'dist/packages/material/list/index.js',
    '@uiux/material/menu': 'dist/packages/material/menu/index.js',
    '@uiux/material/paginator': 'dist/packages/material/paginator/index.js',
    '@uiux/material/progress-bar': 'dist/packages/material/progress-bar/index.js',
    '@uiux/material/progress-spinner': 'dist/packages/material/progress-spinner/index.js',
    '@uiux/material/radio': 'dist/packages/material/radio/index.js',
    '@uiux/material/select': 'dist/packages/material/select/index.js',
    '@uiux/material/sidenav': 'dist/packages/material/sidenav/index.js',
    '@uiux/material/slide-toggle': 'dist/packages/material/slide-toggle/index.js',
    '@uiux/material/slider': 'dist/packages/material/slider/index.js',
    '@uiux/material/snack-bar': 'dist/packages/material/snack-bar/index.js',
    '@uiux/material/sort': 'dist/packages/material/sort/index.js',
    '@uiux/material/stepper': 'dist/packages/material/stepper/index.js',
    '@uiux/material/table': 'dist/packages/material/table/index.js',
    '@uiux/material/tabs': 'dist/packages/material/tabs/index.js',
    '@uiux/material/toolbar': 'dist/packages/material/toolbar/index.js',
    '@uiux/material/tooltip': 'dist/packages/material/tooltip/index.js',
  },
  packages: {
    // Thirdparty barrels.
    'rxjs': {main: 'index'},

    // Set the default extension for the root package, because otherwise the demo-app can't
    // be built within the production mode. Due to missing file extensions.
    '.': {
      defaultExtension: 'js'
    }
  }
});

// Configure the Angular test bed and run all specs once configured.
 configureTestBed()
  .then(runMaterialSpecs)
  .then(__karma__.start, __karma__.error);


/** Runs the Angular Material specs in Karma. */
function runMaterialSpecs() {
  // By importing all spec files, Karma will run the tests directly.
  return Promise.all(specFiles.map(function(fileName) {
    return System.import(fileName);
  }));
}

/** Whether the specified file is part of Angular Material. */
function isMaterialSpecFile(path) {
  return path.slice(-8) === '.spec.js' && path.indexOf('node_modules') === -1;
}

/** Configures Angular's TestBed. */
function configureTestBed() {
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
  ]).then(function (providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];

    var testBed = testing.TestBed.initTestEnvironment(
      testingBrowser.BrowserDynamicTestingModule,
      testingBrowser.platformBrowserDynamicTesting()
    );

    patchTestBedToDestroyFixturesAfterEveryTest(testBed);
  });
}

/**
 * Monkey-patches TestBed.resetTestingModule such that any errors that occur during component
 * destruction are thrown instead of silently logged. Also runs TestBed.resetTestingModule after
 * each unit test.
 *
 * Without this patch, the combination of two behaviors is problematic for Angular Material:
 * - TestBed.resetTestingModule catches errors thrown on fixture destruction and logs them without
 *     the errors ever being thrown. This means that any component errors that occur in ngOnDestroy
 *     can encounter errors silently and still pass unit tests.
 * - TestBed.resetTestingModule is only called *before* a test is run, meaning that even *if* the
 *    aforementioned errors were thrown, they would be reported for the wrong test (the test that's
 *    about to start, not the test that just finished).
 */
function patchTestBedToDestroyFixturesAfterEveryTest(testBed) {
  // Original resetTestingModule function of the TestBed.
  var _resetTestingModule = testBed.resetTestingModule;

  // Monkey-patch the resetTestingModule to destroy fixtures outside of a try/catch block.
  // With https://github.com/angular/angular/commit/2c5a67134198a090a24f6671dcdb7b102fea6eba
  // errors when destroying components are no longer causing Jasmine to fail.
  testBed.resetTestingModule = function() {
    try {
      this._activeFixtures.forEach(function (fixture) { fixture.destroy(); });
    } finally {
      this._activeFixtures = [];
      // Regardless of errors or not, run the original reset testing module function.
      _resetTestingModule.call(this);
    }
  };

  // Angular's testing package resets the testing module before each test. This doesn't work well
  // for us because it doesn't allow developers to see what test actually failed.
  // Fixing this by resetting the testing module after each test.
  // https://github.com/angular/angular/blob/master/packages/core/testing/src/before_each.ts#L25
  afterEach(function() {
    testBed.resetTestingModule();
  });
}
