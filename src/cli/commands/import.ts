/**
 * AI Memory Bridge - Import Command
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { getAdapter } from '../../adapters';
import { ImportOptions } from '../../core/types';
import { MemoryCore } from '../../core/memory';

interface ImportCommandOptions {
  target: string;
  input: string;
  output: string;
  strategy: string;
}

export async function importCommand(options: ImportCommandOptions): Promise<void> {
  const spinner = ora('Importing AI conversations...').start();

  try {
    // 验证适配器
    const adapter = getAdapter(options.target);
    if (!adapter) {
      spinner.fail(`Unknown platform: ${options.target}`);
      console.log(chalk.yellow('Run "aimb adapters" to see available platforms.'));
      process.exit(1);
    }

    // 读取输入文件
    spinner.text = `Reading memory file: ${options.input}`;
    if (!(await fs.pathExists(options.input))) {
      spinner.fail(`Input file not found: ${options.input}`);
      process.exit(1);
    }

    // 导入记忆体
    const memory = await MemoryCore.importFromFile(options.input);

    spinner.text = `Converting to ${options.target} format...`;

    const importOptions: ImportOptions = {
      mergeStrategy: options.strategy as 'overwrite' | 'append' | 'skip',
      validateSchema: true,
    };

    const targetData = await adapter.import(memory, importOptions);

    // 保存到文件
    spinner.text = `Saving to ${options.output}...`;
    await fs.ensureDir(require('path').dirname(options.output));
    await fs.writeFile(
      options.output,
      JSON.stringify(targetData, null, 2),
      'utf-8'
    );

    spinner.succeed('Import completed successfully!');

    // 显示统计信息
    const stats = MemoryCore.getStats(memory);
    console.log('\n' + chalk.cyan('📊 Import Summary:'));
    console.log(`  Source Platform: ${chalk.white(stats.platform)}`);
    console.log(`  Target Platform: ${chalk.white(options.target)}`);
    console.log(`  Conversations: ${chalk.white(stats.totalConversations)}`);
    console.log(`  Messages: ${chalk.white(stats.totalMessages)}`);
    console.log(`\nOutput saved to: ${chalk.green(options.output)}`);

  } catch (error) {
    spinner.fail('Import failed');
    throw error;
  }
}
