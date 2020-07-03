const parseArgs = require('minimist')
const args = parseArgs(process.argv.slice(2))
const {
  cyan,
  green,
  yellow
} = require('chalk')
const path = require('path')
const fs = require('fs')

const COMMANDS_DIR = path.join(__dirname, './commands')
const command = args._[0]

//退出进程
process.on('SIGINT', () => {
  process.exit(1)
})

//输出版本信息
function outputVersion() {
  let pkg = require('../package.json')
  console.log(`v${pkg.version}`)
  process.exit(0)
}

//输出帮助信息
function outputHelp() {
  console.log(`Usage: ${green('mt')} ${yellow('<command>')} ${cyan('[options]')}
  Options:
  ${cyan('-h, --help')}     output usage information
  ${cyan('-v, --version')}  output the version number  

  commands:
    ${green('mt init')}
      Init project

    ${green('mt start')}
      Start project
      
      Options:
        ${yellow('--inspect')}  inspect

    ${green('mt build')}
      Build project

    ${green('mt pack')}
      pack for project in 'project/release/xxx.tar.gz'

    ${green('mt i18n')} ${yellow('[options]')}
      extract i18n local file
      
      Options:
        ${yellow('--clean')}  clean local file, and then extract
  `)
  process.exit(args.help || command ? 0 : 1)
}
if (args.version || args.v) {
  outputVersion()
}

if (args.help || args.h) {
  outputHelp()
}

const commandModulePath = path.join(COMMANDS_DIR, command)
const commandModule = require(commandModulePath)
if (typeof commandModule === 'function') {
  commandModule(args)
}