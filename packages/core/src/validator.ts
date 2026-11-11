import * as fs from 'fs';
import * as path from 'path';
import type { ValidationError, ValidationResult, RecordFrontmatter } from './types.js';
import { listFolders, readFolder } from './parser.js';

const VALID_STATUSES = ['draft', 'published', 'archived'];
const VALID_GROUPS = ['Foundations', 'Intelligence', 'Components'];

export function validateRecord(
  frontmatter: RecordFrontmatter,
  filePath: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!frontmatter.title || frontmatter.title.trim() === '') {
    errors.push({
      path: filePath,
      field: 'title',
      message: 'title is required',
    });
  }
  
  if (!frontmatter.slug || frontmatter.slug.trim() === '') {
    errors.push({
      path: filePath,
      field: 'slug',
      message: 'slug is required',
    });
  } else if (!/^[a-z0-9-]+$/.test(frontmatter.slug)) {
    errors.push({
      path: filePath,
      field: 'slug',
      message: 'slug must contain only lowercase letters, numbers, and hyphens',
    });
  }
  
  if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
    errors.push({
      path: filePath,
      field: 'status',
      message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }
  
  if (frontmatter.group && !VALID_GROUPS.includes(frontmatter.group)) {
    errors.push({
      path: filePath,
      field: 'group',
      message: `group must be one of: ${VALID_GROUPS.join(', ')}`,
    });
  }
  
  if (frontmatter.order !== undefined && (!Number.isInteger(frontmatter.order) || frontmatter.order < 0)) {
    errors.push({
      path: filePath,
      field: 'order',
      message: 'order must be a non-negative integer',
    });
  }
  
  if (frontmatter.discuss !== undefined && (!Number.isInteger(frontmatter.discuss) || frontmatter.discuss < 0)) {
    errors.push({
      path: filePath,
      field: 'discuss',
      message: 'discuss must be a non-negative integer',
    });
  }
  
  if (frontmatter.chips && !Array.isArray(frontmatter.chips)) {
    errors.push({
      path: filePath,
      field: 'chips',
      message: 'chips must be an array',
    });
  } else if (frontmatter.chips) {
    const invalidChips = frontmatter.chips.filter(chip => typeof chip !== 'string');
    if (invalidChips.length > 0) {
      errors.push({
        path: filePath,
        field: 'chips',
        message: 'all chips must be strings',
      });
    }
  }
  
  if (frontmatter.created) {
    const createdStr = frontmatter.created instanceof Date 
      ? frontmatter.created.toISOString() 
      : frontmatter.created;
    if (!isValidISO8601(createdStr)) {
      errors.push({
        path: filePath,
        field: 'created',
        message: 'created must be a valid ISO 8601 timestamp',
      });
    }
  }
  
  if (frontmatter.updated) {
    const updatedStr = frontmatter.updated instanceof Date 
      ? frontmatter.updated.toISOString() 
      : frontmatter.updated;
    if (!isValidISO8601(updatedStr)) {
      errors.push({
        path: filePath,
        field: 'updated',
        message: 'updated must be a valid ISO 8601 timestamp',
      });
    }
  }
  
  return errors;
}

function isValidISO8601(timestamp: string): boolean {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Accept both with and without milliseconds
  const isoWithMs = date.toISOString();
  const isoWithoutMs = isoWithMs.replace(/\.\d{3}Z$/, 'Z');
  
  return timestamp === isoWithMs || timestamp === isoWithoutMs;
}

export function validateHarness(harnessDir: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!fs.existsSync(harnessDir)) {
    return {
      valid: false,
      errors: [{
        path: harnessDir,
        message: 'Harness directory does not exist',
      }],
    };
  }
  
  const folders = listFolders(harnessDir);
  
  if (folders.length === 0) {
    errors.push({
      path: harnessDir,
      message: 'No folders found in harness',
    });
  }
  
  const seenSlugs = new Map<string, string>();
  
  for (const folder of folders) {
    const folderData = readFolder(harnessDir, folder);
    
    if (folderData.index) {
      const recordErrors = validateRecord(folderData.index.frontmatter, folderData.index.path);
      errors.push(...recordErrors);
      
      const slug = folderData.index.frontmatter.slug;
      if (seenSlugs.has(slug)) {
        errors.push({
          path: folderData.index.path,
          field: 'slug',
          message: `Duplicate slug "${slug}" (also in ${seenSlugs.get(slug)})`,
        });
      } else {
        seenSlugs.set(slug, folderData.index.path);
      }
    }
    
    for (const record of folderData.records) {
      const recordErrors = validateRecord(record.frontmatter, record.path);
      errors.push(...recordErrors);
      
      const slug = record.frontmatter.slug;
      if (seenSlugs.has(slug)) {
        errors.push({
          path: record.path,
          field: 'slug',
          message: `Duplicate slug "${slug}" (also in ${seenSlugs.get(slug)})`,
        });
      } else {
        seenSlugs.set(slug, record.path);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
