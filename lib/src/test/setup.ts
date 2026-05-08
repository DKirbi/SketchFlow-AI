import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement the Pointer Capture API; polyfill for Radix UI components.
window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
window.HTMLElement.prototype.setPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
// Radix Select uses scrollIntoView internally.
window.HTMLElement.prototype.scrollIntoView = vi.fn();
