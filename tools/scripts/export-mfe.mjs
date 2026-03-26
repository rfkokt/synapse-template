#!/usr/bin/env node
/* global console, process */
/* eslint no-undef: "off" */

/**
 * Export Existing MFE to Standalone Repo
 *
 * Usage:
 *   pnpm export:mfe <mfe-name> [--target=<path>] [--force]
 *
 * Example:
 *   pnpm export:mfe auth-mfe
 *   pnpm export:mfe docs-mfe --force
 *
 * What it does:
 *   1. Copies apps/<name> to target dir (default: ../<name>)
 *   2. Replaces workspace:* → actual lib version in package.json
 *   3. Swaps tsconfig.standalone.json → tsconfig.json
 *   4. Creates .npmrc pointing to Verdaccio
 *   5. Creates .env.local from standalone.env.example
 *   6. Creates comprehensive .gitignore
 *   7. Initializes independent git repo with initial commit
 *   8. Removes apps/<name> from monorepo
 *
 * Shell references (remotes.json) are kept intact.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, '../..');

// ── Read dynamic scope from tools/package.json ──
const toolsPkgPath = path.join(MONOREPO_ROOT, 'tools', 'package.json');
const toolsPkg = JSON.parse(fs.readFileSync(toolsPkgPath, 'utf-8'));
const TOOLS_SCOPE = toolsPkg.name;
const scopeMatch = TOOLS_SCOPE.match(/^@[^/]+/);
const SCOPE = scopeMatch ? scopeMatch[0] : '@synapse';

// ── Parse args ──────────────────────────────────
const args = process.argv.slice(2);
const mfeName = args.find((a) => !a.startsWith('--'));
const targetDirArg = args.find((a) => a.startsWith('--target='));
const targetParent = targetDirArg
  ? path.resolve(targetDirArg.split('=')[1])
  : path.resolve(MONOREPO_ROOT, '..');
const forceOverwrite = args.includes('--force');

if (!mfeName) {
  console.error(`
╔══════════════════════════════════════════════════════╗
║  Export Existing MFE to Standalone Repo              ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Usage:                                              ║
║    pnpm export:mfe <name>                            ║
║                                                      ║
║  Examples:                                           ║
║    pnpm export:mfe auth-mfe                          ║
║    pnpm export:mfe docs-mfe --force                  ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

const sourceDir = path.join(MONOREPO_ROOT, 'apps', mfeName);
const targetDir = path.join(targetParent, mfeName);

// ── Validate source ──────────────────────────────
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ MFE not found in monorepo: apps/${mfeName}`);
  console.error(`   Make sure the MFE exists at: ${sourceDir}`);
  process.exit(1);
}

console.log(`
┌──────────────────────────────────────────────────────
│ 🚀 Exporting MFE: ${mfeName}
│    Source: ${sourceDir}
│    Target: ${targetDir}
└──────────────────────────────────────────────────────
`);

// ── Step 1: Copy to standalone location ──────────
console.log(`\n📁 Step 1/7: Copying to ${targetDir}...`);
if (fs.existsSync(targetDir)) {
  if (forceOverwrite) {
    console.log('   ⚠️  Target exists, removing (--force)...');
    fs.rmSync(targetDir, { recursive: true, force: true });
  } else {
    console.error(`❌ Target directory already exists: ${targetDir}`);
    console.error('   Use --force to overwrite, or delete it manually.');
    process.exit(1);
  }
}

// Copy excluding node_modules and dist
function copyDirExcluding(src, dest, excludes = []) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (excludes.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirExcluding(srcPath, destPath, excludes);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirExcluding(sourceDir, targetDir, ['node_modules', 'dist', '.vite', '.__mf__temp']);
console.log('   ✅ Copied successfully.');

// ── Step 2: Replace workspace:* → actual version ──
console.log('\n🔧 Step 2/7: Replacing workspace:* with actual versions...');
const pkgJsonPath = path.join(targetDir, 'package.json');
let pkgContent = fs.readFileSync(pkgJsonPath, 'utf-8');
const pkgData = JSON.parse(pkgContent);

const depsToUpdate = ['dependencies', 'devDependencies', 'peerDependencies'];

// Dynamically read versions from libs/
for (const depType of depsToUpdate) {
  if (pkgData[depType]) {
    for (const [depName, depVersion] of Object.entries(pkgData[depType])) {
      if (depVersion === 'workspace:*') {
        // Strip scope if present to easily find folder name in this project
        const libFolderName = depName.replace(`${SCOPE}/`, '');
        const libPkgPath = path.join(MONOREPO_ROOT, 'libs', libFolderName, 'package.json');

        // Use '*' to always get latest version from Verdaccio/npm
        let actualVersion = '*';

        // Optional: read version from lib for logging/debugging
        if (fs.existsSync(libPkgPath)) {
          const libPkgData = JSON.parse(fs.readFileSync(libPkgPath, 'utf-8'));
          console.log(
            `   🔄 ${depName}: workspace:* -> * (latest, currently ${libPkgData.version} in monorepo)`
          );
        } else {
          console.log(`   🔄 ${depName}: workspace:* -> * (latest from registry)`);
        }

        pkgData[depType][depName] = actualVersion;
      }
    }
  }
}

fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgData, null, 2) + '\n');
console.log('   ✅ Dependencies updated.');

// ── Step 3: Swap tsconfig.standalone.json ────────
console.log('\n⚙️  Step 3/7: Setting up tsconfig...');
const standaloneTsconfig = path.join(targetDir, 'tsconfig.standalone.json');
const targetTsconfig = path.join(targetDir, 'tsconfig.json');
if (fs.existsSync(standaloneTsconfig)) {
  fs.copyFileSync(standaloneTsconfig, targetTsconfig);
  fs.unlinkSync(standaloneTsconfig);
  // Remove tsconfig.node.json if exists (monorepo specific)
  const tsconfigNode = path.join(targetDir, 'tsconfig.node.json');
  if (fs.existsSync(tsconfigNode)) fs.unlinkSync(tsconfigNode);
  console.log('   ✅ Using standalone tsconfig.');
} else {
  console.log('   ⚠️  No tsconfig.standalone.json found, keeping default.');
}

// ── Step 4: Create .npmrc ────────────────────────
console.log('\n📝 Step 4/7: Creating .npmrc for Verdaccio...');
const npmrcContent = `# Auto-generated by export-mfe
${SCOPE}:registry=http://localhost:4873/
//localhost:4873/:_authToken="anonymous"
auto-install-peers=true
strict-peer-dependencies=false
`;
fs.writeFileSync(path.join(targetDir, '.npmrc'), npmrcContent);
console.log('   ✅ .npmrc created.');

// ── Step 5: Create .env.local ────────────────────
console.log('\n🌐 Step 5/7: Creating .env.local...');
const envExample = path.join(targetDir, 'standalone.env.example');
const envLocal = path.join(targetDir, '.env.local');
if (fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envLocal);
  console.log('   ✅ .env.local created from standalone.env.example.');
} else {
  // Create a minimal .env.local
  fs.writeFileSync(
    envLocal,
    `# Auto-generated by export-mfe\nVITE_ENABLE_MSW=true\nVITE_SHELL_URL=http://localhost:4000\n`
  );
  console.log('   ✅ .env.local created (minimal).');
}

// ── Step 6: Create .gitignore ────────────────────
console.log('\n📄 Step 6/7: Creating .gitignore...');
const gitignoreContent = `# Dependencies
node_modules/

# Build output
dist/
.vite/
.__mf__temp/

# Environment files
.env
.env.local
.env.*.local

# NPM auth
.npmrc

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
`;
fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignoreContent);
console.log('   ✅ .gitignore created.');

// ── Step 7: Init git repo ────────────────────────
console.log('\n🔀 Step 7/7: Initializing independent git repository...');
try {
  execSync('git init', { cwd: targetDir, stdio: 'ignore' });
  execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });
  execSync(`git commit -m "chore: export ${mfeName} as standalone repo"`, {
    cwd: targetDir,
    stdio: 'ignore',
  });
  console.log('   ✅ Git initialized with initial commit.');
} catch {
  console.log('   ⚠️  Git init skipped (git not available or already initialized).');
}

// ── Step 8: Remove from monorepo ─────────────────
console.log(`\n🧹 Step 8/8: Removing apps/${mfeName} from monorepo...`);
fs.rmSync(sourceDir, { recursive: true, force: true });
console.log(`   ✅ Removed apps/${mfeName} from monorepo.`);
console.log('   ℹ️  Shell remotes.json still intact (no changes needed).');

// ── Done! ─────────────────────────────────────────
console.log(`
┌──────────────────────────────────────────────────────
│ ✅ ${mfeName} exported as standalone repo!
│
│ Location: ${targetDir}
│
│ Next steps:
│   1. Start Verdaccio:    pnpm run verdaccio:start  (in monorepo)
│   2. Publish libs:       pnpm run libs:publish:local  (in monorepo)
│   3. Install deps:       cd ${targetDir} && pnpm install
│   4. Run MFE:            pnpm run serve
│
│ Shell references in remotes.json are unchanged.
└──────────────────────────────────────────────────────
`);
