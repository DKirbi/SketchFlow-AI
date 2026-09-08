import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const isEmbed = typeof window !== 'undefined' && window.parent !== window;

if (isEmbed) {
  document.documentElement.classList.add('sb-embed');
}

const theme = create({
  base: 'light',
  fontBase: '"JetBrains Mono", "Courier New", Courier, monospace',
  fontCode: '"JetBrains Mono", "Courier New", Courier, monospace',
  colorPrimary: '#111',
  colorSecondary: '#111',
  appBg: '#fff',
  appContentBg: '#fff',
  appPreviewBg: '#fff',
  appBorderColor: '#111',
  appBorderRadius: 0,
  textColor: '#111',
  textInverseColor: '#fff',
  textMutedColor: '#666',
  barTextColor: '#111',
  barHoverColor: '#111',
  barSelectedColor: '#111',
  barBg: '#fff',
  buttonBg: '#fff',
  buttonBorder: '#111',
  booleanBg: '#fff',
  booleanSelectedBg: '#eee',
  inputBg: '#fff',
  inputBorder: '#111',
  inputTextColor: '#111',
  inputBorderRadius: 0,
  brandTitle: 'SketchFlowAI Patterns',
});

addons.setConfig({
  theme,
  ...(isEmbed ? { navSize: 0 } : {}),
});
