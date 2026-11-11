import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { listFolders, readFolder, searchRecords, getRecordBySlug } from './parser.js';

const HARNESS_DIR = path.join(process.cwd(), '../../harnesses/saleh-digital');

describe('parser', () => {
  describe('listFolders', () => {
    it('lists all folders in harness', () => {
      const folders = listFolders(HARNESS_DIR);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders).toContain('foundations/brand');
      expect(folders).toContain('intelligence/policy');
    });
  });
  
  describe('readFolder', () => {
    it('reads folder with index and records', () => {
      const folder = readFolder(HARNESS_DIR, 'foundations/brand');
      expect(folder.name).toBe('brand');
      expect(folder.group).toBe('foundations');
      expect(folder.index).toBeDefined();
      expect(folder.index?.frontmatter.title).toBe('Brand');
    });
  });
  
  describe('searchRecords', () => {
    it('finds records by title', () => {
      const results = searchRecords(HARNESS_DIR, 'brand');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.frontmatter.title.toLowerCase().includes('brand'))).toBe(true);
    });
    
    it('finds records by slug', () => {
      const results = searchRecords(HARNESS_DIR, 'wordmark');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.frontmatter.slug === 'wordmark')).toBe(true);
    });
  });
  
  describe('getRecordBySlug', () => {
    it('finds record by slug', () => {
      const record = getRecordBySlug(HARNESS_DIR, 'brand');
      expect(record).toBeDefined();
      expect(record?.frontmatter.slug).toBe('brand');
    });
    
    it('returns null for non-existent slug', () => {
      const record = getRecordBySlug(HARNESS_DIR, 'nonexistent-slug-12345');
      expect(record).toBeNull();
    });
  });
});
