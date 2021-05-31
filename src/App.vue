<template>
  <div id="nav">
    <router-link to="/">未阅图书</router-link> |
    <router-link to="/finished">已阅图书</router-link>
    <h2>目前共有 {{ bookCount }} 本图书</h2>
  </div>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useBookListInject } from "./context";

export default defineComponent({
  setup() {
    const route = useRoute();

    const { booksAvaluable, finishedBooks } = useBookListInject();
    
    const bookCount = computed(() => {
      if(!route.name) return 0;
      if(route.name === "all") return booksAvaluable.value.length;
      if(route.name === "finished") return finishedBooks.value.length;
      return 0;
    });
    
    return {
      bookCount,
    };
  },
});
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
