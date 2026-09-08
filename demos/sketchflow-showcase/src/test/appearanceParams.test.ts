import { describe, expect, it } from 'vitest';
import { appearanceSearchFromParams, appendAppearanceParams } from '../appearance/params';

describe('appearance params', () => {
  it('keeps only theme and locale on redirects', () => {
    const params = new URLSearchParams('theme=dark&locale=de&slug=mapping');
    expect(appearanceSearchFromParams(params)).toBe('?theme=dark&locale=de');
  });

  it('appends appearance onto Storybook path queries', () => {
    expect(appendAppearanceParams('/embeds/low-fi-ux-ui-patterns/?path=/docs/introduction--docs', 'dark', 'sl')).toBe(
      '/embeds/low-fi-ux-ui-patterns/?path=/docs/introduction--docs&theme=dark&locale=sl',
    );
  });
});
