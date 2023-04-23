---
layoutClass: bruceblog-navigation
outline: [2, 3, 4]
---

<script setup>
import NavLinks from './components/NavLinks.vue'

import data from './data'
</script>
<style src="../../styles/nav.scss"></style>

# 站点导航

:::tip 鸣谢
感谢 [maomao](https://github.com/maomao1996/vitepress-fe-nav) 对导航页面的开源与教学！[掘金文章](https://juejin.cn/post/7204860462239498296)
:::

<NavLinks v-for="{title, items} in data" :title="title" :items="items"/>
