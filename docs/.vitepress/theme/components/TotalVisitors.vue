<script setup>
import { inject } from "vue";

const DEV = inject("DEV");
</script>

<template>
  <img v-if="!DEV" class="visitor"
    src="https://visitor-badge.laobi.icu/badge?page_id=bruceblog_55520"
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
