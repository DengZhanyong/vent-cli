const path = require('path')

const SRC_DIR = 'src'

module.exports = {
  'PROJECT_TYPE': ['base', 'other'],
  'DEFAULT_PROJECT_NAME': 'myProject',   //默认项目名称
  'CONFIG_FILE_NAME': 'vent.config.js',
  'SRC_DIR': SRC_DIR,
  'WEB_ROOT': path.join(SRC_DIR, 'webroot'),// web源码目录
  'NODE_VERSION': '12.16.3',//node版本
  'CLI_SYSTEM_PATH': path.resolve(__dirname, '../'),// cli系统路径
  'CSS_FILE': 'src/assets/css/',
  'VUE_TEMPLATE': 'https://github.com/DengZhanyong/vue-init.git',  //VUE模板路径
  'VUE_FILES': ['src/components', 'src/views'],   //存在.vue文件的文件夹
}