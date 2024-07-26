<template>
  <div class="relative flex justify-center items-center">
    <i class="bi bi-cart-fill text-2xl my-text cursor-pointer" @click="openCartModal"></i>
    <span v-show="itemValue > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{{ itemValue }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/stores';

const route = useRoute();
const username = ref(route.params.id);
const cartStore = useCartStore();
const itemValue = ref(0)
const emit = defineEmits(['checkoutTriggered'])

defineProps({
  props:{
    cssVariables: Object
  }
})

const openCartModal = () => {
  emit('checkoutTriggered')
};

const updateItemValue = () => {
  itemValue.value = cartStore.getItemFromCart(username.value);
};

onMounted(() => {
  updateItemValue();
});

defineExpose({updateItemValue})
</script>

<style scoped>
.my-text {
  color: var(--text-color)
}
</style>
