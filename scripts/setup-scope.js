import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const newScope = args[0];

if (!newScope || !newScope.startsWith('@')) {
  console.error('\n❌ ERROR: Harap berikan nama scope baru yang diawali dengan symbol "@"');
  console.error('👉 Contoh penggunaan: pnpm run setup:scope @namakantor\n');
  process.exit(1);
}

const oldScope = '@synapse';
// Direktori yang aman untuk dilewati agar tidak mengubah file hasil build / dependency
const ignoreDirs = ['node_modules', 'dist', '.git', '.nx', 'public'];
// Ekstensi file yang akan dicek dan diubah
const targetExts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md'];

let changedFiles = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignoreDirs.includes(file)) continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (stat.isFile()) {
      const ext = path.extname(filePath);
      const isConfig = file.includes('.env') || file.includes('.npmrc');

      // Hanya proses file text based
      if (targetExts.includes(ext) || isConfig) {
        // Abaikan script builder ini sendiri
        if (filePath === __filename) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        // Ganti semua kemunculan @synapse menjadi @newscope (misal @synapse/ui-kit jadi @myorg/ui-kit)
        if (content.includes(oldScope)) {
          // Menggunakan regex global untuk me-replace semua string
          const regex = new RegExp(oldScope, 'g');
          const newContent = content.replace(regex, newScope);

          if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Updated: ${path.relative(ROOT_DIR, filePath)}`);
            changedFiles++;
          }
        }
      }
    }
  }
}

console.log(`\n🚀 Memulai proses Re-Branding Scope...`);
console.log(`🔍 Mengubah semua referensi "${oldScope}" menjadi "${newScope}"\n`);

try {
  walkDir(ROOT_DIR);
  console.log(`\n🎉 SELESAI! Berhasil mengubah ${changedFiles} file.`);
  console.log(`\n⚠️  LANGKAH SELANJUTNYA:`);
  console.log(`1. Jalankan "pnpm install" untuk memperbarui symlink workspaces.`);
  console.log(`2. Coba jalankan "pnpm run dev" untuk memastikan tidak ada error.\n`);
} catch (error) {
  console.error('\n❌ Terjadi kesalahan saat membaca/menyimpan file:', error);
  process.exit(1);
}
