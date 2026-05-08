/**
 * AI Memory Bridge - Search Command
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { MemoryCore } from '../../core/memory';
import { Conversation } from '../../core/types';

interface SearchCommandOptions {
  input: string;
  query: string;
}

export async function searchCommand(options: SearchCommandOptions): Promise<void> {
  const spinner = ora('Searching memory file...').start();

  try {
    // 读取输入文件
    if (!(await fs.pathExists(options.input))) {
      spinner.fail(`File not found: ${options.input}`);
      process.exit(1);
    }

    const memory = await MemoryCore.importFromFile(options.input);
    const results = MemoryCore.search(memory, options.query);

    spinner.stop();

    if (results.length === 0) {
      console.log(chalk.yellow('\n🔍 No results found for: ') + chalk.white(options.query));
      return;
    }

    console.log(chalk.cyan(`\n🔍 Found ${results.length} conversation(s) matching: `) + chalk.white(options.query));
    console.log(chalk.gray('═'.repeat(60)));

    results.forEach((conv: Conversation, index: number) => {
      console.log(chalk.yellow(`\n${index + 1}. ${conv.title}`));
      console.log(chalk.gray(`   ID: ${conv.id}`));
      console.log(chalk.gray(`   Messages: ${conv.messages.length}`));
      console.log(chalk.gray(`   Updated: ${conv.updatedAt}`));

      // 显示匹配的消息预览
      const matchingMessages = conv.messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(options.query.toLowerCase())
      );

      if (matchingMessages.length > 0) {
        console.log(chalk.cyan('   Matching messages:'));
        matchingMessages.slice(0, 2).forEach((msg) => {
          const preview = msg.content.length > 100
            ? msg.content.substring(0, 100) + '...'
            : msg.content;
          const roleEmoji = msg.role === 'user' ? '👤' : '🤖';
          console.log(`     ${roleEmoji} ${chalk.gray(preview.replace(/\n/g, ' '))}`);
        });

        if (matchingMessages.length > 2) {
          console.log(chalk.gray(`     ... and ${matchingMessages.length - 2} more matches`));
        }
      }
    });

    console.log(chalk.gray('\n═'.repeat(60)));

  } catch (error) {
    spinner.fail('Search failed');
    throw error;
  }
}
