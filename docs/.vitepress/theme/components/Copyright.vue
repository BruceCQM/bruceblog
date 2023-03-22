
<template>
  <div class="copyright_container">
    Copyright © 2019-present BruceBlog
    <img v-if="!DEV" class="visitor"
      :src="`https://visitor-badge.laobi.icu/badge?page_id=bruceblog_pages_55520_${route.path}`"
      title="How many people visit this page"
      onerror="this.style.display='none'" />
  </div>
</template>

<script>
import { inject } from 'vue'
import { useRoute } from 'vitepress'

export default {
  name: 'Copyright',
  setup: () => {
    const DEV = inject('DEV')
    const route = useRoute()
    return {
      DEV,
      route,
    }
  }
}

</script>

<style scoped>
.copyright_container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 30px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.visitor {
  margin-left: 10px;
  margin-top: 1px;
}
/* 
@media (max-width: 414px) {
  .visitor {
    display: none;
  }
} */
</style>
