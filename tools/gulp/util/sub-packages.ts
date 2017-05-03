import {join, basename, normalize, isAbsolute, dirname, relative} from 'path';
import {sync as glob} from 'glob';
import {DIST_ROOT, DIST_BUNDLES, DIST_RELEASES} from '../constants';
import {remapSourcemap, copyFiles} from './package-build';
import {createRollupBundle, ROLLUP_GLOBALS} from './rollup-helper';
import {transpileFile} from './ts-compiler';
import {ScriptTarget, ModuleKind} from 'typescript';
import {writeFileSync} from 'fs';

/** Modules that will be always treated as external */
const ROLLUP_EXTERNALS = Object.keys(ROLLUP_GLOBALS);

/**
 * Builds FESM bundles for all available sub-packages of the package. A subpackage is every
 * directory inside of the root package.
 */
export async function buildAllSubpackages(packageName: string) {
  const packageOut = join(DIST_ROOT, 'packages', packageName);
  const subPackages = glob(join(packageOut, '*/'));

  await Promise.all(subPackages.map(packagePath => {
    return buildSubpackage(basename(packagePath), packagePath, packageName);
  }));
}

/**
 * Builds FESM bundles for the specified sub-package of a package. Subpackage bundles are
 * used to improve tree-shaking in bundlers like Webpack.
 */
async function buildSubpackage(packageName: string, packagePath: string, rootPackage: string) {
  const entryFile = join(packagePath, 'index.js');
  const moduleName = `ng.${rootPackage}.${packageName}`;

  // List of paths to the subpackage bundles.
  const fesm2015File = join(DIST_BUNDLES, rootPackage, `${packageName}.js`);
  const fesm2014File = join(DIST_BUNDLES, rootPackage, `${packageName}.es5.js`);

  // Build a FESM-2015 bundle for the subpackage folder.
  await createRollupBundle({
    moduleName: moduleName,
    entry: entryFile,
    dest: fesm2015File,
    format: 'es',
    // Rewrite all internal paths to scoped package imports
    paths: importPath => importPath.includes(DIST_ROOT) && `@angular/${rootPackage}`,
    // Function to only bundle all files inside of the current subpackage.
    external: importPath => {
      return ROLLUP_EXTERNALS.indexOf(importPath) !== -1 ||
        isAbsolute(importPath) && !importPath.includes(packageName);
    },
  });

  await remapSourcemap(fesm2015File);

  // Downlevel the FESM-2015 file to ES5.
  transpileFile(fesm2015File, fesm2014File, {
    target: ScriptTarget.ES5,
    module: ModuleKind.ES2015,
    allowJs: true
  });

  await remapSourcemap(fesm2014File);
}

/**
 * Function that composes a release with the subpackages included. Needs to run after the main
 * compose release function.
 */
export async function composeSubpackages(packageName: string) {
  const packagePath = join(DIST_ROOT, 'packages', packageName);
  const bundlesDir = join(DIST_BUNDLES, packageName);
  const bundlePaths = glob(join(bundlesDir, '!(*.es5).js')).map(normalize);

  const fesmOutputDir = join(DIST_RELEASES, packageName, '@angular');
  const fesm2015File = join(fesmOutputDir, `${packageName}.js`);
  const fesm2014File = join(fesmOutputDir, `${packageName}.es5.js`);

  const moduleIndexPath = join(fesmOutputDir, `module-index.js`);

  let indexContent = `export * from '../../../packages/${packageName}/module';\n`;

  indexContent += bundlePaths.map(bundle => `export * from './${basename(bundle)}';`).join('\n');

  // Write index file to disk. Afterwards run rollup to bundle.
  writeFileSync(moduleIndexPath, indexContent);

  // Copy all bundles into the release directory.
  copyFiles(bundlesDir, '*.js', fesmOutputDir);

  await createRollupBundle({
    moduleName: `ng.${packageName}`,
    entry: moduleIndexPath,
    dest: fesm2015File,
    format: 'es',
    external: importPath => importPath !== moduleIndexPath && !importPath.includes('module'),
    paths: importPath => {
      if (importPath.includes(packagePath)) { return `@angular/${packageName}`; }
      if (dirname(importPath) === fesmOutputDir) { return 'TEST (intentionally committed!)'; }
    }
  });


  // Downlevel the FESM-2015 file to ES5.
  transpileFile(fesm2015File, fesm2014File, {
    target: ScriptTarget.ES5,
    module: ModuleKind.ES2015,
    allowJs: true
  });
}
