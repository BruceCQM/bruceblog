# Python 爬虫入门

> 爬虫四步骤：获取数据、解析数据、提取数据、存储数据

## 获取数据

### requests 模块

```python
import requests

url = 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg'
headers = {
  'origin':'https://y.qq.com',
  # 请求来源
  'referer':'https://y.qq.com/n/yqq/song/004Z8Ihr0JIu5s.html',
  # 请求来源，携带的信息比“origin”更丰富
  'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  # 标记了请求从什么设备，什么浏览器上发出
  }
# 伪装请求头

# 请求歌曲评论的url参数的前面部分
for i in range(5):
  params = {
  'g_tk':'5381',
  'needmusiccrit':'0',
  'pagenum':str(i),
  'pagesize':'15',
  'lasthotcommentid':'song_102065756_3202544866_44059185',
  'domain':'qq.com',
  }
  # 将参数封装为字典
  res_comments = requests.get(url,params=params,headers=headers)
  # 调用get方法，下载这个字典
  json_comments = res_comments.json()
  list_comments = json_comments['comment']['commentlist']
  for comment in list_comments:
      print(comment['rootcommentcontent'])
      print('-----------------------------------')

# 好像最好关闭，否则会保持多个连接，容易被封
res_comments.close()
```

### Response 对象常用属性/方法

| 属性方法        | 含义                           |
| --------------- | ------------------------------ |
| res.status_code | 响应状态码                     |
| res.content     | 转为二进制数据，用于图像音视频 |
| res.text        | 字符串数据                     |
| res.encoding    | 指定编码方式 utf-8，gbk        |
| res.json()      | 将 response 转为字典/列表      |

## 解析数据

解析数据让 Python 看得明白 HTML

### BeautifulSoup

```python
import requests
from bs4 import BeautifulSoup
res = requests.get('https://localprod.pandateacher.com/python-manuscript/crawler-html/spider-men5.0.html')
# 把网页解析为BeautifulSoup对象，第2个参数是解析器
soup = BeautifulSoup(res.text,'html.parser')
```

## 提取数据

### BeautifulSoup 对象 & Tag 对象

BeautifulSoup 对象

| 方法       | 作用                   | 语法                                   | 示例                                 |
| ---------- | ---------------------- | -------------------------------------- | ------------------------------------ |
| find()     | 提取满足要求的首个数据 | BeautifulSoup 对象.find(标签,属性)     | soup.find('div',class\_='books')     |
| find_all() | 提取满足要求的所有数据 | BeautifulSoup 对象.find_all(标签,属性) | soup.find_all('div',class\_='books') |

Tag 对象
| 属性/方法 | 作用 |
| ---------- | ---------------------- |
| Tag.find()和 Tag.find_all() | 提取 Tag 中的 Tag |
| Tag.text | 提取 Tag 中的文字 |
| Tag['属性名'] | 提取 Tag 中这个属性的值 |

```python
# 返回一个Tag类对象
item = soup.find('div')
# 返回一个ResultSet类的对象。
# 其实是Tag对象以列表结构储存了起来
# 可以把它当做列表来处理
items = soup.find_all('div')
```

## 存储数据

### csv 模块

|                |                                            | b             | +            | b+                  |
| -------------- | ------------------------------------------ | ------------- | ------------ | ------------------- |
| r(read,读)     | r 只读，指针在开头，文件不存在则报错       | rb 二进制只读 | r+读写       | rb+二进制读写       |
| w(write,写)    | w 只写，文件不存在则新建，存在则覆盖       | wb 二进制只写 | w+读写       | wb+二进制读写       |
| a(append,追加) | a 追加，文件存在指针放在末尾，不存在则新建 | ab 二进制追加 | a+追加且可读 | ab+二进制追加且可读 |

#### 写文件

```py
import csv

csv_file = open('demo.csv','w',newline='',encoding='utf-8')
# 创建csv文件，文件名“demo.csv”、写入模式“w”、
# newline='',避免表格的行与行之间出现空白行
# encoding='utf-8'。

writer = csv.writer(csv_file)
# 用csv.writer()函数创建一个writer对象
writer.writerow(['电影','豆瓣评分'])
writer.writerow(['银河护卫队','8.0'])

csv_file.close()
```

#### 读文件

```py
import csv
csv_file = open('demo.csv','r',newline='',encoding='utf-8')
reader = csv.reader(csv_file)
for row in reader:
    print(row)
```

### openpyxl 模块

#### 写文件

```py
import openpyxl

wb = openpyxl.Workbook()
# 创建新的workbook（工作簿）对象，就是创建新的空的Excel文件

sheet = wb.active
# wb.active就是获取这个工作簿的活动表，通常就是第一个工作表。
sheet.title = 'new title'
# 给工作表重命名

sheet['A1'] = '漫威宇宙'
row = ['美国队长','钢铁侠','蜘蛛侠']
sheet.append(row)

rows = [['美国队长','钢铁侠','蜘蛛侠'],['是','漫威','宇宙', '经典','人物']]
#先把要写入的多行内容写成列表，再放进大列表里，赋值给rows。
for i in rows:
    sheet.append(i)

wb.save('Marvel.xlsx')
```

#### 读文件

```py
wb = openpyxl.load_workbook('Marvel.xlsx')
sheet = wb['new title']

sheetname = wb.sheetnames
print(sheetname)

A1_cell = sheet['A1']
A1_value = A1_cell.value
print(A1_value)
```
