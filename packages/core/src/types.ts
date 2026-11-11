export interface RecordFrontmatter {
  title: string;
  slug: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  group?: 'Foundations' | 'Intelligence' | 'Components';
  order?: number;
  chips?: string[];
  discuss?: number;
  created?: string | Date;
  updated?: string | Date;
}

export interface DesignRecord {
  frontmatter: RecordFrontmatter;
  body: string;
  path: string;
}

export interface ValidationError {
  path: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface HarnessFolder {
  name: string;
  path: string;
  group?: 'foundations' | 'intelligence' | 'components';
  index?: DesignRecord;
  records: DesignRecord[];
}
