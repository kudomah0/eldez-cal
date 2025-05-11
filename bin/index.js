#!/usr/bin/env node
import chalk from 'chalk';
import fetchGas from '../lib/fetchGas.js';

const [,, network] = process.argv;

async function main() {
  const net = network || "eth";

  try {
    const result = await fetchGas(net);
    console.log(chalk.bold.blue(`🔗 Network:`), net.toUpperCase());
    console.log(chalk.green(`⛽  Gas Price:`), `${result.gasPrice} Gwei`);
    console.log(chalk.yellow(`💸 Estimated TX Cost:`), `$${result.usd}`); 
  } catch (err) {
    console.error(chalk.red("❌ Error:"), err.message);
  }
}

main();
