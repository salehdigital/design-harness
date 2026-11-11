import { describe, it, expect, beforeAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  listFolders,
  readFolder,
  searchRecords,
  getRecordBySlug,
  validateHarness,
} from '@salehdigital/harness-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const harnessDir = path.join(__dirname, '../harnesses/saleh-digital');

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

describe('MCP Server', () => {
  beforeAll(() => {
    // Copy harnesses for tests
    const harnessesDir = path.join(__dirname, '../../../harnesses');
    const targetDir = path.join(__dirname, '../harnesses');
    if (!fs.existsSync(targetDir)) {
      copyRecursive(harnessesDir, targetDir);
    }
  });
  
  it('creates server and lists tools', async () => {
    const server = new Server(
      {
        name: 'design-harness-test',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_folders',
            description: 'List all folders',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;
      if (name === 'list_folders') {
        const folders = listFolders(harnessDir);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(folders),
            },
          ],
        };
      }
      throw new Error(`Unknown tool: ${name}`);
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    
    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);

    const toolsResult = await client.listTools();
    expect(toolsResult.tools.length).toBeGreaterThan(0);
    expect(toolsResult.tools[0].name).toBe('list_folders');

    const callResult = await client.callTool({
      name: 'list_folders',
      arguments: {},
    });
    
    expect(callResult.content).toBeDefined();
    expect(callResult.content[0].type).toBe('text');
    
    const folders = JSON.parse((callResult.content[0] as any).text);
    expect(Array.isArray(folders)).toBe(true);
    expect(folders.length).toBeGreaterThan(0);

    await client.close();
    await server.close();
  });
});
