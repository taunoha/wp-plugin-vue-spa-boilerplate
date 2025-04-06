<script setup>
useHead({
  title: "About",
});
</script>

<template>
  <h1>About</h1>
  <RouterLink to="/" :aria-label="__('Go to Home')">
    {{ __("Go to Home") }}
  </RouterLink>
  <br />
  <RouterLink to="/about/1">
    {{ __("Go to About 1") }}
  </RouterLink>
</template>
