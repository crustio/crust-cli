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
  .command('login')
  .description('Login with Crust Account secret seeds')
  .option('-s, --seeds [value]', 'Secret seeds of your Crust Account, 12 words')
  .action((args) => withHelper(args.seeds, () => program.help(), () => login(args.seeds)))

program
  .command('pin')
  .description('Pin file/folder to local IPFS')
  .option('-p --path [path]', 'File or directory you want to publish')
  .action((args) => withHelper(args.path, () => program.help(), () => pin(args.path)))

program
  .command('publish')
  .description('Publish file/folder to Crust Network by placing a storage order')
  .option('-c --cid [cid]', 'File cid already been pinned locally')
  .action((args) => withHelper(args.cid, () => program.help(), () => publish(args.cid)))

program
  .command('status')
  .description('Check status of your published file/folder')
  .option('-c --cid [cid]', 'File cid already been published')
  .action((args) => withHelper(args.cid, () => program.help(), () => status(args.cid)))

program.addHelpText('before', chalk.yellow(figlet.textSync('crust-cli', {horizontalLayout: 'full'})));

program.parse(process.argv)