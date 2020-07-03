const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const eslint = require('../eslint/index')

function getHMRClientEntries(host, port) {
    const hmrURL = `http://${host}:${port}/`;
    return [
        `${resolve('webpack-dev-server/client/')}?${hmrURL}`,
        resolve('webpack/hot/dev-server')
    ];
}

function createConfig(host, port, plugins, disableEslint) {
    const publicPath = `http://${host}:${port}/`

    const rules = [];
    if (!disableEslint) {
        rules.push({
            enforce: "pre",
            test: /\.(js|jsx)$/,
            exclude: /\.tmp/,
            include: WEB_ROOT_ABSOLUTE,
            loader: resolve('eslint-loader'),
            options: {
                useEslintrc: false,
                formatter: require("eslint-friendly-formatter"),
                parser: resolve("babel-eslint"),
                resolvePluginsRelativeTo: CLI_SYSTEM_PATH,
                plugins: [
                    "import",
                    "react",
                    "react-hooks",
                    "jsx-a11y"
                ],
                baseConfig: {
                    extends: eslint.extends
                },
            }
        });
    }
    return {
        entry: getHMRClientEntries(host, port),
        output: {
            publicPath
        },
        devtool: '#cheap-module-source-map',
        module: { rules },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin(),
            ...plugins
        ],
        optimization: {
            noEmitOnErrors: true
        },
    }
}

module.exports = function webpackDevServer(userConfig, disableEslint){
    process.env.NODE_ENV = 'development'   //设置成开发环境
    console.log('waiting.....')

    // createReactApp(true);

    const userDevServer = userConfig.webpack.devServer || {};  //webpack配置

    const {
        port = WEBPACK_SERVER_PORT,
        host = WEBPACK_SERVER_HOST
    } = userDevServer;
}