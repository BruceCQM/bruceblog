# 计算机网络

## HTTP 状态码

### 总览

| 状态码 | 代表状态                | 含义                     |
| ------ | ----------------------- | ------------------------ |
| 1xx    | information 信息        | 请求正在处理             |
| 2xx    | success 成功            | 请求成功                 |
| 3xx    | redirection 重定向      | 需要进行附加操作完成请求 |
| 4xx    | client error 客户端错误 | 客户端出错               |
| 5xx    | server error 服务端错误 | 服务端出错               |

### 4xx

| 状态码                     | 含义                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| 400 Bad Request            | 请求报文存在语法错误，需修改再次发送                                                         |
| 401 Unauthorized           | 发送的请求需要有通过 HTTP 认证的认证信息或认证失败                                           |
| 403 Forbidden              | 服务器拒绝访问。**跨域**访问、未获得文件系统的访问授权、从未授权的 IP 发送请求都可能返回 403 |
| 404 Not Found              | 找不到请求的资源                                                                             |
| 415 Unsupported Media Type | 服务器无法处理请求附带的媒体格式，通过添加 `content-type` 请求头指明数据类型                 |

400 一般是两种情况：

- 前端传的参数类型或者名称与后台接收参数的实体类的属性类型或者名称不一致
- 前端提交 ajax 请求的数据应该是 json 格式字符串的，但是却没有将对象转换成 json 格式的字符串

401 和 403 的区别：

- 401 指客户端没有认证或认证失败，可以修改认证信息重试
- 403 指客户端认证成功了，但没有资格访问资源，且在获得权限之前不用再重试了

### 5xx

| 状态码                         | 含义                                               |
| ------------------------------ | -------------------------------------------------- |
| 500 Internal Server Error      | 服务端内部错误                                     |
| 501 Not Implemented            | 服务端无法完成请求，如无法识别请求方法             |
| 502 Bad Gateway                | 网关错误，可能是服务器没开或压力太大响应不过来     |
| 503 Service Unavailable        | 服务端处于超负载状态或正停机维护，暂时无法处理请求 |
| 504 Gateway Time-out           | 网关超时                                           |
| 505 HTTP Version Not Supported | 服务端不支持 HTTP 协议的版本                       |

#### 相关链接

- [HTTP Status 400 (HTTP400 状态码)](https://blog.csdn.net/qq_22182643/article/details/103103078/)

- [401 与 403 的区别](https://blog.csdn.net/condoleeA/article/details/104589824/)

- [HTTP 状态码 401 和 403 深度解析](https://juejin.cn/post/6844903590763429895)

- [HTTP 请求返回 415 错误码定位解决](https://majing.blog.csdn.net/article/details/78383772)

- [HTTP 状态码 502 深度解析](https://blog.csdn.net/Xu_pengtao/article/details/122884259)
