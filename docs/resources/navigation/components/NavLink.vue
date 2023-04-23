<template>
  <a v-if="link" class="bb-link" :href="link" target="_blank"
    rel="noreferrer">
    <article class="box">
      <div class="box-header">
        <div v-if="svg" class="icon" v-html="svg"></div>
        <div v-else-if="icon && typeof icon === 'string'"
          class="icon">
          <img :src="loadingImg" :alt="title"
            :onload="onLoadImg(icon)"
            onerror="this.parentElement.style.display = 'none'" />
        </div>
        <h6 v-if="title" class="title">{{ title }}</h6>
      </div>
      <div v-if="desc" class="desc">{{ desc }}</div>
    </article>
  </a>
</template>

<script>
import { computed } from "vue";
import loadingImg from '/loading.gif'

export default {
  name: "NavLink",
  props: ["icon", "title", "desc", "link"],
  setup: (props, context) => {
    const svg = computed(() => {
      if(typeof props.icon === "object") return props.icon.svg;
      return "";
    });

    function onLoadImg(icon) {
      return `this.src="${icon}"`
    }

    return {
      svg,
      loadingImg,
      onLoadImg,
    }
  },
};
</script>

<style lang="scss" scoped>
.bb-link {
  display: block;
  border: 1px solid var(--vp-c-bg-soft-mute);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s;
  background-color: var(--vp-c-bg-soft);

  &:hover {
    background-color: var(--vp-c-white);
    transform: translateY(-8px);
    box-shadow: 6px 10px 10px var(--vp-c-divider);
    border-color: var(--vp-c-yellow-lighter);
  }

  .box {
    display: flex;
    flex-direction: column;
    padding: 8px 16px;

    &-header {
      display: flex;
      align-items: center;

      .icon {
        width: 48px;
        height: 48px;
        margin-right: 12px;
        border-radius: 8px;
        background-color: var(--vp-c-bg-soft-down);
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          border-radius: 4px;
          width: 36px;
        }
      }

      .title {
        color: var(--vp-c-text-1);
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
      }
    }

    .desc {
      margin: 10px 0 0;
      color: var(--vp-c-text-1);
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

// 暗黑模式样式
.dark {
  .bb-link {
    &:hover {
      background-color: var(--vp-c-bg-soft-mute);
    }
  }
}

@media (max-width: 960px) {
  .bb-link {
    .box {
      padding: 8px;

      &-header {
        .icon {
          width: 36px;
          height: 36px;

          img {
            width: 24px;
          }
        }
        .title {
          font-size: 14px;
        }
      }

      .desc {
        margin-top: 8px;
      }
    }
  }
}
</style>