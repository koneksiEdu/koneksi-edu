<template>
    <h1 class="text-2xl font-bold text-center my-text mb-2">
      {{ link.title }}
    </h1>
  </template>
  
<script setup>
defineProps({
  link: Object,
  props:{
    cssVariables: Object
  }
})
</script>

<style scoped>
.my-text {
  color: var(--text-color)
}
</style>