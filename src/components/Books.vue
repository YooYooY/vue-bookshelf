<template>
  <section class="wrap">
    <span v-if="loading">正在加载中...</span>
    <section v-else class="content">
      <ul>
        <Book v-for="book in pagedBooks" :book="book" :key="book.id" />
      </ul>
      <Pagination
        class="pagination"
        v-if="pagedBooks.length"
        :total="books.length"
        :page-size="pageSize"
        :hide-on-single-page="true"
        v-model:current-page="bindings.current"
        @current-change="bindings.currentChange"
      />
    </section>
    <slot name="tips"></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType,Ref,watch } from "vue";
import { usePages } from "@/hooks";
import { Books } from "@/types";
import Pagination from "@/components/Pagination";
import Book from "./Book.vue";

export default defineComponent({
  name: "books",
  props: {
    books: {
      type: Array as PropType<Books>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const pageSize = 5;

    const { bindings, data: pagedBooks } = usePages(() => props.books, {
      pageSize,
    });
        
    
    return {
      bindings,
      pagedBooks,
      pageSize,
    };
  },
  components: {
    Pagination,
    Book,
  },
});
</script>

<style>
</style>