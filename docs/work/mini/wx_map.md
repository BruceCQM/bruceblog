## 前言

最近接了个跟微信小程序地图有关的开发任务，第一次在小程序上开发地图，既兴奋又忐忑。还好，虽然小程序地图的 API 功能有些少，但是基本的需求都能覆盖到。

在这里，对微信小程序地图开发的基本功能进行总结归纳。官方文档对地图属性、方法的归纳比较到位，但缺乏示例代码，第一次搞还是有点迷糊的。网上的文章又写得七零八落，没见到有人专门总结归纳。

本人使用 **React + Taro** 开发的微信小程序，因此使用的是 Taro 提供的地图 API，但是和微信官方的是一样的，Taro 不过是二次封装而已。

相关链接：

[Taro Map 组件](https://taro-docs.jd.com/docs/components/maps/map){link=card}
[Taro Map 实例方法](https://taro-docs.jd.com/docs/apis/media/map/MapContext){link=card}
[微信官方文档 map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html){link=card}

## 常见用法

### 创建地图

引入 `Map` 组件，再像普通组件使用即可。可以添加很多属性，各个属性的作用详见 [Taro 文档](https://taro-docs.jd.com/docs/components/maps/map)。

```js
import { Map } from '@tarojs/components'

class TaroMap extends Component {
  render() {
    return <Map id="taroMap" longitude={100} latitude={90} show-location />
  }
}
```

### 在地图画标记点

通过设置 `Map` 组件的 `markers` 属性，在地图上设置标记点。

标记点一般都需要设置这几个属性：

- `id`：设置标记点的 id
- `longitude`：设置标记点经度
- `latitude`：设置标记点纬度
- `iconPath`：设置标记点图标
- `width`：设置宽度
- `height`：设置高度

```js
import { Map } from '@tarojs/components'
import markerImg from './example.svg'

class TaroMap extends Component {
  markers = [
    {
      id: 0,
      iconPath: markerImg,
      longitude: 100,
      latitude: 20,
      width: 50,
      height: 50,
    },
    {
      id: 1,
      iconPath: markerImg,
      longitude: 100,
      latitude: 20,
      width: 50,
      height: 50,
    },
  ]

  render() {
    return <Map id="taroMap" longitude={100} latitude={90} show-location markers={markers} />
  }
}
```

### 在地图画圆圈

通过设置 `Map` 组件的 `circles` 属性，在地图上画圈。

圆圈一般都需要设置这几个属性：

- `longitude`：设置圆圈中心经度
- `latitude`：设置圆圈中心纬度
- `color`：设置圆圈边缘颜色
- `fillColor`：设置圆圈填充颜色
- `radius`：设置圆圈半径，单位是米，这里是实际的半径大小

```js
import { Map } from '@tarojs/components'

class TaroMap extends Component {
  circles = [
    {
      longitude: 100,
      latitude: 20,
      color: '#30BC6B',
      fillColor: 'blue',
      radius: 500,
    },
  ]

  render() {
    return <Map id="taroMap" longitude={100} latitude={90} show-location circles={circles} />
  }
}
```

### 初始化地图中心为当前位置，并画圈

大部分地图都会在进入页面时把中心移动到当前位置，同时会以当前位置为中心画一个圆圈。

该需求主要利用 [`getLocation()`](https://taro-docs.jd.com/docs/apis/location/getLocation) 方法来实现，`getLocation()` 方法可以获取当前的地理位置、速度等信息。

```js
import { Map } from '@tarojs/components'

class TaroMap extends Component {
  state = {
    longitude: 100,
    latitude: 90,
    circles: [],
  }

  componentDidMount() {
    this.getCurrentLocation()
  }

  getCurrentLocation = async () => {
    const res = await Taro.getLocation({ type: 'gcj02' })
    const { longitude, latitude } = res
    this.setState({
      longitude,
      latitude,
      circles: [
        {
          longitude,
          latitude,
          color: 'red',
          fillColor: 'green',
          radius: 500,
        },
      ],
    })
  }

  render() {
    const { longitude, latitude } = this.state

    return <Map id="taroMap" longitude={longitude} latitude={latitude} show-location circles={circles} />
  }
}
```

### 始终固定图标在地图中心

平时常见的地图，往往都会有一个图标固定在地图的中心，并且无论如何拖动地图，位置都始终不变。

在旧版的微信小程序地图中，这个功能需要使用 `control` 控件实现，但官方已经明确说明即将废弃该方式。后来又通过利用视图容器 `cover-view` 来实现，但是 2023 年的现在连 `cover-view` 也不需要了，直接使用普通的 `view` 容器组件即可。

这样一来，就是很普通的设置元素水平垂直居中的问题了。

:::tip 官方说明
目前原生组件均已支持同层渲染，建议使用 view 替代
:::

```js
import { Map, View, Image } from '@tarojs/components'

class TaroMap extends Component {
  render() {
    return (
      <Map id="taroMap" longitude={100} latitude={90} show-location className="map">
        <View className="center">
          <Image className="center--image" src="./marker.png" />
        </View>
      </Map>
    )
  }
}
```

```scss
.map {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center--image {
  width: 70px;
  height: 70px;
}
```

### 返回当前位置

点击返回图标，让地图回到当前位置，几乎是每个地图都必备的功能。而这个功能实现起来其实非常简单。

首先调用 `createMapContext()` 创建一个地图实例对象，再调用地图实例的 `moveToLocation()` 方法将地图中心移动到当前定位点即可。

```js
handleBackCurrenLocation = () => {
  // 需要把地图的id传入
  const wxMap = Taro.createMapContext(mapId)
  wxMap.moveToLocation({})
}
```

### 地图拖动展示不同的标记点

由于地图上的标记点可能会非常多，所以一般都不会一口气把所有的点都画到地图上，而是展示地图中心某个范围之内的点。

拖动地图，再展示新的地图中心附近的标记点。

该功能的实现需要用到 `onRegionChange` 事件，当地图视野发生变化时会触发该事件，也就是拖动地图。像这种频繁触发的事件，最好防抖。

```js
import _ from 'lodash'

class TaroMap extends Component {
  // 防抖500毫秒
  onRegionChange = _.debounce(async (e) => {
    const { type, detail } = e;
    // 拖动地图会触发两次onRegionChange事件，我们只需要拖动结束时的事件
    if (type === 'end') {
      const { centerLocation: { longitude, latitude } } = detail;
      // ...获取新的标记点
      const markers = [];
      this.setState({ markers });
      }
    }
  }, 500)

  render() {
    <Map
      id="taroMap"
      longitude={100}
      latitude={90}
      show-location
      className="map"
      onRegionChange={this.onRegionChange}
    >
      <View className="center">
        <Image className="center--image" src='./marker.png' />
      </View>
    </Map>
  }
}
```


### 地图设置圆角

微信小地图比较坑，直接给 `Map` 组件设置 `border-radius` 属性是无法生效的，并没有圆角。

需要在外层套一个 `View`，并且设置地图的大小略大于外层盒子，再给外层盒子设置溢出隐藏。

IOS 地图圆角不生效，还需要加上 `transform: 'translateY(0)'`。

```jsx
<View 
  style={{
    width: '100%', 
    height: '290rpx', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    transform: 'translateY(0)'
  }}
>
  <Map
    style={{ width: '100%', height: '330rpx' }}
    className="map"
    circles={circles}
    longitude={longitude}
    latitude={latitude}
    showLocation
  />
</View>
```

[map地图组件设置圆角](https://developers.weixin.qq.com/community/develop/doc/000088de32c6d80c00e7444895ac00){link=card}

## 一些坑点

- 使用 `circles` 属性画圆圈，**颜色只能使用十六进制写法**，否则在手机预览会不生效。`rgba` 的颜色写法只在微信开发者工具上生效，手机不生效。
- 使用 `Taro.moveToLocation` 将地图中心移动到当前位置，在手机预览会出现问题。第一次进地图可以正常移动，但是退出地图再进入就无法移动到当前位置。可以通过设置 `<Map>` 的 `longitude` 和 `latitude` 属性来设置地图的初始中心位置。
- 目前小程序地图已经支持同层渲染，不需要再使用 `controls`、`cover-view`，直接使用普通的 `view` 视图组件即可，默认会在地图上方。
- 图标 `markers` 的 `id` 如果数字太大，会转换错误，即使手动使用 `Number()` 也会错误。**无法通过 `onMarkerTap` 事件获取到正确的 `id`**。只能寻找其他小数字且唯一的值。
- 手机预览的情况下，`markers` 无法正确显示 `svg` 图片，需要使用 `png` 图片。