<template>
  <img v-if="!DEV" class="visitor"
    src="https://visitor-badge.laobi.icu/badge?page_id=bruceblog_pages_55520"
    title="How many people visit this page"
    onerror="this.style.display='none'" />
</template>

<script>
import { inject } from "vue";

export default {
  name: 'TotalVisitors',
  setup: () => {
    const DEV = inject("DEV");
    return {
      DEV,
    }
  }
}
</script>

<style scoped>
.visitor {
  margin-left: 10px;
  margin-top: 2px;
}
/* @media (min-width: 768px) and (max-width: 920px) {
  .visitor {
    display: none;
  }
} */
</style>
