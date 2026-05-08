#!/usr/bin/env node
/**
 * AI Memory Bridge - CLI
 * 命令行接口
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { exportCommand } from './commands/export';
import { importCommand } from './commands/import';
import { convertCommand } from './commands/convert';
import { statsCommand } from './commands/stats';
import { searchCommand } from './commands/search';
import { mergeCommand } from './commands/merge';
import { listAdaptersCommand } from './commands/adapters';

const program = new Command();

program
  .name('ai-memory-bridge')
  .description('🌉 Universal AI Memory Bridge - Export, transform, and import your AI conversations')
  .version('1.0.0');

program
  .command('export')
  .description('Export AI conversations from a platform')
  .requiredOption('-s, --source <platform>', 'Source platform (chatgpt, claude, etc.)')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Output file path')
  .option('-f, --format <format>', 'Output format (json, yaml, markdown)', 'json')
  .option('--no-metadata', 'Exclude metadata from export')
  .action(async (options) => {
    try {
      await exportCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('import')
  .description('Import AI conversations to a platform format')
  .requiredOption('-t, --target <platform>', 'Target platform (chatgpt, claude, etc.)')
  .requiredOption('-i, --input <path>', 'Input memory file path')
  .requiredOption('-o, --output <path>', 'Output file path')
  .option('-s, --strategy <strategy>', 'Merge strategy (overwrite, append, skip)', 'overwrite')
  .action(async (options) => {
    try {
      await importCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('convert')
  .description('Convert between AI platforms (export + import in one step)')
  .requiredOption('-s, --source <platform>', 'Source platform')
  .requiredOption('-t, --target <platform>', 'Target platform')
  .requiredOption('-i, --input <path>', 'Input file path')
  .requiredOption('-o, --output <path>', 'Output file path')
  .action(async (options) => {
    try {
      await convertCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show statistics for a memory file')
  .requiredOption('-i, --input <path>', 'Input memory file path')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      await statsCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('search')
  .description('Search within a memory file')
  .requiredOption('-i, --input <path>', 'Input memory file path')
  .requiredOption('-q, --query <query>', 'Search query')
  .action(async (options) => {
    try {
      await searchCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('merge')
  .description('Merge multiple memory files')
  .requiredOption('-i, --inputs <paths...>', 'Input memory file paths')
  .requiredOption('-o, --output <path>', 'Output file path')
  .option('-s, --source <name>', 'Source name for merged memory', 'merged')
  .action(async (options) => {
    try {
      await mergeCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('adapters')
  .description('List available platform adapters')
  .action(async () => {
    try {
      await listAdaptersCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// 如果没有参数，显示帮助
if (process.argv.length === 2) {
  program.help();
}

program.parse();
