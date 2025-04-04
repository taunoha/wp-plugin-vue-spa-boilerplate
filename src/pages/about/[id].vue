<script setup>
const route = useRoute();

useHead({
  title: computed(() => `About ${route.params.id}`),
});
</script>

<template>
  <h1>About Me</h1>
  <p>Hello, {{ route.params.id }}!</p>
</template>
