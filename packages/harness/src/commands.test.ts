import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { initHarness, listFolders, validateHarness } from './commands.js';

function copyHarnesses(): void {
  const targetDir = path.join(__dirname, '../harnesses');
  
  // Remove if exists
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // Copy from root
  const sourceDir = path.join(__dirname, '../../../harnesses');
  copyRecursive(sourceDir, targetDir);
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

describe('commands', () => {
  let tempDir: string;
  
  beforeAll(() => {
    // Copy harnesses for tests
    copyHarnesses();
  });
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-test-'));
  });
  
  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  describe('initHarness', () => {
    it('initializes saleh-digital harness', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      await initHarness('saleh-digital', targetDir, false);
      
      expect(fs.existsSync(targetDir)).toBe(true);
      expect(fs.existsSync(path.join(targetDir, 'foundations'))).toBe(true);
      expect(fs.existsSync(path.join(targetDir, 'intelligence'))).toBe(true);
      expect(fs.existsSync(path.join(targetDir, 'components'))).toBe(true);
    });
    
    it('initializes starter harness', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      await initHarness('starter', targetDir, false);
      
      expect(fs.existsSync(targetDir)).toBe(true);
      expect(fs.existsSync(path.join(targetDir, 'foundations'))).toBe(true);
    });
    
    it('fails without --force on non-empty directory', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'test.txt'), 'test');
      
      await expect(initHarness('saleh-digital', targetDir, false)).rejects.toThrow();
    });
    
    it('overwrites with --force', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'test.txt'), 'test');
      
      await initHarness('saleh-digital', targetDir, true);
      expect(fs.existsSync(path.join(targetDir, 'foundations'))).toBe(true);
    });
  });
  
  describe('listFolders', () => {
    it('lists folders in initialized harness', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      await initHarness('saleh-digital', targetDir, false);
      
      const folders = listFolders(targetDir);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders).toContain('foundations/brand');
    });
  });
  
  describe('validateHarness', () => {
    it('validates initialized harness', async () => {
      const targetDir = path.join(tempDir, 'design-harness');
      await initHarness('saleh-digital', targetDir, false);
      
      const result = validateHarness(targetDir);
      expect(result.valid).toBe(true);
    });
  });
});
