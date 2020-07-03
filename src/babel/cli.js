
const {
    SRC_DIR,
    SERVER_OUTPUT_DIR,
    WEB_ROOT,
    NODE_VERSION,
    CLI_SYSTEM_PATH
} = require('../constant')

// 有效的文件
function isCorrectFile(file) {
    return !~file.indexOf(WEB_ROOT) && !~file.indexOf('.DS_Store') && path.extname(file) === '.js' ;
}
// 递归读取文件夹下的文件
function readDir(dir) {
    const ret = [];
    function read(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(item => {
            let currentPath = path.join(dir, item);
            if (fs.statSync(currentPath).isDirectory()) {
                read(currentPath);
            } else {
                // 过滤掉不要的文件
                if (isCorrectFile(currentPath)) {
                    ret.push(currentPath);
                }
            }
        });
    }
    read(dir);
    return ret;
}

module.exports = async function cli(opts){
    const {
        args,
        userConfig = {},
        watch,
        disableEslint
    } = opts;

    // 除了webroot下所有的文件
    const allFiles = readDir(SRC_DIR);
}