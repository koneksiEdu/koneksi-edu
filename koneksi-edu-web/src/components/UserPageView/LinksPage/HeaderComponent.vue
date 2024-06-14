<template>
    <h1 class="text-2xl font-bold mb-2">
      {{ link.title }}
    </h1>
  </template>
  
  <script setup>
  defineProps({
    link: Object
  })
  </script>
  