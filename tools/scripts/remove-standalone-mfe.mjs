#!/usr/bin/env node
/* global console, process */
/* eslint no-undef: "off", no-unused-vars: "off" */

/**
 * Remove Standalone MFE (Multi-Repo)
 *
 * Usage:
 *   node tools/scripts/remove-standalone-mfe.mjs <nama-mfe>
 *
 * Example:
 *   node tools/scripts/remove-standalone-mfe.mjs reporting-mfe
 *
 * What it does:
 *   1. Removes MFE from Shell's remotes.json
 *   2. Removes lazy import from Shell's router.tsx
 *   3. Removes Route block from Shell's router.tsx
 *   4. Removes type declaration from Shell's vite-env.d.ts
 *   5. Removes remote from Shell's vite.config.ts
 *   6. Optionally removes the monorepo copy (apps/<name>) if it still exists
 *   7. Optionally removes the standalone folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, '../..');

// ── Parse args ──
const args = process.argv.slice(2);
const mfeName = args.find((a) => !a.startsWith('--'));
const skipConfirm = args.includes('--yes') || args.includes('-y');
const deleteStandalone = args.find((a) => a.startsWith('--standalone-dir='));
const standaloneDir = deleteStandalone ? path.resolve(deleteStandalone.split('=')[1]) : null;

if (!mfeName) {
  console.error(`
╔══════════════════════════════════════════════════════╗
║  Remove Standalone MFE                               ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Usage:                                              ║
║    pnpm run remove:standalone <name>                 ║
║                                                      ║
║  Example:                                            ║
║    pnpm run remove:standalone reporting-mfe          ║
║                                                      ║
║  Options:                                            ║
║    --yes                Skip confirmation prompt     ║
║    --standalone-dir=<p> Also delete standalone folder║
║                                                      ║
╚══════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

const safeName = mfeName.replace(/-/g, '');

console.log(`
┌──────────────────────────────────────────
│ 🗑️  Removing MFE: ${mfeName}
│    Safe name: ${safeName}
└──────────────────────────────────────────
`);

// ── Confirmation ─────────────────────────────────
if (!skipConfirm) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question('⚠️  This will remove all references from Shell. Continue? (y/N) ', resolve);
  });
  rl.close();
  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    process.exit(0);
  }
}

let changes = 0;

// ── 1. Remove from remotes.json ──────────────────
console.log('\n1️⃣  Removing from remotes.json...');
const remotesPath = path.join(MONOREPO_ROOT, 'apps/shell/public/remotes.json');
if (fs.existsSync(remotesPath)) {
  const remotes = JSON.parse(fs.readFileSync(remotesPath, 'utf-8'));
  if (remotes.remotes?.[mfeName]) {
    delete remotes.remotes[mfeName];
    fs.writeFileSync(remotesPath, JSON.stringify(remotes, null, 2) + '\n');
    console.log('   ✅ Removed from remotes.json');
    changes++;
  } else {
    console.log('   ⚠️  Not found in remotes.json, skipping.');
  }
}

// ── 2. Remove from router.tsx ────────────────────
console.log('\n2️⃣  Removing from router.tsx...');
const routerPath = path.join(MONOREPO_ROOT, 'apps/shell/src/router.tsx');
if (fs.existsSync(routerPath)) {
  let routerContent = fs.readFileSync(routerPath, 'utf-8');
  const originalLength = routerContent.length;

  // Remove lazy import line
  const importPattern = new RegExp(
    `const Remote\\w+ = lazy\\(\\(\\) => import\\('${safeName}/App'\\)\\);\\n?`,
    'g'
  );
  routerContent = routerContent.replace(importPattern, '');

  // Remove Route block (multiline)
  const routePattern = new RegExp(`\\s*<Route\\s+path="${mfeName}/\\*"[\\s\\S]*?<\\/Route>`, 'g');
  routerContent = routerContent.replace(routePattern, '');

  if (routerContent.length !== originalLength) {
    fs.writeFileSync(routerPath, routerContent);
    console.log('   ✅ Removed from router.tsx');
    changes++;
  } else {
    console.log('   ⚠️  Not found in router.tsx, skipping.');
  }
}

// ── 3. Remove from vite-env.d.ts ─────────────────
console.log('\n3️⃣  Removing from vite-env.d.ts...');
const envDtsPath = path.join(MONOREPO_ROOT, 'apps/shell/src/vite-env.d.ts');
if (fs.existsSync(envDtsPath)) {
  let envContent = fs.readFileSync(envDtsPath, 'utf-8');
  const originalLength = envContent.length;

  const declarePattern = new RegExp(`\\ndeclare module '${safeName}/App'[\\s\\S]*?\\}\\n`, 'g');
  envContent = envContent.replace(declarePattern, '\n');

  if (envContent.length !== originalLength) {
    fs.writeFileSync(envDtsPath, envContent);
    console.log('   ✅ Removed from vite-env.d.ts');
    changes++;
  } else {
    console.log('   ⚠️  Not found in vite-env.d.ts, skipping.');
  }
}

// ── 4. Remove from shell vite.config.ts ──────────
console.log('\n4️⃣  Removing from shell vite.config.ts...');
const shellVitePath = path.join(MONOREPO_ROOT, 'apps/shell/vite.config.ts');
if (fs.existsSync(shellVitePath)) {
  let viteContent = fs.readFileSync(shellVitePath, 'utf-8');
  const originalLength = viteContent.length;

  const remotePattern = new RegExp(`\\s*${safeName}:\\s*\\{[\\s\\S]*?\\},?\\n?`, 'g');
  viteContent = viteContent.replace(remotePattern, '');

  if (viteContent.length !== originalLength) {
    fs.writeFileSync(shellVitePath, viteContent);
    console.log('   ✅ Removed from vite.config.ts');
    changes++;
  } else {
    console.log('   ⚠️  Not found in vite.config.ts, skipping.');
  }
}

// ── 5. Remove monorepo copy if exists ────────────
const monorepoCopy = path.join(MONOREPO_ROOT, 'apps', mfeName);
if (fs.existsSync(monorepoCopy)) {
  console.log(`\n5️⃣  Removing monorepo copy: apps/${mfeName}...`);
  fs.rmSync(monorepoCopy, { recursive: true, force: true });
  console.log('   ✅ Removed.');
  changes++;

  // Also remove from project.json if Nx workspace
  const projectJsonPath = path.join(monorepoCopy, 'project.json');
  // Already deleted above, but clean Nx cache
  try {
    const { execSync } = await import('child_process');
    execSync('pnpm nx reset', { cwd: MONOREPO_ROOT, stdio: 'ignore' });
  } catch {
    // ignore
  }
}

// ── 6. Remove standalone folder if specified ─────
if (standaloneDir && fs.existsSync(standaloneDir)) {
  console.log(`\n6️⃣  Removing standalone folder: ${standaloneDir}...`);
  fs.rmSync(standaloneDir, { recursive: true, force: true });
  console.log('   ✅ Removed.');
  changes++;
}

// ── Summary ──────────────────────────────────────
console.log(`
┌──────────────────────────────────────────────────────
│ ${changes > 0 ? '✅' : '⚠️'}  Done! ${changes} changes made.
│
│ Don't forget to restart Shell:
│   pnpm run dev:new
└──────────────────────────────────────────────────────
`);
