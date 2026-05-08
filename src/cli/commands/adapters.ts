/**
 * AI Memory Bridge - Adapters Command
 */

import chalk from 'chalk';
import { getAllAdapters } from '../../adapters';

export async function listAdaptersCommand(): Promise<void> {
  const adapters = getAllAdapters();

  console.log(chalk.cyan('\n🔌 Available Platform Adapters'));
  console.log(chalk.gray('═'.repeat(50)));

  adapters.forEach((adapter) => {
    console.log(chalk.yellow(`\n${adapter.name}`));
    console.log(`  Version: ${chalk.white(adapter.version)}`);
    console.log(`  Status: ${chalk.green('✓ Available')}`);
  });

  console.log(chalk.gray('\n═'.repeat(50)));
  console.log(chalk.gray(`\nTotal: ${adapters.length} adapter(s)`));
  console.log(chalk.gray('\nUse these platform names with --source or --target options.'));
}
