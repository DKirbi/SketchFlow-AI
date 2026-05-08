#!/usr/bin/env node
/**
 * Builds props-catalog.json, optionally props-catalog.md.
 * Exits  if any documented prop lacks a non-empty JSDoc description.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const docgen = require('react-docgen-typescript');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const emitMd = process.argv.includes('--emit-md');
const outJson =
  process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length) ??
  path.join(root, 'props-catalog.json');
const outMd = path.join(path.dirname(outJson), 'props-catalog.md');

function walkTsx(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkTsx(p, acc);
    else if (p.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

const parser = docgen.withCustomConfig(path.join(root, 'lib/tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter(prop) {
    if (prop.name === 'key' || prop.name === 'ref') return false;
    if (prop.declarations?.length) {
      return prop.declarations.some((d) => !d.fileName.includes('node_modules'));
    }
    return true;
  },
});

function validateFlowNodeTypes(filePath) {
  const errors = [];
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const targets = new Set(['FlowNodeData', 'TerminalNodeData', 'AnnotationNodeData']);

  function getJsDocText(node) {
    const docs = ts.getJSDocCommentsAndTags(node);
    const parts = [];
    for (const d of docs) {
      if (!ts.isJSDoc(d)) continue;
      if (typeof d.comment === 'string') parts.push(d.comment);
      else if (Array.isArray(d.comment)) {
        for (const c of d.comment) {
          if (ts.isJSDocText(c)) parts.push(c.text);
        }
      }
    }
    return parts.join('\n').trim();
  }

  function visit(node) {
    if (ts.isInterfaceDeclaration(node) && targets.has(node.name.text)) {
      for (const m of node.members) {
        if (!ts.isPropertySignature(m)) continue;
        const name = m.name?.getText(sf) ?? '?';
        const desc = getJsDocText(m);
        if (!desc) errors.push(`${filePath}: ${node.name.text}.${name} missing JSDoc`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return errors;
}

const uiFiles = walkTsx(path.join(root, 'lib/src/ui'));
const extra = [
  path.join(root, 'lib/src/diagram/nodes/nodeDocs.tsx'),
  path.join(root, 'lib/src/diagram/nodes/types.ts'),
];

const allFiles = [...uiFiles, extra[0]].filter((f) => fs.existsSync(f));

const catalog = [];
const missingDocs = [];

for (const file of allFiles) {
  let docs;
  try {
    docs = parser.parse(file);
  } catch {
    continue;
  }
  for (const doc of docs) {
    const propsOut = [];
    for (const [pname, pinfo] of Object.entries(doc.props ?? {})) {
      const desc = (pinfo.description ?? '').trim();
      if (!desc) missingDocs.push(`${file} :: ${doc.displayName} :: ${pname}`);
      propsOut.push({
        name: pname,
        required: pinfo.required,
        type: pinfo.type?.name ?? '',
        rawType: pinfo.type?.raw ?? '',
        defaultValue: pinfo.defaultValue?.value ?? null,
        description: desc,
      });
    }
    catalog.push({
      file: path.relative(root, file),
      displayName: doc.displayName,
      description: (doc.description ?? '').trim(),
      props: propsOut,
    });
  }
}

missingDocs.push(...validateFlowNodeTypes(extra[1]));

fs.writeFileSync(outJson, JSON.stringify({ generated: new Date().toISOString(), components: catalog }, null, 2));

if (emitMd) {
  const lines = ['# Props catalog', '', `_Generated ${new Date().toISOString()}_`, ''];
  for (const c of catalog) {
    lines.push(`## ${c.displayName}`, '');
    if (c.description) lines.push(c.description, '');
    lines.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const p of c.props) {
      const def = p.defaultValue == null ? '' : String(p.defaultValue).replace(/\|/g, '\\|');
      lines.push(`| ${p.name} | \`${p.type}\` | ${def} | ${p.description.replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  }
  fs.writeFileSync(outMd, lines.join('\n'));
}

if (missingDocs.length) {
  console.error('Missing JSDoc on props:', missingDocs.length);
  for (const m of missingDocs) console.error(' ', m);
  process.exit(1);
}
console.log('props-catalog:', outJson, emitMd ? `+ ${outMd}` : '');
