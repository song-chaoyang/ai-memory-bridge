/**
 * AI Memory Bridge - Export Command
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { getAdapter } from '../../adapters';
import { ExportOptions } from '../../core/types';
import { MemoryCore } from '../../core/memory';

interface ExportCommandOptions {
  source: string;
  input: string;
  output: string;
  format: string;
  metadata: boolean;
}

export async function exportCommand(options: ExportCommandOptions): Promise<void> {
  const spinner = ora('Exporting AI conversations...').start();

  try {
    // 验证适配器
    const adapter = getAdapter(options.source);
    if (!adapter) {
      spinner.fail(`Unknown platform: ${options.source}`);
      console.log(chalk.yellow('Run "aimb adapters" to see available platforms.'));
      process.exit(1);
    }

    // 读取输入文件
    spinner.text = `Reading input file: ${options.input}`;
    if (!(await fs.pathExists(options.input))) {
      spinner.fail(`Input file not found: ${options.input}`);
      process.exit(1);
    }

    const inputContent = await fs.readFile(options.input, 'utf-8');
    let inputData: unknown;

    try {
      inputData = JSON.parse(inputContent);
    } catch {
      spinner.fail('Invalid JSON input file');
      process.exit(1);
    }

    // 验证输入格式
    spinner.text = 'Validating input format...';
    if (!adapter.validate(inputData)) {
      spinner.fail(`Invalid format for ${options.source} platform`);
      process.exit(1);
    }

    // 导出为标准记忆体格式
    spinner.text = 'Converting to standard memory format...';
    const exportOptions: ExportOptions = {
      format: options.format as 'json' | 'yaml' | 'markdown',
      includeMetadata: options.metadata,
    };

    const memory = await adapter.export(inputData, exportOptions);

    // 保存到文件
    spinner.text = `Saving to ${options.output}...`;
    await MemoryCore.exportToFile(memory, options.output, exportOptions);

    spinner.succeed('Export completed successfully!');

    // 显示统计信息
    const stats = MemoryCore.getStats(memory);
    console.log('\n' + chalk.cyan('📊 Export Summary:'));
    console.log(`  Platform: ${chalk.white(stats.platform)}`);
    console.log(`  Conversations: ${chalk.white(stats.totalConversations)}`);
    console.log(`  Messages: ${chalk.white(stats.totalMessages)}`);
    console.log(`  Total Tokens: ${chalk.white(stats.totalTokens.toLocaleString())}`);
    console.log(`  Date Range: ${chalk.white(stats.dateRange.start)} to ${chalk.white(stats.dateRange.end)}`);
    console.log(`\nOutput saved to: ${chalk.green(options.output)}`);

  } catch (error) {
    spinner.fail('Export failed');
    throw error;
  }
}
