<!-- Markdown的神器写法 -->
<!-- [learn more](https://www.baidu.com){link=card} -->
<!-- [Github](https://github.com 'class=red&target=_blank&data-layout=card') -->
<template></template>

<script>
import cardFun from '../utils/index';
import { watch } from 'vue';
import { useRoute } from 'vitepress'

export default {
  name: "EssayLink",
  setup: () => {
    const route = useRoute();
    /**
     * 监听路由变化，当路由发生变化时，调用cardFun函数生成卡片链接
     * 保证切换页面都能生成卡片链接
     */
    watch(route, () => cardFun(window.document), { immediate: true, deep: true })
  }
};
</script>

<style lang="scss" scoped></style>