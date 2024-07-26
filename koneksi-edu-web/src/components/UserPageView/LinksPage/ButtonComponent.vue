<template>
  <a
    :href="link.url"
    class="w-full mb-2 myBtn text-white font-bold py-2 px-4 rounded-full text-center"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ link.title }}
  </a>
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
.myBtn {
  background-color: var(--btn-main);
}

.myBtn:hover {
  background-color: var(--btn-hover);
}
</style>