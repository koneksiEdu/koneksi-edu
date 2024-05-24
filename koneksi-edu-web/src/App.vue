<script setup>
import { watchEffect, ref } from 'vue';
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const authData = ref([]);

watchEffect(() => {
  authData.value = authStore.currentUser;
  console.log(authData.value)
});

</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
