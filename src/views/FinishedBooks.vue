<template>
  <Books :books="finishedBooks">
    <template v-if="isEmpty" #tips> 暂无已阅图书 </template>
  </Books>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useBookListInject } from "@/context";
import Books from "@/components/Books.vue";

export default defineComponent({
  name: "finishedBooks",
  setup() {
    const { finishedBooks } = useBookListInject();
    const isEmpty = computed(() => !finishedBooks.value.length);
        
return {
      finishedBooks,
      isEmpty,
    };
  },
  components: {
    Books,
  },
});
</script>