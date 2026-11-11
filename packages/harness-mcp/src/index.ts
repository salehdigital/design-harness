#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  listFolders,
  readFolder,
  searchRecords,
  getRecordBySlug,
  getRecordByPath,
  validateHarness,
} from '@salehdigital/harness-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let harnessDir: string | null = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && i + 1 < args.length) {
    harnessDir = path.resolve(args[i + 1]);
    break;
  }
}

// Default to bundled saleh-digital harness
if (!harnessDir) {
  harnessDir = path.join(__dirname, '../harnesses/saleh-digital');
}

if (!fs.existsSync(harnessDir)) {
  console.error(`Error: Harness directory not found: ${harnessDir}`);
  process.exit(1);
}

const server = new Server(
  {
    name: 'design-harness',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_folders',
        description: 'List all folders in the design harness',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_records',
        description: 'List all records in a specific folder',
        inputSchema: {
          type: 'object',
          properties: {
            folder: {
              type: 'string',
              description: 'Folder path (e.g., "foundations/brand")',
            },
          },
          required: ['folder'],
        },
      },
      {
        name: 'get_record',
        description: 'Get a specific record by path or slug',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Record path or slug',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_records',
        description: 'Search records by query string',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_brief_context',
        description: 'Get foundations, policy, and memories in one call',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate_harness',
        description: 'Validate the harness structure and content',
        inputSchema: {
          type: 'object',
          properties: {
            dir: {
              type: 'string',
              description: 'Harness directory (optional, defaults to current)',
            },
          },
        },
      },
      {
        name: 'init_harness',
        description: 'Initialize a new harness (writes to filesystem)',
        inputSchema: {
          type: 'object',
          properties: {
            dir: {
              type: 'string',
              description: 'Target directory',
            },
            name: {
              type: 'string',
              description: 'Harness name (saleh-digital or starter)',
              enum: ['saleh-digital', 'starter'],
            },
          },
          required: ['dir', 'name'],
        },
      },
    ],
  };
});

// Call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_folders': {
        const folders = listFolders(harnessDir!);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(folders, null, 2),
            },
          ],
        };
      }

      case 'list_records': {
        const folder = (args as any).folder;
        if (!folder) {
          throw new Error('folder parameter is required');
        }
        const folderData = readFolder(harnessDir!, folder);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  folder: folderData.name,
                  group: folderData.group,
                  index: folderData.index?.frontmatter,
                  records: folderData.records.map((r) => r.frontmatter),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_record': {
        const recordPath = (args as any).path;
        if (!recordPath) {
          throw new Error('path parameter is required');
        }

        let record;
        if (recordPath.includes('/')) {
          record = getRecordByPath(path.join(harnessDir!, recordPath));
        } else {
          record = getRecordBySlug(harnessDir!, recordPath);
        }

        if (!record) {
          throw new Error(`Record not found: ${recordPath}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(record, null, 2),
            },
          ],
        };
      }

      case 'search_records': {
        const query = (args as any).query;
        if (!query) {
          throw new Error('query parameter is required');
        }

        const results = searchRecords(harnessDir!, query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                results.map((r) => ({
                  frontmatter: r.frontmatter,
                  path: r.path,
                  bodyPreview: r.body.substring(0, 200),
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_brief_context': {
        const policy = getRecordBySlug(harnessDir!, 'policy');
        const memories = readFolder(harnessDir!, 'intelligence/memories');
        const foundations = listFolders(harnessDir!).filter((f) =>
          f.startsWith('foundations/')
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  policy: policy?.frontmatter,
                  policyBody: policy?.body,
                  memoriesCount: memories.records.length,
                  foundationFolders: foundations,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'validate_harness': {
        const dir = (args as any).dir || harnessDir!;
        const result = validateHarness(dir);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'init_harness': {
        const targetDir = (args as any).dir;
        const harnessName = (args as any).name;

        if (!targetDir || !harnessName) {
          throw new Error('dir and name parameters are required');
        }

        const sourcePath = path.join(__dirname, '../harnesses', harnessName);
        if (!fs.existsSync(sourcePath)) {
          throw new Error(`Harness "${harnessName}" not found`);
        }

        copyRecursive(sourcePath, targetDir);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Initialized ${harnessName} harness in ${targetDir}`,
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: (error as Error).message,
          }),
        },
      ],
      isError: true,
    };
  }
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const folders = listFolders(harnessDir!);
  const resources = [];

  for (const folder of folders) {
    const folderData = readFolder(harnessDir!, folder);

    if (folderData.index) {
      resources.push({
        uri: `harness:///${folder}`,
        name: folderData.index.frontmatter.title,
        description: folderData.index.frontmatter.description,
        mimeType: 'text/markdown',
      });
    }

    for (const record of folderData.records) {
      resources.push({
        uri: `harness:///${folder}/${record.frontmatter.slug}`,
        name: record.frontmatter.title,
        description: record.frontmatter.description,
        mimeType: 'text/markdown',
      });
    }
  }

  return { resources };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const resourcePath = uri.replace('harness:///', '');

  let record;
  if (resourcePath.includes('/')) {
    const parts = resourcePath.split('/');
    if (parts.length === 2) {
      // Index file
      const folder = readFolder(harnessDir!, resourcePath);
      record = folder.index;
    } else if (parts.length === 3) {
      // Specific record
      const [group, folder, slug] = parts;
      const folderPath = `${group}/${folder}`;
      const folderData = readFolder(harnessDir!, folderPath);
      record = folderData.records.find((r) => r.frontmatter.slug === slug);
    }
  }

  if (!record) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'text/markdown',
        text: `---\n${JSON.stringify(record.frontmatter, null, 2)}\n---\n\n${record.body}`,
      },
    ],
  };
});

// List prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'design_with_harness',
        description: 'Design using the loaded harness context',
        arguments: [
          {
            name: 'task',
            description: 'Design task description',
            required: true,
          },
        ],
      },
    ],
  };
});

// Get prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === 'design_with_harness') {
    const task = request.params.arguments?.task || 'design task';

    const policy = getRecordBySlug(harnessDir!, 'policy');
    const foundations = listFolders(harnessDir!).filter((f) =>
      f.startsWith('foundations/')
    );

    let message = `Design task: ${task}\n\n`;
    message += `Available foundations: ${foundations.join(', ')}\n\n`;

    if (policy) {
      message += `Policy:\n${policy.body}\n\n`;
    }

    message += `Use list_folders, get_record, and search_records to explore the harness.`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: message,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${request.params.name}`);
});

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

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Design harness MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
