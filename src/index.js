#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const program = require('commander');
const login = require('./login').default;
const pin = require('./pin').default;
const publish = require('./publish').default;
const status = require('./status').default;
const { withHelper } = require('./util');

program
  .version('0.0.1')
  .description(
    'The Crust command-line interface (Crust CLI) is a set of commands used to access Crust Network resources'
  )

program
  .command('login [SEEDS]')
  .description('Login with Crust Account secret seeds(12 words)')
  .action((seeds) => withHelper(seeds, () => program.help(), () => login(seeds)))

program
  .command('pin [FILES]')
  .description('Pin file/folder to local IPFS')
  .action((path) => withHelper(path, () => program.help(), () => pin(path)))

program
  .command('publish [CID]')
  .description('Publish file cid to Crust Network by placing a storage order')
  .action((cid) => withHelper(cid, () => program.help(), () => publish(cid)))

program
  .command('status [CID]')
  .description('Check status of your published cid')
  .action((cid) => withHelper(cid, () => program.help(), () => status(cid)))

program.addHelpText('before', chalk.yellow(figlet.textSync('crust-cli', {horizontalLayout: 'full'})));

program.parse(process.argv)