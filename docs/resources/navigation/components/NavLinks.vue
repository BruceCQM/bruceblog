<template>
  <!-- 给h标题添加id，vitepress即可自动生成目录 -->
  <h2 v-if="title" :id="title">
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
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  grid-auto-flow: row dense;
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
</style>