<script setup>
import { watchEffect, ref } from 'vue';
import { RouterView } from 'vue-router'
import HeaderPartial from './components/HeaderPartial.vue'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const authData = ref([]);

watchEffect(() => {
  authData.value = authStore.currentUser;
  console.log(authData.value)
});

</script>

<template>
  <HeaderPartial />
  <RouterView />
</template>

<style scoped>
</style>
