#!/usr/bin/env node
import chalk from 'chalk';
import fetchGas from '../lib/fetchGas.js';

const [,, network, gasLimit] = process.argv;

async function main() {
  const net = network || 'eth';
  const limit = gasLimit ? parseInt(gasLimit) : 21000;

  try {
    const result = await fetchGas(net, limit);
    console.log(chalk.bold.blue(`🔗 Network:`), net.toUpperCase());
    console.log(chalk.green(`⛽  Gas Price:`), `${result.gasPrice} Gwei`);
    console.log(chalk.yellow(`💸 Estimated TX Cost:`), `$${result.usd}`);
  } catch (err) {
    console.error(chalk.red('❌ Error:'), err.message);
  }
}

main();
