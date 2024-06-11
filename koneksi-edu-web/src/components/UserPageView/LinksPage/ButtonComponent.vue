<template>
  <a
    :href="link.url"
    class="w-full mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-center"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ link.title }}
  </a>
</template>

<script setup>
defineProps({
  link: Object
})
</script>

<style scoped>

</style>