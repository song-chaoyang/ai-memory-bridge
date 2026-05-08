/**
 * AI Memory Bridge - Convert Command
 * 一键转换命令
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { getAdapter } from '../../adapters';
import { MemoryCore } from '../../core/memory';

interface ConvertCommandOptions {
  source: string;
  target: string;
  input: string;
  output: string;
}

export async function convertCommand(options: ConvertCommandOptions): Promise<void> {
  const spinner = ora(`Converting from ${options.source} to ${options.target}...`).start();

  try {
    // 验证适配器
    const sourceAdapter = getAdapter(options.source);
    const targetAdapter = getAdapter(options.target);

    if (!sourceAdapter) {
      spinner.fail(`Unknown source platform: ${options.source}`);
      console.log(chalk.yellow('Run "aimb adapters" to see available platforms.'));
      process.exit(1);
    }

    if (!targetAdapter) {
      spinner.fail(`Unknown target platform: ${options.target}`);
      console.log(chalk.yellow('Run "aimb adapters" to see available platforms.'));
      process.exit(1);
    }

    // 读取输入文件
    spinner.text = 'Reading input file...';
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
    if (!sourceAdapter.validate(inputData)) {
      spinner.fail(`Invalid format for ${options.source} platform`);
      process.exit(1);
    }

    // 导出为标准记忆体格式
    spinner.text = 'Converting to standard memory format...';
    const memory = await sourceAdapter.export(inputData);

    // 导入为目标平台格式
    spinner.text = `Converting to ${options.target} format...`;
    const targetData = await targetAdapter.import(memory);

    // 保存到文件
    spinner.text = 'Saving output file...';
    await fs.ensureDir(require('path').dirname(options.output));
    await fs.writeFile(
      options.output,
      JSON.stringify(targetData, null, 2),
      'utf-8'
    );

    spinner.succeed('Conversion completed successfully!');

    // 显示统计信息
    const stats = MemoryCore.getStats(memory);
    console.log('\n' + chalk.cyan('📊 Conversion Summary:'));
    console.log(`  Source: ${chalk.white(options.source)}`);
    console.log(`  Target: ${chalk.white(options.target)}`);
    console.log(`  Conversations: ${chalk.white(stats.totalConversations)}`);
    console.log(`  Messages: ${chalk.white(stats.totalMessages)}`);
    console.log(`  Total Tokens: ${chalk.white(stats.totalTokens.toLocaleString())}`);
    console.log(`\nOutput saved to: ${chalk.green(options.output)}`);

  } catch (error) {
    spinner.fail('Conversion failed');
    throw error;
  }
}
