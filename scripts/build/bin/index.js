#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const monorepoDir = path.join(__dirname, '..', '..', '..');
const serverDir = path.join(monorepoDir, 'server');
const serverZipFile = path.join(monorepoDir, 'server.zip');

const main = async () => {
  await execSync(`yarn tsc`, {
    cwd: serverDir,
    stdio: 'inherit'
  });

  await execSync(`cp dxlibrarian-events-24.01.2020.txt server/lib/executors`, {
    cwd: monorepoDir,
    stdio: 'inherit'
  });

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(serverZipFile, { flags: 'w+' });

    const archive = archiver('zip', {
      zlib: {
        level: 9
      }
    });

    archive.directory(serverDir, false);

    archive.pipe(output);
    archive.on('finish', resolve);
    archive.on('error', reject);

    archive.finalize();
  });

  console.log(`* ${serverZipFile}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
