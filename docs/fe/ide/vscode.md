# vscode 配置

## path Autocomplete

```json
// 配置 @ 的路径提示
"path-autocomplete.pathMappings": {
  "@": "${folder}/src"
},
// 导入文件是否携带文件扩展名
"path-autocomplete.extensionOnImport": true,
```

## ESLint & Prettier - Code formatter

在 `C:\Users\你的用户名` 路径下创建 `.prettierrc` 文件，里面写上 `{"semi": false, "singleQuote": true, "printWidth": 300}` ，接着在 `settings.json` 文件配置：

```json
"editor.codeActionsOnSave": {
    "source.fixAll": true,
},
"eslint.alwaysShowStatus": true,
// 配置prettier
"prettier.configPath": "C:\\Users\\???\\.prettierrc",
// 对象或数组最后一个元素后面是否逗号
"prettier.trailingComma": "none",
// 句尾是否分号
"prettier.semi": false,
// 每行文字个数超出此限制将会被迫换行
"prettier.printWidth": 300,
// 使用单引号替换双引号
"prettier.singleQuote": true,
// (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
"prettier.arrowParens": "avoid",
// 设置 .vue 文件中，HTML代码的格式化插件
"vetur.format.defaultFormatter.html": "js-beautify-html",
"vetur.ignoreProjectWarning": true,
"vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
        "wrap_attributes": false
    },
    "prettyhtml": {
        "printWidth": 300,
        "trailingComma": "none",
        "singleQuote": true,
        "semi": false,
        "arrowParens": "avoid"
    }
}
```

[更多 prettier 配置说明](https://www.jb51.net/article/192952.htm)
