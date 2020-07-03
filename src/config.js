const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { CONFIG_FILE_NAME } = require('./constant');
const { typeOf, message } = require('./utils');

const cwd = process.cwd();

function processUserFile(args){
    let userConfig = {};
    const configPath = path.join(cwd, CONFIG_FILE_NAME);
    const configFileExists = fs.existsSync(configPath);

    if(configFileExists){  //配置文件是否存在
        try {
            userConfig = require(configPath);
            delete require.cache[configPath];   //清除缓存
        } catch (e) {
            message.error(`import config file failed: ${e.message}`);
            process.exit(1);
        } 
    } else {
        message.error(`can not find the config file '${CONFIG_FILE_NAME}' in ${cwd}`);
        process.exit(1);
    }

    if (typeOf(userConfig) === 'function') {   //配置文件是一个函数
        userConfig = userConfig({ webpack, args });
    }

    if (typeOf(userConfig) !== 'object') {    //配置文件不是一个对象
        message.error('config must be return an object');
        process.exit(1);
    }
    return userConfig;
}

module.exports = function getUserConfig(args = {}){
    let userConfig = processUserFile(args);
    ['babel', 'webpack', 'i18n', 'pack', 'eslint'].forEach(item => {
        if (!(item in userConfig)) {
            userConfig[item] = {};
        } else if (typeOf(userConfig[item]) !== 'object') {
            userConfig[item] = {};
        }
    });
    return userConfig;
}