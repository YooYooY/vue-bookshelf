<template>
  <div class="book">
    <div class="book-image">
      <!-- @error.once 只调用一次，防止出错图片加载错误重复加载 -->
      <!-- <img :src="book.coverImageUrl" @error.once="handleErrorSrc" /> -->
      <img :src="logoCover" v-loadImgSrc="book.coverImageUrl" :alt="book.title" />
    </div>
    <div class="book-content">
      <h2>{{ book.title }}</h2>
      <p>{{ book.author }}</p>
      <p>{{ book.publisher }}</p>
      <small :title="book.synopsis"
        >{{ book.synopsis.substring(0, 100) }}...</small
      >
    </div>
    <SustusButtons :book="book"></SustusButtons>
  </div>
</template>

<script lang="ts">
import { Book } from "@/types";
import { defineComponent, PropType } from "@vue/runtime-core";
import logoCover from "@/assets/logo.png";
import SustusButtons from "./SustusButtons.vue";

export default defineComponent({
  name: "book",
  props: {
    book: {
      type: Object as PropType<Book>,
      default: () => ({}),
    },
  },
  setup() {
    const handleErrorSrc = (e: Event) => {
      (e.target as HTMLImageElement).src = logoCover;
    };
    return {
      logoCover,
      handleErrorSrc
    };
  },
  components:{
    SustusButtons
  }
});
</script>

<style>
</style>