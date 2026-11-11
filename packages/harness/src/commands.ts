import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { listFolders as coreListFolders, validateHarness as coreValidateHarness } from '@salehdigital/harness-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initHarness(name: string, targetDir: string, force: boolean = false): Promise<void> {
  const harnessesDir = path.join(__dirname, '../harnesses');
  const sourcePath = path.join(harnessesDir, name);
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Harness "${name}" not found. Available: saleh-digital, starter`);
  }
  
  if (fs.existsSync(targetDir) && !force) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      throw new Error(`Directory ${targetDir} already exists and is not empty. Use --force to overwrite.`);
    }
  }
  
  fs.mkdirSync(targetDir, { recursive: true });
  copyRecursive(sourcePath, targetDir);
}

function copyRecursive(src: string, dest: string): void {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function listFolders(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory ${dir} does not exist`);
  }
  
  return coreListFolders(dir);
}

export function validateHarness(dir: string) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory ${dir} does not exist`);
  }
  
  return coreValidateHarness(dir);
}
