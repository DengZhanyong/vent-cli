// const babelCli = require('../babel/cli.js')
// const getUserConfig = require('../config')
// const webpackDevServer = require('../webpack/devServer')
// const {message} = require('../utils')
const {exec} = require('child_process')

module.exports =  async function start(args){
    exec('npm run serve', (err, stdout, stderr) => {
        if(err){
            process.exit(1)
        }
    })
    // try {
    //     const userConfig = getUserConfig(args);   //获取配置文件
    //     const disableEslint = userConfig.eslint.disable;   //获取eslint配置
    //     // await webpackDevServer(args, userConfig, disableEslint);
    //     await babelCli({
    //         args,
    //         userConfig,
    //         watch: true,
    //         disableEslint
    //     });
    // } catch (error) {
    //     message.error(error)
    // }
}