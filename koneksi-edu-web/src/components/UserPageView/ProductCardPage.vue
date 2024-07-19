<template>
  <div @click="showDetail" class="animate__animated animate__bounceIn rounded overflow-hidden shadow-lg bg-white cursor-pointer">
    <img class="w-full" :src="product.image_url" :alt="product.title">
    <div class="px-6 py-4">
      <div class="font-bold text-center text-blue-400 text-sm mb-2 line-clamp-2">
        {{ product.title }}
      </div>
      <p class="text-gray-700 text-[10px] text-center price-text">
        {{ formattedPrice }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.product.price);
    }
  },
  methods: {
    showDetail() {
      this.$emit('show-detail', this.product);
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /* Standard property for future compatibility */
  line-clamp: 2;
  box-orient: vertical;
}

/* Ensuring price text wraps within the card */
.price-text {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>