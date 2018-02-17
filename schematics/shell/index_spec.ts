import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'path';
import {getFileContent} from '@schematics/angular/utility/test';
import {createTestApp} from '../utils/testing';
import {getConfig, getAppFromConfig} from '@schematics/angular/utility/config';
import {getIndexHtmlPath} from '../utils/ast';
import {normalize} from '@angular-devkit/core';

const collectionPath = join(__dirname, '../collection.json');

describe('material-shell-schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTestApp();
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  it('should update package.json', () => {
    const tree = runner.runSchematic('materialShell', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.dependencies['@angular/material']).toBeDefined();
    expect(packageJson.dependencies['@angular/cdk']).toBeDefined();
  });

  it('should add default theme', () => {
    const tree = runner.runSchematic('materialShell', {}, appTree);
    const config = getConfig(tree);
    config.apps.forEach(app => {
      expect(app.styles).toContain(
        '../node_modules/@angular/material/prebuilt-themes/indigo-pink.css');
    });
  });

  it('should add custom theme', () => {
    const tree = runner.runSchematic('materialShell', {
      theme: 'custom'
    }, appTree);

    const config = getConfig(tree);
    const app = getAppFromConfig(config, '0');
    const stylesPath = normalize(`/${app.root}/styles.scss`);

    const buffer = tree.read(stylesPath);
    const src = buffer.toString();

    expect(src.indexOf(`@import '~@angular/material/theming';`)).toBeGreaterThan(-1);
  });

  it('should add font links', () => {
    const tree = runner.runSchematic('materialShell', {}, appTree);
    const indexPath = getIndexHtmlPath(tree);
    const buffer = tree.read(indexPath);
    const indexSrc = buffer.toString();
    expect(indexSrc.indexOf('fonts.googleapis.com')).toBeGreaterThan(-1);
  });
});
