/**
 * AI Memory Bridge - Stats Command
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { MemoryCore } from '../../core/memory';

interface StatsCommandOptions {
  input: string;
  json?: boolean;
}

export async function statsCommand(options: StatsCommandOptions): Promise<void> {
  const spinner = ora('Analyzing memory file...').start();

  try {
    // 读取输入文件
    if (!(await fs.pathExists(options.input))) {
      spinner.fail(`File not found: ${options.input}`);
      process.exit(1);
    }

    const memory = await MemoryCore.importFromFile(options.input);
    const stats = MemoryCore.getStats(memory);

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(stats, null, 2));
      return;
    }

    // 显示统计信息
    console.log(chalk.cyan('\n📊 Memory Statistics'));
    console.log(chalk.gray('═'.repeat(50)));
    
    console.log(chalk.yellow('\n📁 General Information'));
    console.log(`  Source Platform: ${chalk.white(stats.platform)}`);
    console.log(`  Memory Version:  ${chalk.white(memory.version)}`);
    console.log(`  Export Date:     ${chalk.white(memory.exportDate)}`);

    console.log(chalk.yellow('\n💬 Conversations'));
    console.log(`  Total Conversations: ${chalk.white(stats.totalConversations)}`);
    console.log(`  Total Messages:      ${chalk.white(stats.totalMessages)}`);
    console.log(`  Avg Messages/Conv:   ${chalk.white(stats.averageMessagesPerConversation.toFixed(1))}`);

    console.log(chalk.yellow('\n🔢 Tokens'));
    console.log(`  Total Tokens: ${chalk.white(stats.totalTokens.toLocaleString())}`);
    if (stats.totalMessages > 0) {
      console.log(`  Avg Tokens/Message: ${chalk.white(Math.round(stats.totalTokens / stats.totalMessages).toLocaleString())}`);
    }

    console.log(chalk.yellow('\n📅 Date Range'));
    console.log(`  Start: ${chalk.white(stats.dateRange.start)}`);
    console.log(`  End:   ${chalk.white(stats.dateRange.end)}`);

    // 显示最近的对话
    if (memory.conversations.length > 0) {
      console.log(chalk.yellow('\n📝 Recent Conversations'));
      const recentConvs = memory.conversations
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

      recentConvs.forEach((conv, index) => {
        console.log(`  ${index + 1}. ${chalk.white(conv.title)}`);
        console.log(`     Messages: ${chalk.gray(conv.messages.length)} | Updated: ${chalk.gray(conv.updatedAt)}`);
      });

      if (memory.conversations.length > 5) {
        console.log(chalk.gray(`  ... and ${memory.conversations.length - 5} more`));
      }
    }

    console.log(chalk.gray('\n═'.repeat(50)));

  } catch (error) {
    spinner.fail('Failed to analyze memory file');
    throw error;
  }
}
