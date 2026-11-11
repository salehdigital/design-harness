import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { DesignRecord, RecordFrontmatter, HarnessFolder } from './types.js';

export function parseRecord(filePath: string): DesignRecord {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  return {
    frontmatter: data as RecordFrontmatter,
    body: body.trim(),
    path: filePath,
  };
}

export function listFolders(harnessDir: string): string[] {
  const groups = ['foundations', 'intelligence', 'components'];
  const folders: string[] = [];
  
  for (const group of groups) {
    const groupPath = path.join(harnessDir, group);
    if (!fs.existsSync(groupPath)) continue;
    
    const entries = fs.readdirSync(groupPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        folders.push(path.join(group, entry.name));
      }
    }
  }
  
  return folders;
}

export function readFolder(harnessDir: string, folderPath: string): HarnessFolder {
  const fullPath = path.join(harnessDir, folderPath);
  const folderName = path.basename(folderPath);
  const groupName = path.dirname(folderPath) as 'foundations' | 'intelligence' | 'components';
  
  const files = fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));
  
  const records: DesignRecord[] = [];
  let index: DesignRecord | undefined;
  
  // Look for index file in parent directory (e.g., foundations/brand.md for foundations/brand/)
  const parentDir = path.join(harnessDir, groupName);
  const indexFilePath = path.join(parentDir, `${folderName}.md`);
  if (fs.existsSync(indexFilePath)) {
    index = parseRecord(indexFilePath);
  }
  
  // Read records from the folder itself
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const record = parseRecord(filePath);
    records.push(record);
  }
  
  return {
    name: folderName,
    path: folderPath,
    group: groupName,
    index,
    records,
  };
}

export function searchRecords(harnessDir: string, query: string): DesignRecord[] {
  const lowerQuery = query.toLowerCase();
  const results: DesignRecord[] = [];
  const folders = listFolders(harnessDir);
  
  for (const folder of folders) {
    const folderData = readFolder(harnessDir, folder);
    
    if (folderData.index) {
      if (matchesQuery(folderData.index, lowerQuery)) {
        results.push(folderData.index);
      }
    }
    
    for (const record of folderData.records) {
      if (matchesQuery(record, lowerQuery)) {
        results.push(record);
      }
    }
  }
  
  return results;
}

function matchesQuery(record: DesignRecord, query: string): boolean {
  const { frontmatter, body } = record;
  
  return (
    frontmatter.title?.toLowerCase().includes(query) ||
    frontmatter.slug?.toLowerCase().includes(query) ||
    frontmatter.description?.toLowerCase().includes(query) ||
    body.toLowerCase().includes(query) ||
    frontmatter.chips?.some(chip => typeof chip === 'string' && chip.toLowerCase().includes(query)) ||
    false
  );
}

export function getRecordBySlug(harnessDir: string, slug: string): DesignRecord | null {
  const folders = listFolders(harnessDir);
  
  for (const folder of folders) {
    const folderData = readFolder(harnessDir, folder);
    
    if (folderData.index?.frontmatter.slug === slug) {
      return folderData.index;
    }
    
    for (const record of folderData.records) {
      if (record.frontmatter.slug === slug) {
        return record;
      }
    }
  }
  
  return null;
}

export function getRecordByPath(filePath: string): DesignRecord | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return parseRecord(filePath);
}
