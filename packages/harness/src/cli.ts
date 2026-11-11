#!/usr/bin/env node

import { Command } from 'commander';
import { initHarness, listFolders, validateHarness } from './commands.js';

const program = new Command();

program
  .name('harness')
  .description('Design harness CLI - manage and publish design systems')
  .version('0.1.0');

program
  .command('init [name]')
  .description('Initialize a design harness (default: saleh-digital)')
  .option('--starter', 'Use the starter template instead')
  .option('--force', 'Overwrite existing files')
  .option('--dir <dir>', 'Target directory', './design-harness')
  .action(async (name, options) => {
    const harnessName = options.starter ? 'starter' : (name || 'saleh-digital');
    try {
      await initHarness(harnessName, options.dir, options.force);
      console.log(`✓ Initialized ${harnessName} harness in ${options.dir}`);
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all folders in the harness')
  .option('--dir <dir>', 'Harness directory', './design-harness')
  .action((options) => {
    try {
      const folders = listFolders(options.dir);
      if (folders.length === 0) {
        console.log('No folders found');
      } else {
        console.log(`Found ${folders.length} folders:\n`);
        for (const folder of folders) {
          console.log(`  ${folder}`);
        }
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program
  .command('validate [dir]')
  .description('Validate a design harness')
  .action((dir = './design-harness') => {
    try {
      const result = validateHarness(dir);
      if (result.valid) {
        console.log('✓ Harness is valid');
      } else {
        console.error(`✗ Found ${result.errors.length} validation error(s):\n`);
        for (const error of result.errors) {
          const location = error.field ? `${error.path}:${error.field}` : error.path;
          console.error(`  ${location}: ${error.message}`);
        }
        process.exit(1);
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program.parse();
