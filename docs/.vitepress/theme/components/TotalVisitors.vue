<script setup>
import { inject } from "vue";

const DEV = inject("DEV");
</script>

<template>
  <img v-if="!DEV" class="visitor"
    src="https://visitor-badge.laobi.icu/badge?page_id=bruceblog_pages_55520"
    title="How many people visit this page"
    onerror="this.style.display='none'" />
</template>

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
