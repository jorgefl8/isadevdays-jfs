#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();
import { github_pagerank } from '../backend/github_pagerank.js';

program
  .usage('github-pagerank [options] <username>')
  .option('-p, --depth <n>', 'Set the depth of the PageRank calculation', 3)
  .option('-d, --damping <d>', 'Set the damping factor value', 0.85)
  .option('-o, --output <f>', 'Write the results to the specified file instead of stdout')
  .on('--help', () => {
    console.log('\nExample:');
    console.log('  $ github-pagerank --depth 5 --output results.txt octocat');
  })
  .parse(process.argv);

const username = program.args[0];
if (!username) {
  console.error('Error: No username provided');
  process.exit(1);
}

const depth = parseInt(`${program.opts().depth}`);
const damping = parseFloat(`${program.opts().damping}`);
console.log(`Calculating PageRank for ${username} with depth ${depth} and damping factor ${damping}.`);
const output = program.output;

const results = await github_pagerank(username, depth, damping);

if (output) {
  const fs = require('fs');
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
} else {
  console.log(JSON.stringify(results, null, 2));
}

