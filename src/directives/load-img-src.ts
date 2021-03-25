// 图片加载指令，使用 <img src="默认路径" v-loadImgSrc="图片加载路径">

// 图片加载失败路径
const errorURL =
  'https://imgservices-1252317822.image.myqcloud.com/image/20201015/45prvdakqe.svg'

/*
* vue3 的指令更新了生命周期函数
* https://v3.vuejs.org/guide/migration/custom-directives.html
*/
const loadImgSrc = {
  beforeMount(el: HTMLImageElement, binding: { value: string }) {
    const imgURL = binding.value || ''
    const img = new Image()
    img.src = imgURL
    img.onload = () => {
      if (img.complete) {
        el.src = imgURL
      }
    }
    img.onerror = () => (el.src = errorURL)
  },
}

export default loadImgSrc
