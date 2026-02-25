import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync } from 'node:zlib';

type ViteManifestEntry = {
  file?: string;
  css?: string[];
  imports?: string[];
  isEntry?: boolean;
};

type ViteManifest = Record<string, ViteManifestEntry>;

// Define budget limits in Kilobytes (KB)
const BUDGETS = {
  js: 250, // initial JS entry graph
  css: 50, // initial CSS
  remoteEntry: 5, // remoteEntry(.js) should stay tiny
};

function getDirFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getDirFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getBrotliSize(filePath: string): number {
  const fileContent = fs.readFileSync(filePath);
  const compressed = brotliCompressSync(fileContent);
  return compressed.length;
}

function getManifestPath(appDistDir: string): string | null {
  const manifestPaths = [
    path.join(appDistDir, '.vite', 'manifest.json'),
    path.join(appDistDir, 'manifest.json'),
  ];

  for (const manifestPath of manifestPaths) {
    if (fs.existsSync(manifestPath)) {
      return manifestPath;
    }
  }

  return null;
}

function getEntryKey(manifest: ViteManifest): string | null {
  if (manifest['index.html']?.isEntry) {
    return 'index.html';
  }

  const firstEntry = Object.entries(manifest).find(([, entry]) => entry.isEntry);
  return firstEntry?.[0] ?? null;
}

function collectInitialAssetsFromManifest(manifest: ViteManifest): { js: string[]; css: string[] } {
  const entryKey = getEntryKey(manifest);
  if (!entryKey) {
    return { js: [], css: [] };
  }

  const visited = new Set<string>();
  const js = new Set<string>();
  const css = new Set<string>();

  function walk(key: string) {
    if (visited.has(key)) {
      return;
    }
    visited.add(key);

    const entry = manifest[key];
    if (!entry) {
      return;
    }

    if (entry.file?.endsWith('.js')) {
      js.add(entry.file);
    }

    for (const stylesheet of entry.css ?? []) {
      if (stylesheet.endsWith('.css')) {
        css.add(stylesheet);
      }
    }

    for (const imported of entry.imports ?? []) {
      walk(imported);
    }
  }

  walk(entryKey);
  return { js: [...js], css: [...css] };
}

function collectInitialAssetsFromIndexHtml(appDistDir: string): { js: string[]; css: string[] } {
  const indexHtmlPath = path.join(appDistDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    return { js: [], css: [] };
  }

  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const js = new Set<string>();
  const css = new Set<string>();

  const scriptRegex = /<script[^>]*src="([^"]+\.js)"[^>]*>/g;
  const cssRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g;

  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    const assetPath = match[1];
    if (!assetPath.startsWith('http')) {
      js.add(assetPath.replace(/^\//, ''));
    }
  }

  while ((match = cssRegex.exec(html)) !== null) {
    const assetPath = match[1];
    if (!assetPath.startsWith('http')) {
      css.add(assetPath.replace(/^\//, ''));
    }
  }

  return { js: [...js], css: [...css] };
}

function getRemoteEntryFiles(appDistDir: string): string[] {
  return getDirFiles(appDistDir).filter((file) => /(?:^|\/)remoteEntry.*\.js$/.test(file));
}

function checkBudgets() {
  const appsDir = path.join(process.cwd(), 'apps');
  
  if (!fs.existsSync(appsDir)) {
    console.error(`Error: Directory ${appsDir} not found.`);
    process.exit(1);
  }

  const apps = fs.readdirSync(appsDir).filter(f => fs.statSync(path.join(appsDir, f)).isDirectory());
  let hasErrors = false;

  console.log('\n📊 Bundle Budget Verification\n');

  for (const app of apps) {
    const appDistDir = path.join(appsDir, app, 'dist');
    if (!fs.existsSync(appDistDir)) {
       console.log(`Skipping app: ${app} (No dist folder found)`);
       continue;
    }

    console.log(`Checking app: ${app}`);
    const manifestPath = getManifestPath(appDistDir);
    const assets = manifestPath
      ? collectInitialAssetsFromManifest(JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ViteManifest)
      : collectInitialAssetsFromIndexHtml(appDistDir);

    const totalJsSize = assets.js.reduce((sum, relativeFile) => {
      const target = path.join(appDistDir, relativeFile);
      return fs.existsSync(target) ? sum + getBrotliSize(target) : sum;
    }, 0);

    const totalCssSize = assets.css.reduce((sum, relativeFile) => {
      const target = path.join(appDistDir, relativeFile);
      return fs.existsSync(target) ? sum + getBrotliSize(target) : sum;
    }, 0);

    const jsSizeKb = totalJsSize / 1024;
    const cssSizeKb = totalCssSize / 1024;

    console.log(`  Initial JS Size : ${jsSizeKb.toFixed(2)} KB (Target: < ${BUDGETS.js} KB)`);
    console.log(`  Initial CSS Size: ${cssSizeKb.toFixed(2)} KB (Target: < ${BUDGETS.css} KB)`);

    if (jsSizeKb > BUDGETS.js) {
      console.error(`  ❌ Initial JS budget exceeded for ${app}!`);
      hasErrors = true;
    }
    if (cssSizeKb > BUDGETS.css) {
      console.error(`  ❌ Initial CSS budget exceeded for ${app}!`);
      hasErrors = true;
    }

    const remoteEntryFiles = getRemoteEntryFiles(appDistDir);
    for (const remoteEntryFile of remoteEntryFiles) {
      const remoteEntrySizeKb = getBrotliSize(remoteEntryFile) / 1024;
      const remoteEntryName = path.relative(appDistDir, remoteEntryFile);
      console.log(
        `  ${remoteEntryName} : ${remoteEntrySizeKb.toFixed(2)} KB (Target: < ${BUDGETS.remoteEntry} KB)`
      );
      if (remoteEntrySizeKb > BUDGETS.remoteEntry) {
        console.error(`  ❌ remoteEntry budget exceeded for ${app}!`);
        hasErrors = true;
      }
    }
    console.log('');
  }

  if (hasErrors) {
    console.error('💥 Budget verification failed! Bundle size exceeds maximum limits.');
    process.exit(1);
  } else {
    console.log('✅ All apps are within the defined performance budgets.');
  }
}

checkBudgets();
