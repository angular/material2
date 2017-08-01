import {join} from 'path';
import {readdirSync, lstatSync} from 'fs';
import {buildConfig} from './build-config';
import {spawnSync} from 'child_process';

const DIR_BLACKLIST = ['testing'];

/**
 * Gets secondary entry-points for a given package.
 *
 * This currently assumes that every directory under a package should be an entry-point except for
 * specifically black-listed directories.
 *
 * @param packageName The package name for which to get entry points, e.g., 'cdk'.
 * @returns An array of secondary entry-points names, e.g., ['a11y', 'bidi', ...]
 */
export function getSecondaryEntryPointsForPackage(packageName: string) {
  const packageDir = join(buildConfig.packagesDir, packageName);

  // First get the list of all entry-points as the list of directories in the package excluding
  // blacklisted directories (e.g., "testing").
  const entryPoints = readdirSync(packageDir)
      .filter(f => lstatSync(join(packageDir, f)).isDirectory() && DIR_BLACKLIST.indexOf(f) < 0);

  // Create nodes that comprise the build graph.
  const buildNodes: BuildNode[] = entryPoints.map(p => ({name: p, deps: []}));

  // Create a lookup for name -> build graph node.
  const nodeLookup = buildNodes.reduce((lookup, node) => {
    return lookup.set(node.name, node);
  }, new Map<string, BuildNode>());

  // Regex used to extract entry-point name from an import statement referencing that entry-point.
  // E.g., extract "portal" from "from '@angular/cdk/portal';".
  const importRegex = new RegExp(`${packageName}/(.+)';`);

  // Update the deps for each node to point to the appropriate BuildNodes.
  buildNodes.forEach(node => {
    // Look for any imports that reference this same umbrella package and get the corresponding
    // BuildNode for each by looking at the import statements with grep.
    node.deps = spawnSync('egrep', [
      '-roh',
      '--include', '*.ts',
      `from.'@angular/cdk/.+';`,
      `./src/cdk/${node.name}/`
    ])
    .stdout
    .toString()
    .split('\n')
    .filter(String)
    .map(importStatement => importStatement.match(importRegex)![1])
    .map(depName => nodeLookup.get(depName)!) || [];
  });

  // Concatenate the build order for each node into one global build order.
  // Duplicates are automatically omitted by getBuildOrder.
  return buildNodes.reduce((order: string[], node) => {
    return [...order, ...getBuildOrder(node)];
  }, []);
}

/** Gets the build order for a given node with DFS. */
function getBuildOrder(node: BuildNode): string[] {
  if (node.visited) {
    return [];
  }

  let buildOrder: string[] = [];
  for (const dep of node.deps) {
    buildOrder = [...buildOrder, ...getBuildOrder(dep)];
  }

  node.visited = true;
  return [...buildOrder, node.name];
}


interface BuildNode {
  name: string;
  deps: BuildNode[];
  visited?: boolean;
}
