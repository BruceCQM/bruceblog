# Ant Design 用法与坑点总结

[Ant Design](https://ant.design/index-cn){link=card}

## 前言

Ant Design 是蚂蚁出品的出色优秀的 React 组件库，相信使用 React 进行管理系统开发的小伙伴们或多或少都接触过 Ant Design。很多公司基于 React 开发的管理端系统也都是使用 Ant Design 的组件库。

因此，了解 Ant Design 的常见用法与坑点还是有必要的。

本系列文章针对 Ant Design 一些官方文档虽有提及，但是容易被忽略的，又比较重要常见的用法进行总结。同时对工作使用过程当中遇到的坑点进行归纳。

:::tip
文章使用的 4.x 版本的 Ant Design。
:::

## Form 触发表单验证

`Form.Item` 的 `rules` 表单验证规则，需要调用 `validateFields()` 方法触发表单验证才能真正阻止不符合规则的表单的提交。

如果仅仅定义了 `rules` 规则，而没有调用 `validateFields()` 方法进行验证，即使表单没通过校验，依然可以提交。

```jsx
const handleSubmit = async () => {
  // 触发表单验证，注意该方法是异步的
  await form.validateFields()
  submitForm()
}
```

```jsx
<Form.Item
  name="mobile"
  label="手机号码或座机"
  rules={[
    { required: true, message: '请输入手机号码或座机号码' },
    { pattern: /......../, message: '请输入正确的手机号或座机号' },
  ]}
>
  <Input placeholder="请输入手机号或座机号" />
</Form.Item>
```

## Form 自定义校验规则的两种写法

自定义表单校验规则灵活度更高，可以针对一些特殊场景、特殊规则进行设置。日常工作使用概率比较大。

**方式一：对象写法**

```jsx
<Form.Item
  name="mobile"
  label="手机号"
  rules={[
    {
      // rule 参数是 Form.Item 的校验规则 rules
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(new Error('请输入手机号'))
        }
        if (value.length > 11) {
          return Promise.reject(new Error('手机号不超过11位'))
        }
        return Promise.resolve()
      },
    },
  ]}
>
  <Input placeholder="请输入手机号" />
</Form.Item>
```

`itemProps` 具体内容：

**方式二：函数写法**

```jsx
<Form.Item
  name="password"
  label="账户密码"
  rules={[
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject(new Error('请输入账户密码'))
        }
        if (value === getFieldValue('password')) {
          console.log('getFieldValue() 方法获取对应字段名的值')
        }
        return Promise.resolve()
      },
    }),
  ]}
>
  <Input placeholder="请输入你的账户密码" />
</Form.Item>
```

相比而言，方式二的自由度更高，功能也相对更强大，因为提供了 `getFieldValue()` 等方法使用。

但个人认为，方式一的写法更加优雅，并且一般情况下，方式一也足够使用了，可以解决日常工作大部分自定义表单验证规则的场景。

[getFieldValue](https://ant.design/components/form-cn#forminstance){link=card}

## Select 下拉框设置初始值

在开发工作中，需要为 `Form` 表单中的 `Select` 下拉框设置初始值的情况也屡见不鲜。下面介绍两种常见的解决方式。

### 使用 `setFieldsValue()`

该方法通过利用 `Form` 表单实例提供的 `setFieldsValue()` 方法设置初始值，在页面初次展示即可调用该方法设置初始值。

```jsx
const showModal = () => {
  form.setFieldsValue({
    color: "red",
    ...
  });
  ...
}
```

```jsx
<Form.Item name="color" label="车辆外表颜色" rules={[{ required: true, message: '请选择车辆外表颜色' }]}>
  <Select placeholder="请选择车辆外表颜色" {...props}>
    <Option key={1} value="red">
      红色
    </Option>
    <Option key={2} value="yellow">
      黄色
    </Option>
    <Option key={3} value="blue">
      蓝色
    </Option>
  </Select>
</Form.Item>
```

### 使用 `initialValues` 属性

通过使用 `Form` 表单的 `initialValues` 属性，也能够为表单域设置初始值。

```jsx
const initialValues = { color: 'yellow' }

;<Form form={form} initialValues={initialValues}>
  <Form.Item name="color" label="车辆外表颜色" rules={[{ required: true, message: '请选择车辆外表颜色' }]}>
    <Select placeholder="请选择车辆外表颜色" {...props}>
      <Option key={1} value="red">
        红色
      </Option>
      <Option key={2} value="yellow">
        黄色
      </Option>
      <Option key={3} value="blue">
        蓝色
      </Option>
    </Select>
  </Form.Item>
</Form>
```

### 使用 `initialValue` 属性

通过使用 `Form.Item` 的 `initialValue` 属性，单独为该表单项设置初始值，不影响其他表单项。

```jsx
<Form.Item name="color" label="车辆外表颜色" rules={[{ required: true, message: '请选择车辆外表颜色' }]} initialValue="blue">
  <Select placeholder="请选择车辆外表颜色" {...props}>
    <Option key={1} value="red">
      红色
    </Option>
    <Option key={2} value="yellow">
      黄色
    </Option>
    <Option key={3} value="blue">
      蓝色
    </Option>
  </Select>
</Form.Item>
```

### 错误：使用 `defaultValue` 属性

当时遇到这个问题时，我第一个想法是利用 `Select` 下拉框的 `defaultValue` 属性，来设置默认值，如下代码：

```jsx
<Form.Item name="color" label="车辆外表颜色">
  <Select defaultValue="red">
    <Option key={1} value="red">
      红色
    </Option>
    <Option key={2} value="yellow">
      黄色
    </Option>
    <Option key={3} value="blue">
      蓝色
    </Option>
  </Select>
</Form.Item>
```

但是该方法并不生效，这是因为 `Form.Item` 设置了 `name` 属性，Ant Design 增加了限制，导致其不生效。

> 设置了  name  属性的  Form.Item  包裹的表单控件，**不能用控件的  value  或  defaultValue  来设置表单域的值，默认值可以用  Form  的  initialValues  来设置**。

### 官网文档相关说明

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15d308e0f8f84a54880fa5d00afdcfa0~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9df3946685d74292b59c16e63e957c48~tplv-k3u1fbpfcp-watermark.image?)

相关链接：[Form 表单](https://ant.design/components/form-cn)
