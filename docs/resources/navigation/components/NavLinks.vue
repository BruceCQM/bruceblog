<template>
  <!-- 给h标题添加id，vitepress即可自动生成目录 -->
  <h2 v-if="title" :id="formatTitle">
    {{ title }}
  </h2>
  <div class="bb-links">
    <NavLink v-for="{ icon, title, desc, link } in items" :key="link"
      :icon="icon" :title="title" :desc="desc" :link="link" />
  </div>
</template>

<script>
import NavLink from './NavLink.vue';
import { slugify } from '@mdit-vue/shared';
import { computed } from 'vue';

export default {
  name: "NavLinks",
  props: ['title', 'items'],
  components: {
    NavLink
  },
  setup: (props) => {
    /**
     * slugify() 方法的作用就只是去除头尾空白，中间空白换成 - 而已
     * ' 以 为是   你  ' => '以-为是-你'
     * 补充：这个转换其实是有用的，如果字符串里面带有空白，那点目录对应标题是无法跳转的
     * 因此 h2 标题的 id 要用格式化后的 title
     */
    const formatTitle = computed(() => slugify(props.title))
    return {
      formatTitle,
    }
  }
}
</script>

<style lang="scss" scoped>
.bb-links {
  --gap: 10px;
  display: grid;
  // 至少120px，还有空余则一起等分
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-auto-rows: 115px;
  // grid-auto-flow: row dense;
  justify-content: center;
  column-gap: var(--gap);
  row-gap: var(--gap);
  margin-top: var(--gap);
}

@each $media,
  $size
    in (500px: 140px, 640px: 155px, 768px: 175px, 960px: 200px, 1440px: 240px)
{
  @media (min-width: $media) {
    .bb-links {
      grid-template-columns: repeat(auto-fill, minmax($size, 1fr));
    }
  }
}

@media (min-width: 960px) {
  .bb-links {
    --gap: 20px;
  }
}

@media (max-width: 960px) {
  .bb-links {
    grid-auto-rows: 100px;
  }
}
</style>