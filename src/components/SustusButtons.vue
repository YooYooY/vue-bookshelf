<template>
  <button v-if="hasReadedBook" @click="removeFinish" class="status-button">删除</button>
  <button v-else @click="handleFinish" class="status-button">已阅</button>
</template>

<script lang="ts">
import { useBookListInject } from "@/context";
import { Book } from "@/types";
import { computed, defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  props: {
    book: Object as PropType<Book>,
  },
  setup(props) {
    const book = props.book!;

    const {
      addFinishedBooks,
      removeFinishedBooks,
      finishedBooks
      // hasReadedBook,
    } = useBookListInject();
    const handleFinish = () => {
      addFinishedBooks(book);
    };
    const removeFinish = () => {
      removeFinishedBooks(book);
    };
    
    const hasReadedBook = computed(()=>{
      return finishedBooks.value.includes(book)
    })

    return {
      handleFinish,
      removeFinish,
      // hasReaded: hasReadedBook(book),
      hasReadedBook
    };
  },
});
</script>

<style scoped>
.status-button{
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 100px;
}
</style>