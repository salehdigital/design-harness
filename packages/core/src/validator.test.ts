import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { validateHarness, validateRecord } from './validator.js';
import type { RecordFrontmatter } from './types.js';

const SALEH_HARNESS = path.join(process.cwd(), '../../harnesses/saleh-digital');
const STARTER_HARNESS = path.join(process.cwd(), '../../harnesses/starter');

describe('validator', () => {
  describe('validateRecord', () => {
    it('accepts valid frontmatter', () => {
      const frontmatter: RecordFrontmatter = {
        title: 'Test Record',
        slug: 'test-record',
        status: 'published',
        group: 'Foundations',
      };
      const errors = validateRecord(frontmatter, '/test/path.md');
      expect(errors).toHaveLength(0);
    });
    
    it('requires title', () => {
      const frontmatter = {
        slug: 'test',
      } as RecordFrontmatter;
      const errors = validateRecord(frontmatter, '/test/path.md');
      expect(errors.some(e => e.field === 'title')).toBe(true);
    });
    
    it('requires slug', () => {
      const frontmatter = {
        title: 'Test',
      } as RecordFrontmatter;
      const errors = validateRecord(frontmatter, '/test/path.md');
      expect(errors.some(e => e.field === 'slug')).toBe(true);
    });
    
    it('validates slug format', () => {
      const frontmatter: RecordFrontmatter = {
        title: 'Test',
        slug: 'Invalid Slug!',
      };
      const errors = validateRecord(frontmatter, '/test/path.md');
      expect(errors.some(e => e.field === 'slug' && e.message.includes('lowercase'))).toBe(true);
    });
    
    it('validates status enum', () => {
      const frontmatter = {
        title: 'Test',
        slug: 'test',
        status: 'invalid',
      } as any;
      const errors = validateRecord(frontmatter, '/test/path.md');
      expect(errors.some(e => e.field === 'status')).toBe(true);
    });
  });
  
  describe('validateHarness', () => {
    it('validates saleh-digital harness', () => {
      const result = validateHarness(SALEH_HARNESS);
      if (!result.valid) {
        console.log('Validation errors:', result.errors);
      }
      expect(result.valid).toBe(true);
    });
    
    it('validates starter harness', () => {
      const result = validateHarness(STARTER_HARNESS);
      if (!result.valid) {
        console.log('Validation errors:', result.errors);
      }
      expect(result.valid).toBe(true);
    });
    
    it('fails for non-existent directory', () => {
      const result = validateHarness('/nonexistent/path');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
