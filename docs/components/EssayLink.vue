<template>
  <a :href="link" target="_blank" class="essay-container">
    <article class="essay-content">
      <img class="icon" :src="icon" :alt="title"
        onerror="this.src = '/logo.png'">
      <div class="essay-text">
        <div class="essay-title">{{ title }}</div>
        <div class="essay-link">{{ link }}</div>
      </div>
    </article>
  </a>
</template>

<script>
export default {
  name: "EssayLink",
  props: ['icon', 'title', 'link'],
  setup: () => {
  }
};
</script>

<style lang="scss" scoped>
.essay-container {
  --iconWidth: 48px;
  --iconRight: 12px;
  display: block;
  border: 1px solid var(--vp-c-bg-soft-mute);
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s;
  margin-bottom: 10px;

  &:hover {
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-green);
  }

  .essay-content {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .icon {
    width: var(--iconWidth);
    margin-right: var(--iconRight);
    border-radius: 4px;
  }

  .essay-text {
    width: calc(100% - var(--iconWidth) - var(--iconRight));
  }

  .essay-title,
  .essay-link {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .essay-title {
    color: var(--vp-c-text-1);
    font-weight: 700;
  }

  .essay-link {
    font-size: 14px;
    color: var(--vp-c-text-2);
  }
}
</style>