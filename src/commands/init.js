const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const ora = require('ora')
const rimraf = require('rimraf')
const {exec} = require('child_process')

const {
  PROJECT_TYPE,
  DEFAULT_PROJECT_NAME,
  CSS_FILE,
  VUE_TEMPLATE,
  VUE_FILES
} = require('../constant.js')
const cwd = process.cwd();

async function init(args) {
  try {
    // let [projectType] = args._.slice(1);
    let [projectName] = args._.slice(1);
    // if (!projectType || !TEMPLATE_PROJECT_NAME[projectType]) {
    //   projectType = await inquirer.prompt([{
    //     type: 'list',
    //     message: chalk.italic('Choose project type:'),
    //     choices: PROJECT_TYPE,
    //     default: 'base',
    //     name: 'type'
    //   }]).then(
    //     as => as.type
    //   );
    // }
    if (!projectName) {
      projectName = await inquirer.prompt([{
        type: 'input',
        message: chalk.italic('Input project name:'),
        name: 'name'
      }]).then(
        as => as.name
      );
    }
    projectName = projectName || DEFAULT_PROJECT_NAME;
    if(fs.existsSync(path.join(cwd, projectName))){
      console.log(chalk.red(`Diretory '${projectName}' already existed!`));
      process.exit(1);
    }
    
    //设置项目信息
    const projectDesc = await inquirer.prompt([
      {
        type: 'input',
        message: 'Project description：',
        name: 'desc'
      }
    ]).then(
        as => as.desc
    )

    const author = await inquirer.prompt([
      {
        type: 'input',
        message: 'Author：',
        name: 'author'
      }
    ]).then(
        as => as.author
    )

    const cssPre = await inquirer.prompt([
      {
        type: 'list',
        message: chalk.italic('Choose CSS preprocessor:'),
        choices: ['less', 'sass', 'stylus', 'none'],
        default: 'base',
        name: 'css'
      }
    ]).then(
      as => as.css
    )

    const cpProjectSpin = ora({
        text: `Cloning module folder from git into '${projectName}'`,
        color: 'cyan'
    }).start();
    exec(`git clone ${VUE_TEMPLATE} ${projectName}`, (err, stdout, stderr) => {
      if (err) {
          console.error(`执行的错误: ${err}`);
          process.exit(1);
      }
      cpProjectSpin.succeed();
      let [cssPreNpm, cssPreLoaderNpm, type, lang, variableSymbols] = ['', '', 'css', '', '']
      switch(cssPre){
        case 'less': 
          cssPreNpm = `"less": "^3.11.1",`;
          cssPreLoaderNpm = `"less-loader": "^6.1.0",`
          type = 'less'
          lang = 'less'
          variableSymbols = '@'
          break;
        case 'sass': 
          cssPreNpm = `"scss": "^0.2.4",`;
          cssPreLoaderNpm = `"scss-loader": "^0.0.1",`
          type = 'scss'
          lang = 'scss'
          variableSymbols = '$'
          break;
        case 'stylus': 
          cssPreNpm = `"stylus": "^0.54.7",`;
          cssPreLoaderNpm = `"stylus-loader": "^3.0.2",`
          type = 'styl'
          lang = 'stylus'
          variableSymbols = '$'
          break;
        default: 
          break;
      }
      editConfig({
          projectName,
          projectDesc,
          author,
          cssPre: {
            cssPreNpm,
            cssPreLoaderNpm,
            type,
            lang,
            variableSymbols
          }
      });
  });
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function deleteCss(projectName, type){
  let cssFile = path.join(cwd, projectName, CSS_FILE)
  let files = fs.readdirSync(cssFile)
  files.forEach(file => {
    if(!file.endsWith(`.${type}`)){
      fs.unlinkSync(path.join(cwd, projectName, CSS_FILE, file))
    }
  });
}

function changeVueStyle(dir, cssPre){
  let files = fs.readdirSync(dir)
  files.forEach(file => {
    let currentPath = path.join(dir, file)
    if(fs.statSync(currentPath).isDirectory()){
      changeVueStyle(currentPath)
    }else{
      if(currentPath.endsWith('.vue')){
        let content = fs.readFileSync(currentPath, {encoding: 'utf-8'})
        content = content.replace(`lang="less" `, cssPre.lang ? `lang="${cssPre.lang}"` : '')
                        .replace(/@import '\.\.\/assets\/css\/config\.less';/g,cssPre.lang ? `@import '../assets/css/config.${cssPre.type}';` : '')
                        .replace(/@main-color/g, `${cssPre.variableSymbols ? cssPre.variableSymbols + 'main-color' : '#3eaf7c'}`)
                        .replace(/@link-color/g, `${cssPre.variableSymbols ? cssPre.variableSymbols + 'link-color' : '#ec0a88'}`)
        fs.writeFileSync(currentPath, content)
      }
    }
  });
}


function editConfig({ projectName = "", projectDesc = "", author = "",cssPre= "" }){
  const editConfigSpin = ora({
      text: `Modifying project config`,
      type: 'runner',
      color: 'cyan'
  }).start();
  rimraf(path.join(cwd, projectName, '.git'), (err) => {
    if(err){
      console.log(chalk.red('删除.git失败'));
      process.exit(1); 
    }
    else{
      //修改package
      let packageString = fs.readFileSync(path.join(cwd, projectName, 'package.json'), { encoding: 'utf-8' })
      packageString = packageString.replace('{{projectName}}', projectName)
                .replace('{{projectDescription}}', projectDesc)
                .replace('{{author}}', author)
                .replace(`"{{cssPreNpm}}": "{{cssPreNpmVersion}}",`, cssPre.cssPreNpm)
                .replace(`"{{cssPreLoaderNpm}}": "{{cssPreLoaderNpmVersion}}",`, cssPre.cssPreLoaderNpm)
      fs.writeFileSync(path.join(cwd, projectName, 'package.json'), packageString);
      //修改main.js
      let mainJsString = fs.readFileSync(path.join(cwd, projectName, 'src/main.js'), { encoding: 'utf-8' })
      mainJsString = mainJsString.replace(/{{cssPreType}}/g, cssPre.type)
      fs.writeFileSync(path.join(cwd, projectName, 'src/main.js'), mainJsString)
      //删除多余的样式文件
      deleteCss(projectName, cssPre.type)
      //修改.vue中的样式
      VUE_FILES.forEach(item => {
        changeVueStyle(path.join(cwd, projectName, item), cssPre)
      });
      editConfigSpin.succeed();
    }
  })
}

module.exports = init