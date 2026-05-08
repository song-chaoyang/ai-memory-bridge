/**
 * AI Memory Bridge - Merge Command
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { MemoryCore } from '../../core/memory';
import { AIMemory } from '../../core/types';

interface MergeCommandOptions {
  inputs: string[];
  output: string;
  source: string;
}

export async function mergeCommand(options: MergeCommandOptions): Promise<void> {
  const spinner = ora('Merging memory files...').start();

  try {
    const memories: AIMemory[] = [];

    // 读取所有输入文件
    for (const inputPath of options.inputs) {
      spinner.text = `Reading: ${inputPath}`;

      if (!(await fs.pathExists(inputPath))) {
        spinner.fail(`File not found: ${inputPath}`);
        process.exit(1);
      }

      try {
        const memory = await MemoryCore.importFromFile(inputPath);
        memories.push(memory);
      } catch (error) {
        spinner.fail(`Failed to parse: ${inputPath}`);
        throw error;
      }
    }

    // 合并记忆体
    spinner.text = 'Merging memories...';
    const merged = MemoryCore.merge(memories, options.source);

    // 保存到文件
    spinner.text = `Saving to: ${options.output}`;
    await MemoryCore.exportToFile(merged, options.output, { format: 'json' });

    spinner.succeed('Merge completed successfully!');

    // 显示统计信息
    const stats = MemoryCore.getStats(merged);
    console.log('\n' + chalk.cyan('📊 Merge Summary:'));
    console.log(`  Source Files: ${chalk.white(options.inputs.length)}`);
    console.log(`  Total Conversations: ${chalk.white(stats.totalConversations)}`);
    console.log(`  Total Messages: ${chalk.white(stats.totalMessages)}`);
    console.log(`  Total Tokens: ${chalk.white(stats.totalTokens.toLocaleString())}`);
    console.log(`\nOutput saved to: ${chalk.green(options.output)}`);

  } catch (error) {
    spinner.fail('Merge failed');
    throw error;
  }
}
