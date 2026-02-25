import { formatFiles, Tree, readJson, writeJson, logger } from '@nx/devkit';
import { RemoveMfeGeneratorSchema } from './schema';

export async function removeMfeGenerator(tree: Tree, options: RemoveMfeGeneratorSchema) {
  const mfeName = options.name;
  const projectRoot = `apps/${mfeName}`;
  const safeName = mfeName.replace(/-/g, '');
  const importName = `Remote${safeName.charAt(0).toUpperCase() + safeName.slice(1)}`;

  // 1. Delete the MFE folder completely
  if (tree.exists(projectRoot)) {
    tree.delete(projectRoot);
    logger.info(`🗑️ Deleted MFE folder: ${projectRoot}`);
  } else {
    logger.warn(`⚠️ MFE folder not found at ${projectRoot}, skipping folder deletion.`);
  }

  // 1.5 Delete the Module Federation temp cache folder if exists
  const mfTempFolder = `.__mf__temp/${safeName}`;
  if (tree.exists(mfTempFolder)) {
    tree.delete(mfTempFolder);
    logger.info(`🗑️ Deleted Module Federation cache: ${mfTempFolder}`);
  }

  // 2. Remove from shell's remotes.json registry
  const remotesJsonPath = 'apps/shell/public/remotes.json';
  if (tree.exists(remotesJsonPath)) {
    const registry = readJson(tree, remotesJsonPath);
    if (registry.remotes && registry.remotes[mfeName]) {
      delete registry.remotes[mfeName];
      writeJson(tree, remotesJsonPath, registry);
      logger.info(`🗑️ Removed ${mfeName} from remotes.json`);
    }
  }

  // 3. Remove from shell's vite.config.ts
  const shellVitePath = 'apps/shell/vite.config.ts';
  if (tree.exists(shellVitePath)) {
    let shellViteContent = tree.read(shellVitePath, 'utf-8') || '';
    // Regex to match the entire property block for the remote inside vite.config.ts
    // e.g. pendaftaran: { ... },
    const remoteRegex = new RegExp(
      `\\s*${safeName}:\\s*\\{\\s*type:\\s*'module',\\s*name:\\s*'${safeName}',[\\s\\S]*?\\},`,
      'g'
    );

    if (remoteRegex.test(shellViteContent)) {
      shellViteContent = shellViteContent.replace(remoteRegex, '');
      tree.write(shellVitePath, shellViteContent);
      logger.info(`🗑️ Removed ${mfeName} from vite.config.ts`);
    }
  }

  // 4. Remove declaration from vite-env.d.ts
  const shellEnvPath = 'apps/shell/src/vite-env.d.ts';
  if (tree.exists(shellEnvPath)) {
    let envContent = tree.read(shellEnvPath, 'utf-8') || '';
    const declarationRegex = new RegExp(
      `\\n*declare module '${safeName}/App' \\{[\\s\\S]*?\\}\\n*`,
      'g'
    );

    if (declarationRegex.test(envContent)) {
      envContent = envContent.replace(declarationRegex, '');
      tree.write(shellEnvPath, envContent);
      logger.info(`🗑️ Removed ${mfeName} module declaration from vite-env.d.ts`);
    }
  }

  // 5. Remove from router.tsx
  const routerPath = 'apps/shell/src/router.tsx';
  if (tree.exists(routerPath)) {
    let routerContent = tree.read(routerPath, 'utf-8') || '';

    // Remove lazy import
    const lazyImportRegex = new RegExp(
      `\\n*const ${importName} = lazy\\(\\(\\) => import\\('${safeName}/App'\\)\\);`,
      'g'
    );
    routerContent = routerContent.replace(lazyImportRegex, '');

    // Remove the Route block
    // Matches: <Route\n path="mfeName/*"\n element={\n ... \n }\n />

    // A more robust regex just to grab the <Route path="mfeName/*" ... /> block entirely
    const flexibleRouteRegex = new RegExp(
      `\\s*<Route\\s+path="${mfeName}/\\*"\\s+element=\\{[\\s\\S]*?<${importName} />[\\s\\S]*?\\}\\s*/>`,
      'g'
    );

    if (flexibleRouteRegex.test(routerContent)) {
      routerContent = routerContent.replace(flexibleRouteRegex, '');
    }

    tree.write(routerPath, routerContent);
    logger.info(`🗑️ Removed ${mfeName} lazy route from router.tsx`);
  }

  await formatFiles(tree);

  return () => {
    logger.info(`\n✅ Successfully removed the ${mfeName} Micro Frontend!`);
  };
}

export default removeMfeGenerator;
