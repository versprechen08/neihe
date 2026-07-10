import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// vitest.config's `test` block doesn't enable `globals`, so RTL's own
// auto-cleanup (which relies on a global afterEach) never registers.
afterEach(() => {
  cleanup();
});
