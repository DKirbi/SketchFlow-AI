import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { COMPONENT_SET_KIND_NAV } from '../sets/kindNav';

const storiesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../stories/sets');

function unwrap(expr: ts.Expression): ts.Expression {
  while (
    ts.isAsExpression(expr) ||
    ts.isSatisfiesExpression(expr) ||
    ts.isParenthesizedExpression(expr)
  ) {
    expr = expr.expression;
  }
  return expr;
}

function parseStory(source: string): ts.SourceFile {
  return ts.createSourceFile('story.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function defaultExportExpression(sf: ts.SourceFile): ts.Expression | undefined {
  for (const stmt of sf.statements) {
    if (ts.isExportAssignment(stmt) && !stmt.isExportEquals) {
      return stmt.expression;
    }
  }
  return undefined;
}

function objectLiteralFromDefault(sf: ts.SourceFile): ts.ObjectLiteralExpression | undefined {
  const exported = defaultExportExpression(sf);
  if (!exported) return undefined;
  const expr = unwrap(exported);
  if (ts.isObjectLiteralExpression(expr)) return expr;
  if (!ts.isIdentifier(expr)) return undefined;
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== expr.text || !decl.initializer) {
        continue;
      }
      const inner = unwrap(decl.initializer);
      if (ts.isObjectLiteralExpression(inner)) return inner;
    }
  }
  return undefined;
}

function stringTitle(obj: ts.ObjectLiteralExpression): string | undefined {
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name) || prop.name.text !== 'title') {
      continue;
    }
    const value = unwrap(prop.initializer);
    if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
      return value.text;
    }
  }
  return undefined;
}

describe('component-set Storybook CSF', () => {
  const files = readdirSync(storiesDir).filter((name) => name.endsWith('.stories.tsx'));

  it('exports a statically analyzable meta object with a string-literal title', () => {
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const source = readFileSync(path.join(storiesDir, file), 'utf8');
      const sf = parseStory(source);
      const obj = objectLiteralFromDefault(sf);
      expect(obj, `${file} default export must be an object literal (not a function call)`).toBeDefined();
      expect(stringTitle(obj!), file).toMatch(/^LOW FI Design system\/Component sets\//);
    }
  });

  it('covers every documented set kind in the sidebar', () => {
    const titles = files.map((file) => {
      const source = readFileSync(path.join(storiesDir, file), 'utf8');
      return stringTitle(objectLiteralFromDefault(parseStory(source))!);
    });
    for (const { nav } of COMPONENT_SET_KIND_NAV) {
      expect(titles).toContain(`LOW FI Design system/Component sets/${nav}`);
    }
  });
});
