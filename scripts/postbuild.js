const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  Skipping ${src} (not found)`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying static files to standalone directory...');

// Copy .next/static to .next/standalone/.next/static
copyRecursive('.next/static', '.next/standalone/.next/static');
console.log('  ✓ Copied .next/static');

// Copy public to .next/standalone/public
copyRecursive('public', '.next/standalone/public');
console.log('  ✓ Copied public');

console.log('✓ Static files copied successfully');
