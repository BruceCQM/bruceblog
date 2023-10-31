# 富文本编辑器

[wangEditor](https://www.wangeditor.com/){link=card}

## 前言

最近有一个需求，要做一个富文本编辑器，要有最基础的功能，比如字体样式加粗斜体、标题、字体颜色、插入图片等，同时还需要根据标题生成目录。

像这种功能肯定不能自己造轮子，于是调研了一些第三方开源富文本编辑器，最初的技术选型是 [braft-editor](https://github.com/margox/braft-editor)。但在开发时发现用起来不简便，在有经验的前辈的推荐下最终选择了 [wangEditor](https://www.wangeditor.com/)，功能丰富，用法也更简易。

![wangEditor](./images/editor/wang_editor.png)

:::tip
以下内容都基于 React 进行开发。
:::

## 安装

```sh
npm install @wangeditor/editor

npm install @wangeditor/editor-for-react
```

## 基础用法

```jsx
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'

function MyEditor() {
  const [editor, setEditor] = useState(null)
  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>')

  // 工具栏配置
  const toolbarConfig = {}

  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
        <Editor defaultConfig={editorConfig} value={html} onCreated={setEditor} onChange={(editor) => setHtml(editor.getHtml())} mode="default" style={{ height: '500px', overflowY: 'hidden' }} />
      </div>
      <div style={{ marginTop: '15px' }}>{html}</div>
    </>
  )
}

export default MyEditor
```

## 工具栏配置
该富文本编辑器提供的功能太丰富了，实际上用不着那么多，而且有些特殊样式的回显存在问题，例如表格，因此需要隐藏工具栏某些工具菜单，不提供相关功能。

### `getConfig()` 获取工具栏配置

```js
import { DomEditor } from '@wangeditor/editor'
const toolbar = DomEditor.getToolbar(editor)
const curToolbarConfig = toolbar.getConfig()
console.log(curToolbarConfig.toolbarKeys) // 菜单的key顺序和分组
```
`curToolbarConfig.toolbarKeys` 的内容如下。

![toolbarKeys](./images/editor/toolbarkeys.png)


### `excludeKeys` 排除某些菜单
如果仅仅想排除掉某些菜单，其他都保留，可以使用 `excludeKeys` 来配置。

写菜单的 key 值即可，菜单 key 通过 `toolbarKeys` 获取查看。

```js
if (curToolbarConfig) {
  curToolbarConfig.excludeKeys = [
    'emotion', // 表情
    'insertTable', // 插入表格
    'insertImage', // 网络图片
  ];
}
```

可以看到，表情、插入表格、网络图片等菜单都隐藏了。

![excludeKeys](./images/editor/excludeKeys.png)

### 完整代码

```js
useEffect(() => {
  if (editor) {
    const toolbar = DomEditor.getToolbar(editor);
    const curToolbarConfig = toolbar?.getConfig();
    if (curToolbarConfig) {
      curToolbarConfig.excludeKeys = [
        'emotion',
        'insertTable',
        'insertImage',
      ];
    }
  }

  return () => {
    if (editor === null) return;
    editor.destroy();
    setEditor(null);
  };
}, [editor]);
```

## 图片自定义上传与回显

## 目录生成
