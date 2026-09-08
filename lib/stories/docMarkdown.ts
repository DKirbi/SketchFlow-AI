import uxEn from '../../docs/UX_PATTERNS.md?raw';
import storiesEn from '../../docs/UX_PATTERN_STORIES.md?raw';
import uiEn from '../../docs/UI_PATTERNS.md?raw';
import kitEn from '../../docs/LOFI_KIT_PATTERNS.md?raw';
import uxDe from '../../docs/locales/de/UX_PATTERNS.md?raw';
import storiesDe from '../../docs/locales/de/UX_PATTERN_STORIES.md?raw';
import uiDe from '../../docs/locales/de/UI_PATTERNS.md?raw';
import kitDe from '../../docs/locales/de/LOFI_KIT_PATTERNS.md?raw';
import uxSl from '../../docs/locales/sl/UX_PATTERNS.md?raw';
import storiesSl from '../../docs/locales/sl/UX_PATTERN_STORIES.md?raw';
import uiSl from '../../docs/locales/sl/UI_PATTERNS.md?raw';
import kitSl from '../../docs/locales/sl/LOFI_KIT_PATTERNS.md?raw';
import type { DocLocale } from './docLocale';

export type DocKey = 'UX_PATTERNS' | 'UX_PATTERN_STORIES' | 'UI_PATTERNS' | 'LOFI_KIT_PATTERNS';

const DOCS: Record<DocLocale, Record<DocKey, string>> = {
  en: {
    UX_PATTERNS: uxEn,
    UX_PATTERN_STORIES: storiesEn,
    UI_PATTERNS: uiEn,
    LOFI_KIT_PATTERNS: kitEn,
  },
  de: {
    UX_PATTERNS: uxDe,
    UX_PATTERN_STORIES: storiesDe,
    UI_PATTERNS: uiDe,
    LOFI_KIT_PATTERNS: kitDe,
  },
  sl: {
    UX_PATTERNS: uxSl,
    UX_PATTERN_STORIES: storiesSl,
    UI_PATTERNS: uiSl,
    LOFI_KIT_PATTERNS: kitSl,
  },
};

export function docMarkdown(locale: DocLocale, key: DocKey): string {
  const localized = DOCS[locale]?.[key];
  return localized?.trim() ? localized : DOCS.en[key];
}
