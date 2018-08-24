/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {green, red} from 'chalk';
import {ProgramAwareRuleWalker, RuleFailure, Rules} from 'tslint';
import * as ts from 'typescript';
import {MaterialPropertyNameData, propertyNames} from '../../material/data/property-names';

/**
 * Rule that walks through every property access expression and updates properties that have
 * been changed in favor of a new name.
 */
export class Rule extends Rules.TypedRule {
  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
  }
}

export class Walker extends ProgramAwareRuleWalker {

  visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
    const hostType = this.getTypeChecker().getTypeAtLocation(node.expression);
    const typeName = hostType && hostType.symbol && hostType.symbol.getName();

    propertyNames.forEach(data => {
      if (node.name.text !== data.replace) {
        return;
      }

      if (!data.whitelist || data.whitelist.classes.includes(typeName)) {
        const replacement = this.createReplacement(node.name.getStart(),
            node.name.getWidth(), data.replaceWith);
        this.addFailureAtNode(node.name, `Found deprecated property ${red(data.replace)} which ` +
            `has been renamed to "${green(data.replaceWith)}"`, replacement);
      }
    });

    super.visitPropertyAccessExpression(node);
  }
}
