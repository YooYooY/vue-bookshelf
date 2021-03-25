# vue-bookshelf

基于 Vue3 实现的小型图书应用，掌握 `composition-api` 在项目中的使用，可以作为 Vue3 的练习项目，项目参考于 [sl1673495/vue-bookshelf](https://github.com/sl1673495/vue-bookshelf)。

## Project setup

```sh
npm install
```

## Compiles and hot-reloads for development

```sh
npm run serve
```

## Compiles and minifies for production

```sh
npm run build
```

## 前言

项目参考 [sl1673495/vue-bookshelf](https://github.com/sl1673495/vue-bookshelf)，由于参考项目还是基于 `vue2+composition-api`，这里用正式发布的`vue3`做了修改。

项目的功能和逻辑很简单，适合作为vue3的 **入门练习** 项目。

项目中会用到的 Vue3 api，你需要在开始之前对它们有所了解:

- [x] Provide / Inject
- [x] ref、reactive、watch、computed
- [x] directive
- [x] 生命周期函数
- [x] v-model 多选项绑定

## provide/inject代替vuex

Vue3 中新增的一对api，`provide` 和 `inject`，可以很方便的管理应用的全局状态，有兴趣可以参考下这篇文章：[Vue 3 store without Vuex](https://oshap1044.medium.com/how-did-i-create-a-global-store-in-vue-3-5e44e680548b)

官方文档对 `Provide / Inject` 的使用说明：[Provide / Inject](https://v3.vuejs.org/guide/composition-api-provide-inject.html)

利用这两个api，在没有vuex的情况下也可以很好的管理项目中的全局状态：
```js
import { provide, inject } from 'vue'

const ThemeSymbol = Symbol()

const Ancestor = {
  setup() {
    provide(ThemeSymbol, 'dark')
  }
}

const Descendent = {
  setup() {
    const theme = inject(ThemeSymbol, 'light' /* optional default value */)
    return {
      theme
    }
  }
}
```

## 开始

### 项目介绍

项目很简单，主要逻辑如下：

- 加载图书列表数据
- 路由页：未阅图书列表/已阅图书列表
- 功能：设置图书已阅、删除图书已阅

### 项目搭建

项目基于 `vue-cli` 搭建：

- typescript
- vue3
- vue-router
- sass

### context

项目基于 `Provide/Inject` 实现全局的图书状态管理，`context/books.ts`包含两个组合函数：

- `useBookListProvide` 提供书籍的全局状态管理和方法
- `useBookListInject` 书籍状态和方法注入（在需要的组件中使用）

在main.ts中，根组件注入全局状态：

```ts
// main.ts
import { createApp, h } from 'vue'
import App from './App.vue'
import { useBookListProvide } from '@/context'

const app = createApp({
  setup() {
    useBookListProvide();
    return () => h(App)
  }
})
```

组件中使用：
```ts
import { defineComponent } from "vue";
import { useBookListInject } from "@/context";
import { useAsync } from "@/hooks";
import { getBooks } from "@/hacks/fetch";

export default defineComponent({
  name: "books",
  setup() {
  // 注入全局状态
    const { setBooks, booksAvaluable } = useBookListInject();
    
 // 获取数据的异步组合函数
    const loading = useAsync(async () => {
      const requestBooks = await getBooks();
      setBooks(requestBooks);
    });

    return {
      booksAvaluable,
      loading,
    };
  }
});
```

组合函数 `useAsync` 目的是管理异步方法前后loading状态:
```ts
import { onMounted, ref } from 'vue'

export const useAsync = (func: () => Promise<any>) => {
  const loading = ref(false)
  onMounted(async () => {
    try {
      loading.value = true
      await func()
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  })

  return loading
}
```

组件中使用：
```html
<Books :books="booksAvaluable" :loading="loading"></Books>
```

### 分页

对于分页这里使用组合函数 `usePages` 进行管理，目的是返回当前页的图书列表和分页组件所需的参数：
```ts
import { reactive, Ref, ref, watch } from 'vue'

export interface PageOption {
  pageSize?: number
}

export function usePages<T>(watchCallback: () => T[], pageOption?: PageOption) {
  const { pageSize = 10 } = pageOption || {}

  const rawData = ref([]) as Ref<T[]>
  const data = ref([]) as Ref<T[]>

  const bindings = reactive({
    current: 1,
    currentChange: (currentPage: number) => {
      data.value = sliceData(rawData.value, currentPage)
    },
  })

  const sliceData = (rawData: T[], currentPage: number) => {
    return rawData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }

  watch(
    watchCallback,
    (value) => {      
      rawData.value = value
      bindings.currentChange(1)
    },
    {
      immediate: true,
    }
  )

  return {
    data,
    bindings,
  }
}
```

基于 `composition-api` 可以很方便的将统一的逻辑进行拆分，例如分页块的逻辑，很可能在其它的业务模块中使用，所以统一拆分到了`hooks`文件夹下。

这里简单实现了分页插件，参考 [element-plus/pagination](https://element-plus.gitee.io/#/zh-CN/component/pagination) 的分页组件。

```html
<Pagination
  class="pagination"
  :total="books.length"
  :page-size="pageSize"
  :hide-on-single-page="true"
  v-model:current-page="bindings.current"
  @current-change="bindings.currentChange"
/>
```
Vue3 可以实现在组件上使用多个 `v-model` 进行双向数据绑定，让 `v-model` 的使用更加灵活，详情可查看官方文档 [v-model](https://www.vue3js.cn/docs/zh/guide/migration/v-model.html#%E6%A6%82%E8%A7%88)。

项目中的分页组件也使用了`v-model:current-page` 的方式进行传参。

### 图片加载指令

vue3 的指令也做了更新: [官方文档-directives](https://v3.vuejs.org/guide/migration/custom-directives.html)

主要是生命周期函数的变化：
```js
const MyDirective = {
  beforeMount(el, binding, vnode, prevVnode) {},
  mounted() {},
  beforeUpdate() {}, // new
  updated() {},
  beforeUnmount() {}, // new
  unmounted() {}
}
```

项目中的指令主要是针对图片src做处理，`directives/load-img-src.ts`：
```ts
// 图片加载指令，使用 <img src="默认路径" v-loadImgSrc="图片加载路径">

// 图片加载失败路径
const errorURL =
  'https://imgservices-1252317822.image.myqcloud.com/image/20201015/45prvdakqe.svg'

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
```
