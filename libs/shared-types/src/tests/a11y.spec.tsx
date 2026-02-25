import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';

// Type assertion extension for vitest-axe
declare module 'vitest' {
  export interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  export interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

// Extend vitest's expect with jest-axe (vitest-axe) assertions
expect.extend(matchers);

describe('Accessibility (a11y) Baseline', () => {
  it('should have no a11y violations when rendering a simple accessible HTML structure', async () => {
    const { container } = render(
      <main id="main-content">
        <h1>Welcome to Synapse MFE</h1>
        <p>This is a structurally sound component.</p>
        <button aria-label="Submit Form">Submit</button>
      </main>
    );

    // Run the axe audit against the rendered container
    const results = await axe(container);

    // Test passes if 0 violations found
    expect(results).toHaveNoViolations();
  });
});
