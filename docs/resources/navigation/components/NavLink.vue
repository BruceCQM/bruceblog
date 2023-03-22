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
import errorImg from '/logo.png'

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
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: var(--vp-c-bg-soft);
  }
  -webkit-box-orient: vertical;
  .box {
    display: flex;
    flex-direction: column;
    padding: 16px;

    &-header {
      display: flex;
      align-items: center;

      .icon {
        width: 48px;
        height: 48px;
        margin-right: 12px;
        border-radius: 8px;
        background-color: var(--vp-c-bg-soft);
        // box-sizing: border-box;
        // padding: 8px;
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
        line-height: 48px;
        text-overflow: ellipsis;
      }
    }

    .desc {
      margin: 10px 0 0;
      color: var(--vp-c-text-2);
      font-size: 12px;
      line-height: 20px;
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

// .bb-link {
//   display: block;
//   border: 1px solid var(--vp-c-bg-soft);
//   border-radius: 12px;
//   height: 100%;
//   cursor: pointer;
//   // transition: all 1s;
//   &:hover {
//     background-color: var(--vp-c-bg-soft);
//   }

//   .box {
//     display: flex;
//     flex-direction: column;
//     padding: 16px;
//     height: 100%;
//     color: var(--vp-c-text-1);
//     &-header {
//       display: flex;
//       align-items: center;
//     }
//   }

//   .icon {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     margin-right: 12px;
//     border-radius: 6px;
//     width: 48px;
//     height: 48px;
//     font-size: 24px;
//     background-color: var(--vp-c-mute);
//     transition: background-color 0.25s;
//     :deep(svg) {
//       width: 24px;
//       fill: currentColor;
//     }
//     :deep(img) {
//       border-radius: 4px;
//       width: 24px;
//     }
//   }

//   .title {
//     overflow: hidden;
//     flex-grow: 1;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//     line-height: 48px;
//     font-size: 16px;
//     font-weight: 600;
//   }

//   .desc {
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     flex-grow: 1;
//     margin: 10px 0 0;
//     line-height: 20px;
//     font-size: 12px;
//     color: var(--vp-c-text-2);
//   }
// }

// @media (max-width: 960px) {
//   .bb-link {
//     .box {
//       padding: 8px;
//     }
//     .icon {
//       width: 40px;
//       height: 40px;
//     }
//     .title {
//       line-height: 40px;
//       font-size: 14px;
//     }
//   }
// }
</style>