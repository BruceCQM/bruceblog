const defaultLogo = '/bruceblogpages/logo.png';

/**
 * @description 从所给的URL中提取标题、摘要、图片等信息
 * @param {*} link 文章URL
 * @returns 包含title、description、images属性的对象
 * { title, description, images }
 * @example 
 * const { title, description, images } = getInfoFormUrl('www.haha.com');
 */
async function getInfoFromUrl(link) {
  let title = '';
  let description = '';
  let images = '';

  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`);
    const resp = await res.json();
    const content = resp.contents;
    const template = document.createElement('template');
    template.innerHTML = content;
    const htmlPage = template.content;

    // 提取所有 meta 标签的属性
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
    title = htmlPage.querySelector('title').textContent
      || getMetaValue('name', 'og:title') || getMetaValue('property', 'og:title');

    description = getMetaValue('name', 'description') || getMetaValue('name', 'og:description')
      || getMetaValue('property', 'og:description') || link;

    const firstImg = htmlPage.querySelector('img');
    images = getMetaValue('name', 'image') || getMetaValue('property', 'image')
      || getMetaValue('name', 'og:image') || getMetaValue('property', 'og:image')
      || getMetaValue('name', 'twitter:image') || getMetaValue('property', 'twitter:image')
      || htmlPage.querySelector('link[rel=icon]')?.href || htmlPage.querySelector('link[apple-touch-icon]')?.href
      || firstImg.getAttribute('data-src') || firstImg?.src;

    return {
      title,
      description,
      images
    }
  } catch(err) {
    return {
      title,
      description,
      images
    }
  }
}

/**
 * @description 根据URL抓取图片，避免直接访问URL跨域的问题
 * @param {*} url 图片URL
 * @returns 图片的base64编码
 */
async function getImageContent(url) {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const resp = await res.json();
    return resp.contents;
  } catch(err) {
    return '';
  }
}

/**
 * @description 设置卡片链接的innerHTML
 * @param {*} el a元素
 * @param {*} info 信息对象
 */
function replaceInnerHTML(el, info) {
  const { title, desc, icon } = info;

  el.innerHTML = `
  <article class="essay-content">
    <img class="icon" src="${icon}" alt="${title}" onerror="this.src='/bruceblogpages/logo.png'">
    <div class="essay-text">
      <div class="essay-title">${title}</div>
      <div class="essay-link">${desc}</div>
    </div>
  </article>
`
}

/**
 * @description 将页面所有link属性为card的a标签转为链接卡片
 */
export default function transformLinkToCard(documentEle) {
  // 不加这个定时器获取不到需要的a标签
  setTimeout(() => {
    const cardLinks = Array.from(documentEle?.querySelectorAll?.('a[link=card]'));
    if(Array.isArray(cardLinks)) {
      cardLinks.forEach(async (item, index) => {
        const text = item.textContent;
        const url = item.getAttribute('href');
        const defaultInfo = {
          title: text,
          desc: url,
          icon: defaultLogo
        }

        // 先用默认值渲染卡片
        item.setAttribute('target', '_blank');
        item.setAttribute('class', 'essay-container');
        replaceInnerHTML(item, defaultInfo);

        // 抓取到信息后再更新卡片
        // 3秒发一个抓取请求，避免过于频繁请求，防止服务器误认为是攻击
        setTimeout(async () => {
          const info = await getInfoFromUrl(url)
          const { title, description, images: imageUrl } = info;
          const imagesContent = await getImageContent(imageUrl);
          const newInfo = {
            title: title || text,
            desc: description || url,
            icon: imagesContent || defaultLogo,
          }
          replaceInnerHTML(item, newInfo);
        }, index * 3000);
      })
    }
  }, 0)
}