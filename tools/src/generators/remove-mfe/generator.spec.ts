import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { removeMfeGenerator } from './generator';
import { RemoveMfeGeneratorSchema } from './schema';

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
