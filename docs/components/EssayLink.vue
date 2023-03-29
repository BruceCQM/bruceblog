<template>
  <a :href="link" target="_blank" class="essay-container">
    <article class="essay-content">
      <img class="icon" :src="images" :alt="title"
        @error="(e) => handleError(e)">
      <div class="essay-text">
        <div class="essay-title">{{ finalTitle }}</div>
        <div class="essay-link">{{ description }}</div>
      </div>
    </article>
  </a>
</template>

<script>
import logoImg from '/logo.png';
import { ref } from 'vue';

export default {
  name: "EssayLink",
  props: ['icon', 'title', 'link'],
  setup: (props) => {
    const { link, title } = props;
    let finalTitle = ref('');
    let description = ref('');
    let images = ref('');
    function handleError(e) {
      e.target.src = logoImg;
    }

    try {
      fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          const content = resp.contents;
          const template = document.createElement('template');
          template.innerHTML = content;
          const htmlPage = template.content;

          const allMetas = Array.from(htmlPage.childNodes).filter(node => node.nodeName === 'META');
          const allMetaAttributes = allMetas.map(item => {
            return Array.from(item.attributes).reduce((pre, current) => {
              pre[current.name] = current.value;
              return pre;
            }, {})
          })

          const getMetaValue = (key, value) => {
            const meta = allMetaAttributes.find(item => item[key] === value);
            return meta?.['content'] || '';
          }

          // querySelector 好像是异步操作
          finalTitle.value = htmlPage.querySelector('title').textContent
            || getMetaValue('name', 'og:title') || getMetaValue('property', 'og:title') || title;

          description.value = getMetaValue('name', 'description') || getMetaValue('name', 'og:description')
            || getMetaValue('property', 'og:description') || link;

          images.value = getMetaValue('name', 'image') || getMetaValue('name', 'og:image')
            || getMetaValue('name', 'twitter:image') || htmlPage.querySelector('link[rel*=icon]')?.href || logoImg;

          if(link === 'https://www.cnblogs.com/lgt-hello-world/p/12620073.html') {
            console.log('images: ', htmlPage.querySelector('title'));
          }
        })
    } catch(err) {
      finalTitle.value = title;
      description.value = link;
      images.value = logoImg
    }

    return {
      handleError,
      finalTitle,
      description,
      images,
    }
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
    font-size: 12px;
    color: var(--vp-c-text-2);
  }
}
</style>