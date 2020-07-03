module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json']
            }
        },
        react: {
            pragma: 'React',
            version: 'detect',
        },
        propWrapperFunctions: [
            'forbidExtraProps', // https://www.npmjs.com/package/airbnb-prop-types
            'exact', // https://www.npmjs.com/package/prop-types-exact
            'Object.freeze', // https://tc39.github.io/ecma262/#sec-object.freeze
        ],
    },
    env: {
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            "jsx": true,
            "legacyDecorators": true
        }
    },
    rules: {
        // 1.1 如果你要用 state refs， 最好用 `class extends React.Component` 而不是 `React.createClass`
        'react/prefer-es6-class': ['error', 'always'],
        'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
        // 2.1 **文件名**: 用大驼峰作为文件名。**参数命名**: React 组件用大驼峰，组件的实例用小驼峰。
        'react/jsx-pascal-case': ['error', {
            allowAllCaps: true,
            ignore: [],
        }],
        //   3.1 对 JSX 语法使用这些对齐风格。
        'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
        'react/jsx-closing-tag-location': 'error',
        // 4.1 在自闭和标签内空一格。
        'react/jsx-props-no-multi-spaces': 'error',
        // 4.2 JSX 里的大括号不要空格。
        'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
        // 5.1 如果 prop 的值是 true 可以忽略这个值，直接写 prop 名就可以。
        'react/jsx-boolean-value': ['error', 'never', { always: [] }],
        // 6.1推荐用 ref callback 函数。
        'react/no-string-refs': 'error',
        // 7.1 当 JSX 标签有多行时，用圆括号包起来。
        'react/jsx-wrap-multilines': ['error', {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'parens-new-line',
        }],
        //   7.1 当没有子元素时，最好用自闭合标签。
        'react/self-closing-comp': 'error',
        // 7.2 如果你的组件有多行属性，用他的闭合标签单独作为结束行。
        'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
        // 8.1 在构造函数里绑定事件处理函数。
        'react/jsx-no-bind': ['off', {
            ignoreRefs: true,
            allowArrowFunctions: false,
            allowFunctions: false,
            allowBind: true,
            ignoreDOMComponents: false,
        }],
        //   8.2 确保你的 `render` 函数有返回值。
        'react/require-render-return': 'error',
        'react/jsx-first-prop-new-line': ['error', 'multiline'],
        'react/jsx-max-props-per-line': ['error', { "maximum": 3 }]
    }
}