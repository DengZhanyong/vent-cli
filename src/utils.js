const chalk = require('chalk')

module.exports = {
    //输出信息类型
    message: {
        error: msg => {
            console.log(chalk.red(msg))
        },
        info: msg => {
            console.log(chalk.cyan(msg))
        },
        success: msg => {
            console.log(chalk.green(msg))
        },
        warning: msg => {
            console.log(chalk.yellow(msg))
        },
    },
    //判断数据类型
    typeOf(o) {
        if (Number.isNaN(o)) return 'nan';
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    }
}