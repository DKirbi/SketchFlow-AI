import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

const stylesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../styles');

function compile(source: string): string {
  return sass.compileString(source, { loadPaths: [stylesDir] }).css;
}

describe('LOFI token fallbacks', () => {
  it('emits light-theme fallbacks so production CSS still paints if :root is dropped', () => {
    const css = compile(`
      @use 'tokens' as *;
      .probe {
        color: $color-ink;
        background: $color-paper;
        border-color: $color-border;
      }
    `);

    expect(css).toContain('var(--lofi-ink, #111)');
    expect(css).toContain('var(--lofi-paper, #fff)');
    expect(css).toContain('var(--lofi-border, #bbb)');
  });
});
