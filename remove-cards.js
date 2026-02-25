const fs = require('fs');
const path = require('path');

const dirs = [
  'apps/docs-mfe/src/pages/ui-kit',
  'apps/docs-mfe/src/pages/components'
];

let modifiedFiles = 0;

dirs.forEach(dir => {
  const fullDir = path.join(__dirname, dir);
  const files = fs.readdirSync(fullDir);
  files.forEach(file => {
    if (!file.endsWith('.tsx') || file === 'shared.tsx') return;
    
    const filePath = path.join(fullDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    content = content.replace(/<Card>\s*<CardContent className="[^"]*space-y-(\d+)[^"]*">/g, '<div className="space-y-$1">');
    content = content.replace(/<Card>\s*<CardContent>/g, '<div>');
    content = content.replace(/<\/CardContent>\s*<\/Card>/g, '</div>');
    
    content = content.replace(/,\s*CardContent/g, '');
    content = content.replace(/CardContent,\s*/g, '');
    content = content.replace(/,\s*Card\b/g, '');
    content = content.replace(/\bCard,\s*/g, '');
    
    content = content.replace(/import\s*{\s*}\s*from\s*['"]@synapse\/ui-kit['"];?\n?/g, '');
    content = content.replace(/import\s*{\s*Card\s*}\s*from\s*['"]@synapse\/ui-kit['"];?\n?/g, '');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedFiles++;
      console.log(`Updated ${filePath}`);
    }
  });
});
console.log(`Total files modified: ${modifiedFiles}`);
