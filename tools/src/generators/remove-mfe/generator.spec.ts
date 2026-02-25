import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { removeMfeGenerator } from './generator';
import { RemoveMfeGeneratorSchema } from './schema';
import { describe, it, expect, beforeEach } from 'vitest';

describe('remove-mfe generator', () => {
  let tree: Tree;
  const options: RemoveMfeGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await removeMfeGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
