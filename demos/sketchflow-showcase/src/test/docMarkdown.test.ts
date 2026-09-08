import { describe, expect, it } from 'vitest';
import { docMarkdown } from '../../../../lib/stories/docMarkdown';
import { setKindMarkdown } from '../../../../lib/stories/sets/setKindDocs';

describe('docMarkdown', () => {
  it('picks the German UX Patterns copy and falls back to English keys', () => {
    expect(docMarkdown('de', 'UX_PATTERNS')).toContain('# UX-Muster');
    expect(docMarkdown('sl', 'LOFI_KIT_PATTERNS')).toContain('referenca komponent');
    expect(docMarkdown('en', 'UX_PATTERNS')).toContain('# UX Patterns');
    expect(docMarkdown('de', 'UI_PATTERNS')).toMatch(/^## UI Patterns$/m);
    expect(docMarkdown('sl', 'UI_PATTERNS')).toMatch(/^## UI Patterns$/m);
  });

  it('localizes component-set intros with English fallback for usage samples', () => {
    expect(setKindMarkdown('action-cluster', 'de')).toContain('hostbewusste Aktionszeile');
    expect(setKindMarkdown('action-cluster', 'en')).toContain('host-aware row of actions');
    expect(setKindMarkdown('action-cluster', 'de')).toContain('exampleById');
  });
});
