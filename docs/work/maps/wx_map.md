## 前言

最近接了个跟微信小程序地图有关的开发任务，第一次在小程序上开发地图，既兴奋又忐忑。还好，虽然小程序地图的 API 功能有些少，但是基本的需求都能覆盖到。

在这里，对微信小程序地图开发的基本功能进行总结归纳。官方文档对地图属性、方法的归纳比较到位，但缺乏示例代码，第一次搞还是有点迷糊的。网上的文章又写得七零八落，没见到有人专门总结归纳。

本人使用 **React + Taro** 开发的微信小程序，因此使用的是 Taro 提供的地图 API，但是和微信官方的是一样的，Taro 不过是二次封装而已。

相关链接：

[Taro Map 组件](https://taro-docs.jd.com/docs/components/maps/map){link=card}
[Taro Map 实例方法](https://taro-docs.jd.com/docs/apis/media/map/MapContext){link=card}
[微信官方文档 map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html){link=card}

## 创建地图

引入 `Map` 组件，再像普通组件使用即可。可以添加很多属性，各个属性的作用详见 [Taro 文档](https://taro-docs.jd.com/docs/components/maps/map)。

```js
import { Map } from '@tarojs/components'

class TaroMap extends Component {
  render() {
    return <Map id="taroMap" longitude={100} latitude={90} show-location />
  }
}
```

## 在地图画标记点

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

## 在地图画圆圈

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

## 初始化地图中心为当前位置，并画圈

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

## 始终固定图标在地图中心

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
