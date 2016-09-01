# Material Design for Angular 2
[![NPM Version](https://badge.fury.io/js/%40angular2-material%2Fcore.svg)](https://www.npmjs.com/package/%2540angular2-material%2Fcore)
[![Build Status](https://travis-ci.org/angular/material2.svg?branch=master)](https://travis-ci.org/angular/material2)
[![Gitter](https://badges.gitter.im/angular/material2.svg)](https://gitter.im/angular/material2?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

This is the home for the Angular team's Material Design components built on top of Angular 2.

#### Quick links
[Google group](https://groups.google.com/forum/#!forum/angular-material2),
[Contributing](https://github.com/angular/material2/blob/master/CONTRIBUTING.md),
[Plunker Template](http://plnkr.co/edit/o077B6uEiiIgkC0S06dd?p=preview)

### Getting started 

See our [Getting Started Guide](https://github.com/angular/material2/blob/master/GETTING_STARTED.md)
if you're building your first project with Angular Material 2.

### Project status
Angular Material 2 is currently in alpha and under active development. 
During alpha, breaking API and behavior changes will be occurring regularly.

Check out our [directory of design documents](https://github.com/angular/material2/wiki/Design-doc-directory) 
for more insight into our process.

If you'd like to contribute, you must follow our [contributing guidelines](https://github.com/angular/material2/blob/master/CONTRIBUTING.md). 
You can look through the issues (which should be up-to-date on who is working on which features 
and which pieces are blocked) and make a comment. 
Also see our [`Good for community contribution`](https://github.com/angular/material2/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+for+community+contribution%22) 
label.

High level items planned for September 2016:
* Work on Angular core towards 2.0.0 final
* Preparing for conferences (Angular Connect and ng-europe)
* Final features for dialog
* Initial version of snackbar.
* Additional behaviors for menu, start design for select.
* Finalize high-level design details for data-table.


#### Feature status:

| Feature          | Status                              | Docs         | Issue  |
|------------------|-------------------------------------|--------------|--------|
| button           |                           Available | [README][1]  |      - |
| cards            |                           Available | [README][2]  |      - |
| checkbox         |                           Available | [README][3]  |      - |
| radio            |                           Available | [README][4]  |      - |
| input            |                           Available | [README][5]  |      - |
| sidenav          |                           Available | [README][6]  |      - |
| toolbar          |                           Available | [README][7]  |      - |
| list             |                           Available | [README][8]  |   #107 |
| grid-list        |                           Available | [README][9]  |      - |
| icon             |                           Available | [README][10] |      - |
| progress-circle  |                           Available | [README][11] |      - |
| progress-bar     |                           Available | [README][12] |      - |
| tabs             |                           Available | [README][13] |      - |
| slide-toggle     |                           Available | [README][14] |      - |
| button-toggle    |                           Available | [README][15] |      - |
| slider           |                           Available | [README][16] |      - |
| menu             | Initial version, needs enhancements | [README][17] |   #119 |
| tooltip          | Initial version, needs enhancements | [README][18] |      - |
| ripples          |  Available, but needs to be applied | [README][19] |   #108 |
| dialog           |  Started, not yet ready for release |           -  |   #114 |
| snackbar / toast |                    Proof-of-concept |           -  |   #115 |
| select           |                         Not started |           -  |   #118 |
| textarea         |                         Not started |           -  |   #546 |
| autocomplete     |                         Not started |           -  |   #117 |
| chips            |                         Not started |           -  |   #120 |
| theming          |               Designed, no code yet |           -  |   #123 |
| prod build       |                         Not started |           -  |      - |
| docs site        |   UX design and tooling in progress |           -  |      - |
| typography       |                         Not started |           -  |   #205 |
| layout           |                         Not started |           -  |      - |
| fab speed-dial   |                         Not started |           -  |   #860 |
| fab toolbar      |                         Not started |           -  |      - |
| bottom-sheet     |                         Not started |           -  |      - |
| bottom-nav       |                         Not started |           -  |   #408 |
| virtual-repeat   |                         Not started |           -  |   #823 |
| datepicker       |                         Not started |           -  |   #675 |
| data-table       |                         Not started |           -  |   #581 |
| stepper          |                         Not started |           -  |   #508 |

 [1]: https://github.com/angular/material2/blob/master/src/lib/button/README.md
 [2]: https://github.com/angular/material2/blob/master/src/lib/card/README.md
 [3]: https://github.com/angular/material2/blob/master/src/lib/checkbox/README.md
 [4]: https://github.com/angular/material2/blob/master/src/lib/radio/README.md
 [5]: https://github.com/angular/material2/blob/master/src/lib/input/README.md
 [6]: https://github.com/angular/material2/blob/master/src/lib/sidenav/README.md
 [7]: https://github.com/angular/material2/blob/master/src/lib/toolbar/README.md
 [8]: https://github.com/angular/material2/blob/master/src/lib/list/README.md
 [9]: https://github.com/angular/material2/blob/master/src/lib/grid-list/README.md
[10]: https://github.com/angular/material2/blob/master/src/lib/icon/README.md
[11]: https://github.com/angular/material2/blob/master/src/lib/progress-circle/README.md
[12]: https://github.com/angular/material2/blob/master/src/lib/progress-bar/README.md
[13]: https://github.com/angular/material2/blob/master/src/lib/tabs/README.md
[14]: https://github.com/angular/material2/blob/master/src/lib/slide-toggle/README.md
[15]: https://github.com/angular/material2/blob/master/src/lib/button-toggle/README.md
[16]: https://github.com/angular/material2/blob/master/src/lib/slider/README.md
[17]: https://github.com/angular/material2/blob/master/src/lib/menu/README.md
[18]: https://github.com/angular/material2/blob/master/src/lib/tooltip/README.md
[19]: https://github.com/angular/material2/blob/master/src/lib/core/ripple/README.md


"Available" means that the components or feature is published and available for use, but may still
be missing some behaviors or polish.

## The goal of Angular Material
Our goal is to build a set of high-quality UI components built with Angular 2 and TypeScript, 
following the Material Design spec. These 
components will serve as an example of how to write Angular code following best practices.

### What do we mean by "high-quality"?
* Internationalized and accessible so that all users can use them.
* Straightforward APIs that don't confuse developers.
* Behave as expected across a wide variety of use-cases without bugs.
* Behavior is well-tested with both unit and integration tests.
* Customizable within the bounds of the Material Design specification.
* Performance cost is minimized.
* Code is clean and well-documented to serve as an example for Angular devs.

## Browser and screen reader support
Angular Material supports the most recent two versions of all major browsers: 
Chrome (including Android), Firefox, Safari (including iOS), and IE11 / Edge

We also aim for great user experience with the following screen readers:
* NVDA and JAWS with IE / FF / Chrome (on Windows).
* VoiceOver with Safari on iOS and Safari / Chrome on OSX.
* TalkBack with Chrome on Android.
