
<template>
  <transition name="fade">
    <div v-show="isShow" id="back_to_top" title="返回顶部"
      @click="handleBackTop" />
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'BackToTop',
  setup: () => {
    let isShow = ref(false);
    window.addEventListener('scroll', () => {
      if(window.pageYOffset > 300) {
        isShow.value = true;
      } else {
        isShow.value = false;
      }
    });

    function handleBackTop() {
      const asideElements = document.getElementsByClassName('aside-container');
      const [aside] = asideElements || [];
      // 目录也返回顶部
      if(aside) {
        aside.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
      // 页面返回顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    return {
      handleBackTop,
      isShow,
    }
  }
}

</script>

<style lang="scss" scoped>
#back_to_top {
  border-left: 4px solid var(--vp-c-green);
  border-top: 4px solid var(--vp-c-green);
  width: 22px;
  height: 22px;
  position: fixed;
  bottom: 1.5rem;
  right: 2.5rem;
  transform: rotate(45deg);
  cursor: pointer;
  transition: all 0.8s;
  z-index: 99;

  &:hover {
    opacity: 0.5;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
