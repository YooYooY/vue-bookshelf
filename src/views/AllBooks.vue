<template>
  <Books :books="booksAvaluable" :loading="loading"></Books>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBookListInject } from "@/context";
import Books from "@/components/Books.vue";
import { useAsync } from "@/hooks";
import { getBooks } from "@/hacks/fetch";

export default defineComponent({
  name: "books",
  setup() {
    const { setBooks, booksAvaluable } = useBookListInject();

    const loading = useAsync(async () => {
      const requestBooks = await getBooks();
      setBooks(requestBooks);
    });

    return {
      booksAvaluable,
      loading,
    };
  },
  components: {
    Books,
  },
});
</script>
