# 我的文章

## 如何获取 URL 查询参数值

### js 代码手撸

灵活度高，可进行更多自定义操作。

```js
const getSearchParams = (url) => {
  const searchIndex = url.indexOf('?')
  const searchParamsArray = url.slice(searchIndex + 1).split('&')
  return searchParamsArray.reduce((pre, cur) => {
    const [key, value] = cur.split('=')
    return {
      ...pre,
      [key]: decodeURIComponent(value),
    }
  }, {})
}

// { name: 'bruce', type: 'blog' }
getSearchParams('https://www.example.com?name=bruce&type=blog')
```

### 利用 `URLSearchParams`

```js
const searchParams = new URLSearchParams('name=bruce&type=blog')

searchParams.get('name') // 'bruce'
searchParams.has('type') // true
```

要把所有查询参数转换为对象，需要搭配使用 `entries()` 和 `Object.fromEntries()` 方法。

`entries()` 方法返回一个 `iterator`，还需进一步转换为对象。

```js
Object.fromEntries(searchParams.entries()) // { name: 'bruce', type: 'blog' }
```

需要注意的是，`URLSearchParams` 只能解析查询字符串，不能解析完整的 URL。因此若要使用其解析查询参数，需要事先提取出 URL 地址的查询字符串。

```js
const params = new URLSearchParams('https://www.example.com?name=bruce&type=blog')

params.get('name') // null
params.get('https://www.example.com?name') // 'bruce'
```

[MDN-URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams){link=card}

### 利用 `URL`

```js
const params = new URL('https://www.example.com?name=bruce&type=blog')
const searchParams = params.searchParams

searchParams.get('name') // 'bruce'
searchParams.get('type') // 'blog'
```

`URL` 可对 URL 地址进行更多维度的解析，其中 `searchParams` 和 `URLSearchParams` 返回的对象相同。

![URL对象](./images/blog_essay/URL_searchParams.png)

[MDN-URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL){link=card}
