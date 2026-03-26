#!/usr/bin/env node
/* eslint-disable no-undef */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// TODO: Anda perlu membuat repository kosong di GitHub bernama "synapse-template"
// dan memindahkan (push) versi polos dari Arsitektur MFE kita ke sana.
const GIT_REPO = 'https://github.com/rfkokt/synapse-template.git';

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(`\x1b[31mGagal mengeksekusi:\x1b[0m ${command}`, error.message);
    return false;
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\x1b[36m%s\x1b[0m', 'Welcome to create-synapse-mfe CLI v1.1.0!');
console.log('Scaffolding a Vite-powered Micro-Frontend Architecture...');
console.log("\x1b[32mWhat's new in v1.1.0:\x1b[0m");
console.log('  \x1b[34m- Auto Re-Branding: ganti NPM scope saat setup\x1b[0m');
console.log('  \x1b[34m- Standalone Sandbox MFE: contoh MFE terpisah via Verdaccio\x1b[0m');
console.log('  \x1b[34m- Multi-Repo Support: Vite auto-detect monorepo vs standalone\x1b[0m');

const getProjectName = () => {
  return new Promise((resolve) => {
    if (process.argv[2]) {
      resolve(process.argv[2]);
    } else {
      rl.question(
        '\n\x1b[33m? Nama direktori proyek Anda:\x1b[0m (synapse-workspace) ',
        (answer) => {
          resolve(answer.trim() || 'synapse-workspace');
        }
      );
    }
  });
};

const getScopeName = () => {
  return new Promise((resolve) => {
    if (process.argv[3]) {
      resolve(process.argv[3]);
    } else {
      rl.question('\n\x1b[33m? Nama NPM scope organisasi Anda:\x1b[0m (@synapse) ', (answer) => {
        let scope = answer.trim() || '@synapse';
        if (!scope.startsWith('@')) scope = '@' + scope;
        resolve(scope);
      });
    }
  });
};

const getExtractExample = () => {
  return new Promise((resolve) => {
    rl.question(
      '\n\x1b[33m? Buat contoh MFE terpisah (Standalone Sandbox via Verdaccio)?\x1b[0m (Y/n) ',
      (answer) => {
        const res = answer.trim().toLowerCase();
        resolve(res === '' || res === 'y' || res === 'yes');
      }
    );
  });
};

(async () => {
  const projectName = await getProjectName();
  const scopeName = await getScopeName();
  const extractExample = await getExtractExample();
  const currentDir = process.cwd();
  const projectPath = path.join(currentDir, projectName);

  if (fs.existsSync(projectPath)) {
    console.error(
      `\n\x1b[31mError: Folder "${projectName}" sudah ada! Harap pilih nama lain.\x1b[0m`
    );
    process.exit(1);
  }

  console.log(
    `\n\x1b[32mMengkloning blueprint MFE ke dalam \x1b[1m${projectName}\x1b[0m...\x1b[0m`
  );

  const cloneCmd = `git clone --depth 1 ${GIT_REPO} "${projectName}"`;
  if (!runCommand(cloneCmd)) {
    process.exit(1);
  }

  console.log(`\n\x1b[32mMembersihkan jejak git lama (Re-initializing)...\x1b[0m`);
  const gitFolder = path.join(projectPath, '.git');
  if (fs.existsSync(gitFolder)) {
    fs.rmSync(gitFolder, { recursive: true, force: true });
  }

  // Clean up CLI internal tools and NPM workflows from the end-user's boilerplate
  const cliFolder = path.join(projectPath, 'tools', 'create-synapse');
  if (fs.existsSync(cliFolder)) {
    fs.rmSync(cliFolder, { recursive: true, force: true });
  }

  const npmWorkflow = path.join(projectPath, '.github', 'workflows', 'publish-npm.yml');
  if (fs.existsSync(npmWorkflow)) {
    fs.rmSync(npmWorkflow, { force: true });
  }

  console.log(`\x1b[32mMemulai repositori Git baru...\x1b[0m`);
  runCommand(`git init`, { cwd: projectPath });

  if (scopeName !== '@synapse') {
    console.log(`\n\x1b[32mMengganti NPM scope menjadi \x1b[1m${scopeName}\x1b[0m...\x1b[0m`);
    runCommand(`node scripts/setup-scope.js ${scopeName}`, { cwd: projectPath });
  }

  if (extractExample) {
    console.log(`\n\x1b[32mMengekstrak external-mfe sebagai Standalone Sandbox...\x1b[0m`);
    const standalonePath = path.join(currentDir, projectName + '-sandbox-mfe');
    const sourcePath = path.join(projectPath, 'apps', 'external-mfe');
    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, standalonePath);

      // Rewrite package.json: workspace:* → ^0.1.0 (semver for Verdaccio)
      const pkgPath = path.join(standalonePath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        let pkgContent = fs.readFileSync(pkgPath, 'utf-8');
        pkgContent = pkgContent.replace(/"workspace:\*"/g, '"^0.1.0"');
        fs.writeFileSync(pkgPath, pkgContent);
      }

      // Generate .npmrc pointing to local Verdaccio
      const npmrcContent =
        scopeName +
        ':registry=http://localhost:4873/\n' +
        '//localhost:4873/:_authToken="anonymous"\n' +
        'auto-install-peers=true\n' +
        'strict-peer-dependencies=false\n';
      fs.writeFileSync(path.join(standalonePath, '.npmrc'), npmrcContent);

      console.log(`\x1b[36mSandbox MFE berhasil dibuat di: \x1b[1m${standalonePath}\x1b[0m`);
    }
  }

  console.log(
    `\n\x1b[36mBerhasil! Proyek "\x1b[1m${projectName}\x1b[0m\x1b[36m" telah siap.\n\x1b[0m`
  );
  console.log('Langkah selanjutnya yang harus Anda lakukan:');
  console.log(`\x1b[33m  cd ${projectName}\x1b[0m`);
  console.log('\x1b[33m  pnpm install\x1b[0m');
  console.log('\x1b[33m  pnpm run dev:new\x1b[0m\n');

  if (extractExample) {
    console.log('\x1b[32m┌─────────────────────────────────────────────────┐\x1b[0m');
    console.log('\x1b[32m│  CARA MENJALANKAN SANDBOX MFE (via Verdaccio)   │\x1b[0m');
    console.log('\x1b[32m└─────────────────────────────────────────────────┘\x1b[0m');
    console.log('\x1b[33m  1. Start Verdaccio (Terminal Tab 1):\x1b[0m');
    console.log(`\x1b[36m     cd ${projectName} && pnpm run verdaccio:start\x1b[0m`);
    console.log('\x1b[33m  2. Publish libs ke Verdaccio (Terminal Tab 2):\x1b[0m');
    console.log(`\x1b[36m     cd ${projectName} && pnpm run libs:publish:local\x1b[0m`);
    console.log('\x1b[33m  3. Jalankan Sandbox MFE (Terminal Tab 3):\x1b[0m');
    console.log(`\x1b[36m     cd ${projectName}-sandbox-mfe\x1b[0m`);
    console.log('\x1b[36m     pnpm install && pnpm run serve\x1b[0m');
    console.log('\x1b[36m     → http://localhost:4005 (terhubung ke Shell!)\x1b[0m\n');
  }

  console.log('\x1b[36mMock credentials (development):\x1b[0m');
  console.log('  \x1b[34m- auth-mfe (/auth/login): admin@Synapse.com / password123\x1b[0m');
  console.log('  \x1b[34m- auth-mfe (/auth/login): user@Synapse.com / password123\x1b[0m');
  console.log('  \x1b[34m- standalone MFE (isolated): dev@synapse.local / password123\x1b[0m');
  console.log(
    '  \x1b[34m- docs: /docs/api-mocking, /docs/api-interceptors, /docs/security\x1b[0m\n'
  );

  console.log('\x1b[35mSelamat Mengoding Micro-Frontend!\x1b[0m\n');

  rl.close();
  process.exit(0);
})();
